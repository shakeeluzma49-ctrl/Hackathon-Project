import tracks from "./data/tracks.json";
import { buildPlaylist, timeOfDayFromHour } from "./lib/playlist.js";

export function createPlaylist({ keywords }) {
  const timeOfDay = timeOfDayFromHour(new Date().getHours());
  return buildPlaylist(tracks, { timeOfDay, keywords, limit: 10 });
}

export async function fetchPlaylist({ keywords }) {
  return createPlaylist({ keywords });
}
