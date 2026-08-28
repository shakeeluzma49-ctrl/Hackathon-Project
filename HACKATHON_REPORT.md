# Aurora

## Hackathon Project Report

Aurora is an emotion-aware playlist generator. A user describes how they feel in natural language, and the app interprets the words to build a short music mix from the matching emotion playlist.

## The Problem

Choosing music that matches a current emotional state takes time. Users may know how they feel without knowing the exact playlist or genre they want. Aurora reduces that decision to one short prompt such as:

- `I feel angry and need to release it`
- `I am feeling nostalgic and missing someone`
- `I feel energetic and want something upbeat`
- `I want something dreamy and whimsical`

## The Solution

Aurora combines:

1. Free-text emotion input.
2. Local emotion-word and synonym matching.
3. Curated emotion playlist data.
4. Time-of-day context.
5. A ranked mix of up to 10 songs.

The result is immediate and works entirely in the browser. No account, backend, external AI service, or API key is required.

## Current Playlist Catalog

The catalog contains 108 imported tracks across six emotion sets:

| Emotion set | Tracks |
| --- | ---: |
| Melancholy | 18 |
| Anger | 18 |
| Yearning | 18 |
| Energetic | 18 |
| Guilty | 18 |
| Whimsical | 18 |

The source data is stored in `client/src/data/tracks.json`. Each track includes an ID, title, artist, album, duration when available, time tags, mood tags, a YouTube video ID, and an album cover URL.

The supplied YouTube Music URLs are stored as YouTube video IDs. They are not placed in the native audio URL field because they are web pages, not direct audio files. Album artwork is sourced from music-catalog artwork rather than YouTube thumbnails.

## How Emotion Matching Works

The matching engine is in `client/src/lib/playlist.js`.

The user prompt is normalized by:

- converting text to lowercase;
- splitting it into words;
- ignoring punctuation and unknown words;
- converting recognized words into canonical emotion tags;
- removing duplicate matches.

Examples of supported mappings include:

| User language | Canonical set |
| --- | --- |
| sad, down, lonely, heartbroken, tired | melancholy |
| angry, mad, furious, annoyed, rage | anger |
| longing, missing, miss, crave | yearning |
| energetic, energy, lively, motivated | energetic |
| guilty, guilt, regret, remorse, ashamed | guilty |
| whimsical, playful, quirky, dreamy, magical | whimsical |

The parser works inside complete sentences, not only with one-word prompts. For example, `I'm feeling stressed today` is normalized into words, recognizes `stressed`, and selects the stress-related track set.

The engine also keeps the earlier general vocabulary for words such as `focus`, `study`, `calm`, `happy`, `hyped`, `party`, and `stressed`, allowing more playlist sets to be added later without changing the core architecture.

## Ranking Logic

Every track receives a score:

- `+2` when the track matches the current time of day;
- `+3` for every matched mood tag.

Tracks with a score above zero are sorted from highest to lowest score, and the first 10 are returned. If no recognized word matches, Aurora falls back to the catalog rather than showing an empty result.

After the relevant top matches are selected, the returned tracks are shuffled with an in-browser Fisher-Yates shuffle. Repeating the same search therefore produces a fresh-looking ordering while keeping the strongest matches in the result pool.

Time of day is detected automatically:

- 05:00–11:59: morning
- 12:00–16:59: afternoon
- 17:00–20:59: evening
- 21:00–04:59: night

The imported emotion tracks currently carry all four time tags because their source playlists are emotion-based rather than time-based. This makes the emotion match the primary signal.

## User Experience

### Opening screen

The app opens with an Aurora Borealis-inspired boot screen. It uses the project image asset, terminal-style typography, a boot message, and a prompt to continue by clicking or pressing any key.

### Playlist generation

The main screen contains:

- the Aurora header and current date/time;
- a free-text prompt field;
- a `BUILD MIX` action;
- the current time-of-day label;
- the animated Aurora activity trace;
- the generated track list;
- a track details panel;
- a fixed player bar.

### Track list

Each track row displays its album cover, position, title, artist, duration, and audio availability. Unknown durations display as `—`. Selecting a row highlights it and updates the details panel.

### Track details

The details panel shows album cover, title, artist, duration, time tags, mood tags, and whether audio is loaded.

### Player controls

The player bar includes autoplay, previous, play/pause, next, repeat, shuffle, and a seekable duration bar. Selecting a track starts it automatically through the official YouTube embedded player. Navigation works through the generated mix, while repeat and shuffle change the playback behavior without changing the curated catalog.

