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
- Playback uses reviewed, hardcoded YouTube video IDs through an embedded
  YouTube player. It does not download or distribute audio files.
- Because playback is embedded from YouTube, platform-controlled advertisements
  may appear. Firefox users may be able to block ads with the uBlock Origin
  extension, depending on their browser and extension configuration. Aurora does
  not control or remove YouTube ads.

## Playback Notice

Selecting a track loads its exact YouTube video ID and sends play/pause/seek
commands to the embedded player. The app waits for YouTube to confirm playback
before advancing the progress timer. Some videos may be unavailable, restricted,
or show advertisements because YouTube controls the embedded playback session.

For the best ad-blocking experience, Firefox with the uBlock Origin extension
may block YouTube advertisements. This is a user-side browser configuration and
is not a feature controlled by Aurora.
