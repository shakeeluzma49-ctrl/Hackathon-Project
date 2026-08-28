# Aurora Presenter Guide

## 30-Second Pitch

Aurora is an emotion-aware music experience. Instead of searching through genres or playlists, a user describes how they feel in a normal sentence. Aurora interprets the language, selects the relevant emotion catalog, ranks a short mix, and starts playback immediately in a responsive, Aurora Borealis-inspired interface.

## The Problem

People often know their emotional state but do not know what music to search for. Traditional music apps make the user choose a genre, artist, album, or playlist first. That adds friction at the exact moment when the user wants a quick emotional response.

## The Solution

Aurora turns a natural-language feeling into a playable mix:

1. The user writes a sentence such as `I am stressed and need something calm`.
2. Aurora cleans and tokenizes the sentence.
3. Recognized words and phrases are mapped to canonical emotion labels.
4. Matching songs are scored using mood and time-of-day tags.
5. The strongest results are selected and shuffled.
6. The first track autoplays through the embedded YouTube player.

The experience is immediate, private, and does not require an account or API key.

## Product Highlights

- Natural-language emotion search, including complete sentences.
- Six curated emotion sets with 108 tracks total.
- Fresh shuffled results for every search.
- Official album artwork instead of YouTube thumbnails.
- Autoplay, play/pause, previous, next, seek, repeat, and shuffle controls.
- Album-cover ambient lighting in the player bar.
- Animated three-layer activity trace running at approximately 12 FPS.
- Responsive mobile and desktop interface.
- Static GitHub Pages deployment with automatic CI/CD.

## Supported Emotion Catalog

| Emotion set | Tracks | Example language |
| --- | ---: | --- |
| Melancholy | 18 | sad, down, lonely, heartbroken, tired |
| Anger | 18 | angry, mad, furious, annoyed, rage |
| Yearning | 18 | longing, missing, miss, crave |
| Energetic | 18 | energetic, lively, motivated, upbeat |
| Guilty | 18 | guilty, regret, remorse, ashamed |
| Whimsical | 18 | playful, quirky, dreamy, magical |

## How the Matching Works

The matching engine lives in `client/src/lib/playlist.js`.

### Input normalization

The prompt is converted to lowercase, punctuation is removed, and the remaining words are compared with the local emotion vocabulary. Duplicate labels are removed so one sentence does not overweight a repeated word.

### Sentence support

Aurora does not require a single keyword. For example:

`I'm feeling stressed today`

becomes a recognized stress-related emotion and returns the matching playlist. The same process works with prompts such as:

- `I am angry and need to release it` -> Anger
- `I miss someone tonight` -> Yearning
- `I feel motivated and ready to move` -> Energetic
- `I regret what happened` -> Guilty
- `I want something dreamy and strange` -> Whimsical

### Ranking

Each track receives a score based on metadata:

- `+3` for every matching mood tag.
- `+2` when its time tag matches the current time of day.

Tracks with the highest scores form the result pool. Up to 10 tracks are returned, then Fisher-Yates shuffling changes their order for each search. This keeps the results relevant while making repeated searches feel live rather than hardcoded.

If no emotion is recognized, Aurora falls back to the catalog instead of returning an empty screen.

## Playback Architecture

Every track has a hardcoded YouTube video ID in `client/src/data/tracks.json`. The application builds an official YouTube embed URL from that ID and sends player commands through the iframe API-compatible postMessage interface.

The app uses the embedded player for playback rather than downloading audio files. This avoids pretending that a YouTube page URL is a direct MP3 source and keeps the prototype within the platform's embed model.

Playback behavior:

- Selecting a track loads its exact hardcoded video ID.
- Autoplay starts after the embedded player reports that playback has begun.
- The progress bar remains paused until actual playback is confirmed.
- YouTube duration and current-time messages drive the progress bar.
- Repeat replays the active track when it ends.
- Shuffle selects another track from the current mix.
- Next and previous navigate through the generated mix.
- Missing durations display as `--` rather than falsely showing `0:00`.

The IDs were audited against YouTube's oEmbed endpoint and corrected where a guessed or outdated ID did not resolve. The latest audit confirmed all 108 hardcoded IDs resolve.

## Technology Stack

### Frontend

- React 19: component-based user interface and state management.
- Vite 8: fast development server and production bundling.
- Tailwind CSS 4: utility-first responsive styling.
- Framer Motion 13: interface transitions and list animation.
- SVG and CSS: animated trace, glow effects, and visual system.

### Quality and deployment

- Oxlint: JavaScript and JSX linting.
- GitHub Actions: automated build and deployment workflow.
- GitHub Pages: static production hosting.

### Data and playback

- Local JSON catalog: curated track metadata and emotion tags.
- Local JavaScript matching: no runtime AI request is required.
- YouTube embedded player: playback source for the prototype.
- Music catalog artwork URLs: official album-cover presentation where available.

## Repository Structure

```text
client/
  src/
    App.jsx                 App state, search, playback events, layout
    api.js                  Local playlist data interface
    data/tracks.json        108 tracks, tags, covers, hardcoded video IDs
    lib/playlist.js         Emotion parsing, scoring, fallback, shuffle
    components/
      AuroraTrace.jsx       Three-layer in-place ridge animation
      PlayerBar.jsx         Player controls and progress bar
      SplashScreen.jsx      Boot screen
      TrackDetailsPane.jsx  Selected track metadata
      TrackRow.jsx          Playlist track item
    index.css               Theme, layout, glow, responsive rules
  public/
  vite.config.js
server/
  playlist.js               Future backend-compatible matching logic
.github/workflows/deploy.yml
HACKATHON_REPORT.md         Full technical report
PRESENTER_GUIDE.md          This presenter guide
```

