const { WebSocket } = require('ws');
const https = require('https');
const crypto = require('crypto');
const { validateSessionToken, notifyMainApp } = require('./auth');
const { createOpenAIConnection } = require('./openai');
const { createAssemblyConnection } = require('./assemblyai');
const logger = require('./logger');

const SESSION_MAX_MS = (parseInt(process.env.SESSION_MAX_MINUTES) || 20) * 60 * 1000;
const SESSION_WARNING_MS = (parseInt(process.env.SESSION_WARNING_MINUTES) || 15) * 60 * 1000;

async function handleSimulationConnection(browserWs, req) {
  // Expected: /ws?sessionId=xxx&token=yyy
  const url = new URL(req.url, 'http://localhost');
  const sessionId = url.searchParams.get('sessionId');
  const token = url.searchParams.get('token');

  if (!sessionId || !token) {
    browserWs.close(4001, 'Missing sessionId or token');
    return;
  }

  const auth = await validateSessionToken(token, sessionId);
  if (!auth.valid) {
    logger.warn('Invalid session token', { sessionId, reason: auth.reason });
    browserWs.close(4003, auth.reason);
    return;
  }

  logger.info('Session starting', { sessionId, userId: auth.userId });

  const sessionDetails = await fetchSessionDetails(sessionId, token);
  if (!sessionDetails) {
    browserWs.close(4004, 'Session not found');
    return;
  }

  const relay = new SimulationRelay(sessionId, auth.userId, browserWs, sessionDetails);
  await relay.initialize();
}

class SimulationRelay {
  constructor(sessionId, userId, browserWs, sessionDetails) {
    this.sessionId = sessionId;
    this.userId = userId;
    this.browserWs = browserWs;
    this.sessionDetails = sessionDetails;
    this.openAIWs = null;
    this.assemblyWs = null;
    this.isEnding = false;
    this.startTime = Date.now();
    this.messageSequence = 0;
    this.warningTimer = null;
    this.hardLimitTimer = null;
    this.currentCandidateMessageId = null;
  }

  async initialize() {
    await notifyMainApp('session_active', { sessionId: this.sessionId });

    try {
      this.openAIWs = await createOpenAIConnection(this, this.sessionDetails);
    } catch (err) {
      logger.error('OpenAI connect failed', { sessionId: this.sessionId, error: err.message });
      this.send({ type: 'error', message: 'Could not reach the interviewer. Please try again.' });
      this.endSession('openai_connect_failed');
      return;
    }
    this.assemblyWs = await createAssemblyConnection(this);

    this.startTimers();

    this.browserWs.on('message', (data) => this.handleBrowserMessage(data));
    this.browserWs.on('close', (code, reason) => {
      logger.info('Browser disconnected', {
        sessionId: this.sessionId,
        code,
        reason: reason.toString()
      });
      this.endSession('browser_disconnected');
    });
    this.browserWs.on('error', (err) => {
      logger.error('Browser WebSocket error', { sessionId: this.sessionId, error: err.message });
    });

    logger.info('Relay initialized', { sessionId: this.sessionId });
  }

  handleBrowserMessage(data) {
    // Control message (JSON string) vs audio (binary)
    if (typeof data === 'string') {
      try {
        const msg = JSON.parse(data);
        if (msg.type === 'end_session') this.endSession('user_requested');
      } catch {
        /* ignore malformed control message */
      }
      return;
    }

    if (this.openAIWs?.readyState === WebSocket.OPEN) {
      this.openAIWs.send(
        JSON.stringify({ type: 'input_audio_buffer.append', audio: data.toString('base64') })
      );
    }
    if (this.assemblyWs?.readyState === WebSocket.OPEN) {
      this.assemblyWs.send(data);
    }
  }

  startTimers() {
    const maxMin = parseInt(process.env.SESSION_MAX_MINUTES) || 20;
    const warnMin = parseInt(process.env.SESSION_WARNING_MINUTES) || 15;
    const remaining = maxMin - warnMin;

    this.warningTimer = setTimeout(() => {
      this.send({
        type: 'time_warning',
        minutes_remaining: remaining,
        message: `${remaining} minutes remaining.`
      });
    }, SESSION_WARNING_MS);

    this.hardLimitTimer = setTimeout(() => {
      this.send({
        type: 'time_limit_reached',
        message: 'Interview time limit reached. Generating your debrief.'
      });
      this.endSession('time_limit');
    }, SESSION_MAX_MS);
  }

  async endSession(reason = 'normal') {
    if (this.isEnding) return;
    this.isEnding = true;
    logger.info('Session ending', { sessionId: this.sessionId, reason });

    clearTimeout(this.warningTimer);
    clearTimeout(this.hardLimitTimer);

    if (this.openAIWs?.readyState === WebSocket.OPEN) this.openAIWs.close(1000, 'Session ended');
    if (this.assemblyWs?.readyState === WebSocket.OPEN) {
      try {
        this.assemblyWs.send(JSON.stringify({ terminate_session: true }));
      } catch {
        /* ignore */
      }
      this.assemblyWs.close(1000, 'Session ended');
    }

    const durationSeconds = Math.floor((Date.now() - this.startTime) / 1000);

    await notifyMainApp('session_ended', {
      sessionId: this.sessionId,
      userId: this.userId,
      reason,
      duration_seconds: durationSeconds
    });

    this.send({
      type: 'session_ended',
      session_id: this.sessionId,
      duration_seconds: durationSeconds
    });
  }

  async saveMessage(role, content, audioDurationSeconds) {
    this.messageSequence++;
    const messageId = crypto.randomUUID();
    await notifyMainApp('message_saved', {
      sessionId: this.sessionId,
      messageId,
      role,
      content,
      audio_duration_seconds: audioDurationSeconds,
      sequence: this.messageSequence
    });
    if (role === 'candidate') this.currentCandidateMessageId = messageId;
    return messageId;
  }

  async saveSpeechMetrics(metrics) {
    if (!this.currentCandidateMessageId) return;
    await notifyMainApp('speech_metrics', {
      sessionId: this.sessionId,
      messageId: this.currentCandidateMessageId,
      ...metrics
    });
  }

  send(data) {
    if (this.browserWs.readyState === WebSocket.OPEN) {
      this.browserWs.send(JSON.stringify(data));
    }
  }
}

async function fetchSessionDetails(sessionId, token) {
  const url = `${process.env.MAIN_APP_URL}/api/simulation/${sessionId}/details`;
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const req = https.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || 443,
        path: parsed.pathname,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-relay-secret': process.env.RELAY_SECRET
        }
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(res.statusCode === 200 ? JSON.parse(data) : null);
          } catch {
            resolve(null);
          }
        });
      }
    );
    req.on('error', () => resolve(null));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(null);
    });
    req.end();
  });
}

module.exports = { handleSimulationConnection };
