import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import TrackRow from "./components/TrackRow.jsx";
import NowPlayingBar from "./components/NowPlayingBar.jsx";
import { fetchPlaylist } from "./api.js";

export default function App() {
  const [keywords, setKeywords] = useState("");
  const [playlist, setPlaylist] = useState(null);
  const [activeTrack, setActiveTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState("loading");
  const audioRef = useRef(null);

  async function loadPlaylist(nextKeywords) {
    setStatus("loading");
    try {
      const data = await fetchPlaylist({ keywords: nextKeywords });
      setPlaylist(data);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    loadPlaylist("");
  }, []);

  function handleGenerate(event) {
    event.preventDefault();
    loadPlaylist(keywords);
  }

  function handleSelectTrack(track) {
    setActiveTrack(track);
    setIsPlaying(Boolean(track.url));
  }

  function handleTogglePlay() {
    if (!activeTrack?.url) return;
    setIsPlaying((prev) => !prev);
  }

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
    else audioRef.current.pause();
  }, [isPlaying, activeTrack]);

  return (
    <div className="flex h-screen flex-col bg-bg text-text">
      <div className="flex min-h-0 flex-1">
        <Sidebar timeOfDay={playlist?.timeOfDay} />

        <main className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleGenerate} className="mb-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
              placeholder="How's your day going? (e.g. stressed, hyped, chill study session)"
              className="flex-1 rounded-full border border-border bg-surface px-4 py-2 text-sm outline-none placeholder:text-text-muted focus:border-accent"
            />
            <button
              type="submit"
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-black hover:brightness-110"
            >
              Generate playlist
            </button>
          </form>

          {status === "loading" && <p className="text-sm text-text-muted">Building your playlist…</p>}
          {status === "error" && (
            <p className="text-sm text-red-400">
              Couldn't reach the playlist API — make sure the server is running on port 4000.
            </p>
          )}

          {status === "ready" && playlist && (
            <>
              <div className="mb-4">
                <h1 className="text-2xl font-bold capitalize">{playlist.timeOfDay} mix</h1>
                {playlist.matchedMoods.length > 0 && (
                  <p className="mt-1 text-sm text-text-muted">
                    Matched moods: {playlist.matchedMoods.join(", ")}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                {playlist.tracks.map((track, index) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={index}
                    isActive={activeTrack?.id === track.id}
                    onSelect={handleSelectTrack}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      <audio ref={audioRef} src={activeTrack?.url || undefined} onEnded={() => setIsPlaying(false)} />
      <NowPlayingBar track={activeTrack} isPlaying={isPlaying} onTogglePlay={handleTogglePlay} />
    </div>
  );
}
