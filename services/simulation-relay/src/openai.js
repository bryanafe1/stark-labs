const { WebSocket } = require('ws');
const { buildInterviewerPrompt } = require('./interviewer');
const logger = require('./logger');

async function createOpenAIConnection(relay, sessionDetails) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(
      `wss://api.openai.com/v1/realtime?model=${process.env.OPENAI_REALTIME_MODEL}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'OpenAI-Beta': 'realtime=v1'
        }
      }
    );

    ws.on('open', () => {
      logger.info('OpenAI connection open', { sessionId: relay.sessionId });

      ws.send(
        JSON.stringify({
          type: 'session.update',
          session: {
            modalities: ['audio', 'text'],
            instructions: buildInterviewerPrompt(sessionDetails),
            voice: 'onyx',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            input_audio_transcription: { model: 'whisper-1' },
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 700
            }
          }
        })
      );

      // Trigger the opening message
      ws.send(
        JSON.stringify({
          type: 'conversation.item.create',
          item: {
            type: 'message',
            role: 'user',
            content: [{ type: 'input_text', text: 'Begin the interview.' }]
          }
        })
      );
      ws.send(JSON.stringify({ type: 'response.create' }));

      resolve(ws);
    });

    ws.on('message', async (data) => {
      let event;
      try {
        event = JSON.parse(data);
      } catch {
        return;
      }

      switch (event.type) {
        case 'response.audio.delta':
          relay.send({ type: 'audio_chunk', audio: event.delta });
          break;

        case 'response.audio_transcript.done':
          await relay.saveMessage('interviewer', event.transcript, null);
          relay.send({ type: 'interviewer_turn_complete', transcript: event.transcript });
          break;

        case 'conversation.item.input_audio_transcription.completed':
          await relay.saveMessage('candidate', event.transcript, null);
          relay.send({ type: 'candidate_turn_complete', transcript: event.transcript });
          break;

        case 'response.audio.done':
          relay.send({ type: 'interviewer_speaking_done' });
          break;

        case 'input_audio_buffer.speech_started':
          relay.send({ type: 'candidate_speaking' });
          break;

        case 'input_audio_buffer.speech_stopped':
          relay.send({ type: 'candidate_done_speaking' });
          break;

        case 'error':
          logger.error('OpenAI error', { sessionId: relay.sessionId, error: event.error });
          relay.send({
            type: 'error',
            message: 'Connection error. The interview will end and your debrief will be generated.'
          });
          relay.endSession('openai_error');
          break;
      }
    });

    ws.on('close', (code, reason) => {
      logger.info('OpenAI connection closed', {
        sessionId: relay.sessionId,
        code,
        reason: reason.toString()
      });
      if (!relay.isEnding) relay.endSession('openai_closed');
    });

    ws.on('error', (err) => {
      logger.error('OpenAI WebSocket error', { sessionId: relay.sessionId, error: err.message });
      reject(err);
    });
  });
}

module.exports = { createOpenAIConnection };
