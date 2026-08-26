import express from "express";
import cors from "cors";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { buildPlaylist, timeOfDayFromHour } from "./playlist.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tracksPath = path.join(__dirname, "data", "tracks.json");
const tracks = JSON.parse(await readFile(tracksPath, "utf-8"));

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/tracks", (_req, res) => {
  res.json(tracks);
});

app.post("/api/playlist", (req, res) => {
  const { timeOfDay, keywords, hour } = req.body ?? {};
  const resolvedTimeOfDay = timeOfDay ?? timeOfDayFromHour(Number(hour) ?? new Date().getHours());
  const playlist = buildPlaylist(tracks, { timeOfDay: resolvedTimeOfDay, keywords, limit: 10 });
  res.json(playlist);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Playlist API listening on http://localhost:${PORT}`);
});
