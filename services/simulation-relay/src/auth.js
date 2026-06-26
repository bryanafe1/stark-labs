const https = require('https');

/**
 * Validate a user token and session by calling the main Overclocker API.
 * Returns { valid: true, userId, sessionId } or { valid: false, reason }
 */
async function validateSessionToken(token, sessionId) {
  return new Promise((resolve) => {
    const url = new URL(`${process.env.MAIN_APP_URL}/api/simulation/validate`);

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-relay-secret': process.env.RELAY_SECRET
      }
    };

    const body = JSON.stringify({ token, sessionId });

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode === 200 && parsed.valid) {
            resolve({ valid: true, userId: parsed.userId, sessionId: parsed.sessionId });
          } else {
            resolve({ valid: false, reason: parsed.reason || 'Invalid token' });
          }
        } catch {
          resolve({ valid: false, reason: 'Validation service error' });
        }
      });
    });

    req.on('error', () => resolve({ valid: false, reason: 'Cannot reach main app' }));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ valid: false, reason: 'Validation timeout' });
    });

    req.write(body);
    req.end();
  });
}

/**
 * Notify the main app of a session lifecycle event. Fire and forget.
 */
async function notifyMainApp(event, data) {
  const url = new URL(`${process.env.MAIN_APP_URL}/api/simulation/relay-event`);

  const options = {
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-relay-secret': process.env.RELAY_SECRET
    }
  };

  const body = JSON.stringify({ event, ...data, timestamp: new Date().toISOString() });

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      res.resume();
      resolve();
    });
    req.on('error', () => resolve());
    req.setTimeout(3000, () => {
      req.destroy();
      resolve();
    });
    req.write(body);
    req.end();
  });
}

module.exports = { validateSessionToken, notifyMainApp };
