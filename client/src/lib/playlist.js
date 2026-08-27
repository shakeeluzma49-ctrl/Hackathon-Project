// Synonyms map free-text keywords onto the fixed moodTags vocabulary used in tracks.json.
const SYNONYMS = {
  stressed: "stressed",
  stressful: "stressed",
  overwhelmed: "stressed",
  anxious: "stressed",
  tired: "tired",
  exhausted: "tired",
  sleepy: "tired",
  lazy: "tired",
  sad: "sad",
  down: "sad",
  lonely: "sad",
  heartbroken: "sad",
  happy: "happy",
  great: "happy",
  good: "happy",
  excited: "hyped",
  hyped: "hyped",
  pumped: "hyped",
  energized: "energize",
  energy: "energize",
  hopeful: "hopeful",
  optimistic: "hopeful",
  chill: "chill",
  relaxed: "chill",
  calm: "calm",
  peaceful: "calm",
  study: "study",
  studying: "study",
  focus: "focus",
  focused: "focus",
  working: "focus",
  work: "focus",
  party: "party",
  celebrate: "party",
  celebration: "party",
  nostalgic: "nostalgic",
  nostalgia: "nostalgic",
  melancholy: "melancholy",
};

const TIME_TAGS = ["morning", "afternoon", "evening", "night"];

export function timeOfDayFromHour(hour) {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

function extractMoodTags(keywords) {
  if (!keywords) return [];
  const words = keywords
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean);
  const moods = new Set();
  for (const word of words) {
    if (SYNONYMS[word]) moods.add(SYNONYMS[word]);
  }
  return [...moods];
}

function scoreTrack(track, timeOfDay, moodTags) {
  let score = 0;
  if (track.timeTags.includes(timeOfDay)) score += 2;
  for (const mood of moodTags) {
    if (track.moodTags.includes(mood)) score += 3;
  }
  return score;
}

export function buildPlaylist(tracks, { timeOfDay, keywords, limit = 10 }) {
  const resolvedTimeOfDay = TIME_TAGS.includes(timeOfDay) ? timeOfDay : "afternoon";
  const moodTags = extractMoodTags(keywords);

  const scored = tracks
    .map((track) => ({ track, score: scoreTrack(track, resolvedTimeOfDay, moodTags) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  // No matches (e.g. keywords with no known synonym): fall back to the full catalog
  // rather than returning an empty playlist.
  const results = scored.length > 0 ? scored : tracks.map((track) => ({ track, score: 0 }));

  return {
    timeOfDay: resolvedTimeOfDay,
    matchedMoods: moodTags,
    tracks: results.slice(0, limit).map(({ track }) => track),
  };
}
