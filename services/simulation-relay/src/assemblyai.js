const { WebSocket } = require('ws');
const { extractSpeechMetrics } = require('./speech-metrics');
const logger = require('./logger');

async function createAssemblyConnection(relay) {
  return new Promise((resolve) => {
    const ws = new WebSocket('wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000', {
      headers: { Authorization: process.env.ASSEMBLYAI_API_KEY }
    });

    ws.on('open', () => {
      logger.info('AssemblyAI connection open', { sessionId: relay.sessionId });
      resolve(ws);
    });

    ws.on('message', async (data) => {
      let result;
      try {
        result = JSON.parse(data);
      } catch {
        return;
      }
      if (result.message_type === 'FinalTranscript' && result.words?.length > 0) {
        const metrics = extractSpeechMetrics(result);
        await relay.saveSpeechMetrics(metrics);
      }
    });

    ws.on('error', (err) => {
      // AssemblyAI errors are non-fatal — the interview continues without metrics.
      logger.warn('AssemblyAI error — continuing without metrics', {
        sessionId: relay.sessionId,
        error: err.message
      });
      resolve(ws);
    });

    ws.on('close', () => {
      logger.info('AssemblyAI connection closed', { sessionId: relay.sessionId });
    });
  });
}

module.exports = { createAssemblyConnection };
