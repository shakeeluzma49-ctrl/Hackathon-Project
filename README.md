# Aurora

A playlist app that builds a mix from the time of day plus a free-text
description of how your day is going. Aurora Borealis-themed: night-sky base,
green/teal/violet aurora bands as the accent palette.

Live on GitHub Pages: deploys automatically from `main` via
`.github/workflows/deploy.yml`.

## Stack

- `client/` — React + Vite + Tailwind v4. Fully static: playlist matching
  (`client/src/lib/playlist.js`) runs in the browser against the bundled
  `client/src/data/tracks.json` catalog. No backend required to run or deploy.
- `server/` — Node + Express, same matching logic behind an API. Not currently
  used by the deployed app; kept in case a real backend (e.g. serving actual
  audio files, or moving matching server-side) is needed later.

## Run it

```bash
cd client
npm install
npm run dev   # http://localhost:5173
```

## Current state

- Playlist matching is rule-based: time of day (auto-detected) + keyword-to-mood
  matching against `client/src/data/tracks.json`.
- Tracks are placeholders with no real audio (`url: ""`) — the UI marks these as
  "No audio yet" and disables playback. Swap in real files by setting each
  track's `url` and adding real mood/time tags; the matching logic doesn't need
  to change.