## Visual Design

Aurora uses a dark night-sky interface with teal, violet, and blue-green lighting based on the provided Aurora Borealis imagery. Translucent panels and compact monospace typography create a monitoring-console feel while keeping the playlist scannable.

The active album cover drives a blurred ambient light layer inside the player bar. This makes the player respond visually to the current song without using YouTube thumbnail art as the cover.

## Animation Explanation

The visual activity trace is made from three SVG ridge layers. At roughly 12 frames per second, the code changes the ridge point heights while preserving each point's X and Y position. The result is an in-place shape transformation rather than a translated or wiggling line.

The layers are delayed by two frames from one another so they do not morph simultaneously. Users with `prefers-reduced-motion` enabled receive a static trace.

## Suggested 3-Minute Demo

### 0:00-0:30: Introduce the problem

Say: “Aurora helps people find music from how they feel, without making them choose a genre first.”

Show the boot screen and continue to the app.

### 0:30-1:15: Demonstrate natural-language search

Enter:

`I feel angry and need high energy`

Click `BUILD MIX`. Point out that the sentence is interpreted through emotion vocabulary and produces a fresh shuffled mix.

### 1:15-2:00: Demonstrate playback

Select a track. Show the album cover, autoplay, progress bar, and player controls. Use next, shuffle, repeat, and seek briefly. Point out that the progress timer waits for confirmed playback instead of advancing while a video is loading.

### 2:00-2:35: Demonstrate a second sentence

Enter:

`I miss someone and want something dreamy`

Build the mix again. Explain that one sentence can express more than one related feeling and that the result order changes between searches.

### 2:35-3:00: Explain the technical approach

Say: “The app is a static React and Vite application. The catalog and matching logic run locally, so there is no API key, account, or emotion data sent to a server. YouTube is used only through embedded playback, while the app owns the playlist experience and controls.”

## Why Rule-Based Matching Instead of a Free AI API?

For this prototype, local matching is more reliable for the core demo:

- no API quota or billing risk;
- no API key to configure or expose;
- no network delay during emotion interpretation;
- deterministic and explainable behavior;
- user prompts remain in the browser;
- easy to test against a curated vocabulary.

An AI API could be added later as an optional interpretation layer. It should return candidate emotion labels, which Aurora would validate against the local catalog. The AI should not directly choose arbitrary songs or bypass the controlled metadata.

## Deployment

Production URL:

https://shakeeluzma49-ctrl.github.io/Hackathon-Project/

Pushing to `main` triggers `.github/workflows/deploy.yml`:

1. GitHub checks out the repository.
2. Node dependencies are installed.
3. Vite builds the client.
4. `client/dist` is uploaded as a Pages artifact.
5. GitHub Pages deploys the artifact.

## Verification

The current build was verified with:

```bash
cd client
npm run lint
npm run build
```

The complete catalog contains 108 tracks, and all hardcoded YouTube IDs resolve through the playback-link audit. The latest GitHub Pages deployment completed successfully.

## Honest Limitations

- YouTube playback depends on the video remaining available and embeddable.
- The prototype does not download or provide standalone MP3 files.
- Emotion interpretation is vocabulary-based, not a trained language model.
- Some imported track durations are unknown and display as `--`.
- Album artwork availability depends on the music catalog source.
- No accounts, persistence, or personalized listening history are included yet.

## Future Roadmap

1. Add more emotion sets and multi-label tracks.
2. Add local negation and phrase handling, such as “not angry.”
3. Add optional AI-assisted emotion extraction with local validation.
4. Add a licensed direct-audio provider if required.
5. Add saved mixes, preferences, and listening history.
6. Add automated unit and browser tests for matching and playback controls.

## Judge Questions and Answers

### Does Aurora use an AI API?

No. The current prototype uses transparent local language matching. This avoids API quota, cost, latency, and privacy issues while making the demo dependable.

### Is the music downloaded from YouTube?

No. Tracks play through YouTube's official embedded player. The app stores exact video IDs and controls the embed; it does not extract or distribute audio files.

### What happens when the user repeats a search?

The same relevant pool is rebuilt, then shuffled with Fisher-Yates so the order is different while the strongest matches remain relevant.

### Why is the app static?

The matching and catalog do not require a server. Static hosting makes the prototype fast, inexpensive, private, and easy to deploy through GitHub Pages.

### What makes the project technically interesting?

Aurora combines sentence-level emotion interpretation, metadata ranking, controlled embedded playback, live player state synchronization, responsive UI, and a custom animated visual identity in one deployable prototype.

### What would you build next?

The next major step would be an optional AI interpretation layer backed by the local emotion taxonomy, followed by licensed direct audio and persistent personalization.

## Closing Statement

Aurora makes music discovery feel responsive to the user's emotional context. It demonstrates that a thoughtful local matching system, curated data, precise playback IDs, and a distinctive interface can deliver an immediate product experience without requiring a complex backend or paid AI service.
