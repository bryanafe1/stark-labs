# Overclocker — Voice Simulation WebSocket Relay

A standalone service that relays audio between the browser and the OpenAI Realtime
API (the AI interviewer) and AssemblyAI (speech metrics) for Overclocker's voice
interview simulation. It is a **dumb audio pipe with auth validation** — no
database, no business logic, no UI.

It deploys **independently to Railway**. The main Overclocker app (Vercel) talks
to it via `SIMULATION_RELAY_URL` and the relay calls back into the main app's
`/api/simulation/*` endpoints (authenticated with the shared `RELAY_SECRET`).

## Architecture

```
Browser ── WS /ws?sessionId&token ──► Relay ──► OpenAI Realtime (voice)
                                          └────► AssemblyAI (speech metrics)
                                          └──► main app /api/simulation/* (validate, events)
```

## Run locally

```bash
cp .env.example .env   # fill in keys
npm install
npm run dev            # nodemon
# health: curl http://localhost:3001/health
```

## Environment variables

See `.env.example`. `RELAY_SECRET` MUST match the value set in the main app (Vercel).
`OPENAI_REALTIME_MODEL` should be a realtime model id (e.g.
`gpt-realtime-mini`); verify the exact id in the OpenAI docs/usage.

## Deploy to Railway

1. New Railway project → connect this repo → set **root directory** to
   `services/simulation-relay`.
2. Add all variables from `.env.example` (real values). Leave `MAIN_APP_URL` until
   the Vercel URL is confirmed, then set `MAIN_APP_URL=https://overclocker.dev`.
3. Railway builds from `railway.json` (Nixpacks) or the `Dockerfile`.
4. Copy the Railway URL and set `SIMULATION_RELAY_URL` in Vercel.
5. Verify: `GET https://<railway-url>/health` → `{"status":"ok",...}`.

## Known limitation (browser client phase)

OpenAI Realtime expects PCM16 @ 24 kHz; AssemblyAI v2 realtime is configured for
16 kHz. The relay forwards the same browser bytes to both, so the **browser client
must send audio compatible with both paths** (e.g. send 24 kHz to OpenAI and a
16 kHz copy to AssemblyAI, or resample). Resolve this when building the browser
audio client; the relay intentionally stays a dumb pipe.
