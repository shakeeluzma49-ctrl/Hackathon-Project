import tracks from "./data/tracks.json";
import { buildPlaylist, timeOfDayFromHour } from "./lib/playlist.js";

export async function fetchPlaylist({ keywords }) {
  const timeOfDay = timeOfDayFromHour(new Date().getHours());
  return buildPlaylist(tracks, { timeOfDay, keywords, limit: 10 });
}