The player bar also uses the selected album cover as a blurred ambient light layer, making the player visually react to the active song.

## Visual Design

Aurora uses an Aurora Borealis visual direction:

- a dark night-sky fallback background;
- a supplied aurora landscape image;
- teal, blue, and violet accent colors;
- monospace typography for a monitoring-console feel;
- translucent surfaces with backdrop blur;
- restrained borders and compact information density.

The interface is responsive. On small screens, the player controls and track information reflow without horizontal overflow.

## Animation

The activity trace is built as three SVG ridge layers in `client/src/components/AuroraTrace.jsx`.

- The trace updates at approximately 12 frames per second.
- X positions stay fixed.
- The overall line does not translate on the X or Y axis.
- Individual peak and trough heights change to morph the ridge shape in place.
- The three layers are delayed by 0, 2, and 4 frames to avoid synchronized movement.
- `prefers-reduced-motion` disables the ongoing animation and keeps the trace static.

Other interface transitions use Framer Motion for page entry, list staggering, track selection, and player state changes.

## Technical Architecture

### Frontend

- React 19
- Vite 8
- Tailwind CSS 4
- Framer Motion 13
- Oxlint

### Application structure

```text
client/
  src/
    App.jsx                 Main application state and layout
    api.js                  Local playlist data interface
    data/tracks.json        Curated emotion catalog
    lib/playlist.js         Emotion parsing and ranking logic
    components/
      AuroraTrace.jsx       Animated SVG activity trace
      PlayerBar.jsx         Playback and navigation controls
      SplashScreen.jsx      Opening screen
      TrackDetailsPane.jsx  Selected track information
      TrackRow.jsx           Playlist item
    index.css               Theme tokens and animation styles
```

The application is fully static. `api.js` provides an API-shaped interface, but `fetchPlaylist` currently reads the bundled catalog and runs the matching logic locally. The repository also contains a server directory for possible future backend use, but the deployed client does not depend on it.

## Why We Did Not Add a Free AI API

The current rule-based approach is the better fit for this version:

- no API key or account is needed;
- no user emotion data leaves the browser;
- no network latency is added to playlist generation;
- results are predictable and easy to demonstrate;
- the curated playlist sets already define the domain vocabulary.

An AI API could become useful later for ambiguous or conversational prompts, but it should be an optional interpretation layer rather than the source of truth. A sensible future design would use AI to extract emotion tags, then validate those tags against the local catalog.

## Playback Status

The app now plays the imported tracks through YouTube's official IFrame Player API-compatible embed. Each imported URL is converted to its video ID, and the custom controls send play, pause, and navigation commands to the embedded player. The YouTube player remains visually minimized while the Aurora player bar provides the app's interface.

This approach does not download or expose MP3 files. Playback still depends on the video being available on YouTube and allowed to play in an embed. A future licensed audio integration could replace the embed without changing playlist matching.

## Deployment

The app is deployed to GitHub Pages:

https://shakeeluzma49-ctrl.github.io/Hackathon-Project/

Deployment is automatic through `.github/workflows/deploy.yml` whenever changes are pushed to `main`.

The workflow:

1. Checks out the repository.
2. Installs the client dependencies.
3. Builds the Vite application.
4. Uploads `client/dist` as a Pages artifact.
5. Deploys the artifact to the `github-pages` environment.

## Verification Completed

The following checks pass locally:

```bash
cd client
npm run lint
npm run build
```

The deployed GitHub Actions workflow has also completed successfully after the latest changes.

## Demonstration Flow

For a hackathon presentation:

1. Open Aurora and continue past the boot screen.
2. Enter `I feel angry and need high energy`.
3. Click `BUILD MIX`.
4. Show the resulting Anger/Energetic-related interpretation and ranked track mix.
5. Select a track to show the details panel.
6. Enter `I am feeling dreamy and missing someone`.
7. Build the new mix and show the Yearning/Whimsical interpretation.
8. Point out the responsive layout and the animated three-layer activity trace.

## Future Improvements

- Add the remaining emotion batches as they become available.
- Add multi-label playlist tags so one track can belong to multiple related emotions.
- Add direct, legally licensed audio sources.
- Add richer phrase matching for sentence-level context and negation.
- Add an optional AI interpretation layer with local tag validation.
- Add persistent user preferences and recently generated mixes.
- Add automated unit tests for synonym extraction and ranking behavior.

## Current Status

Aurora is a working static hackathon prototype with a curated 108-track emotion catalog, local natural-language keyword matching, album artwork, responsive UI, animated visual identity, YouTube-backed playback controls, and automated GitHub Pages deployment.
