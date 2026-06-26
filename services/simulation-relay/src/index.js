require('dotenv').config();
const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const { handleSimulationConnection } = require('./relay');
const logger = require('./logger');

const app = express();
app.use(express.json());

// Health check — Railway uses this to confirm the service is running
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'overclocker-simulation-relay',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Active connections count — useful for monitoring (relay secret required)
app.get('/metrics', (req, res) => {
  const secret = req.headers['x-relay-secret'];
  if (secret !== process.env.RELAY_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json({
    active_connections: wss.clients.size,
    uptime: process.uptime()
  });
});

const server = http.createServer(app);

// WebSocket server attached to the same HTTP server
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', async (ws, req) => {
  try {
    await handleSimulationConnection(ws, req);
  } catch (err) {
    logger.error('Unhandled connection error', { error: err.message });
    ws.close(1011, 'Internal server error');
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  logger.info(`Simulation relay running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received — shutting down gracefully');
  wss.clients.forEach((client) => client.close(1001, 'Server shutting down'));
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason: String(reason) });
});
