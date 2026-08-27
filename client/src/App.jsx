import { useEffect, useRef, useState } from "react";
import TrackRow from "./components/TrackRow.jsx";
import AuroraTrace from "./components/AuroraTrace.jsx";
import { fetchPlaylist } from "./api.js";

const READING = {
  morning: "MORNING READING",
  afternoon: "AFTERNOON READING",
  evening: "EVENING READING",
  night: "NIGHT READING",
};

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
    if (activeTrack?.id === track.id) {
      handleTogglePlay();
      return;
    }
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

  const reading = READING[playlist?.timeOfDay] ?? "READING";
  const isLoading = status === "loading";

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-3xl px-6 py-8 sm:py-12">
        <header className="mb-6 flex items-baseline justify-between border-b border-border pb-3 text-xs tracking-[0.2em] text-text-muted">
          <span className="font-bold text-text">AURORA</span>
          <span>
            {new Date().toLocaleDateString([], { month: "short", day: "2-digit" })} —{" "}
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </header>

        <form
          onSubmit={handleGenerate}
          className="mb-6 flex flex-col gap-3 border border-border bg-surface px-4 py-3 sm:flex-row sm:items-center"
        >
          <label
            htmlFor="keywords"
            className="shrink-0 text-xs tracking-[0.15em] text-text-muted"
          >
            {reading}
          </label>
          <input
            id="keywords"
            type="text"
            value={keywords}
            onChange={(event) => setKeywords(event.target.value)}
            placeholder="how's the day going? (stressed, hyped, chill study session…)"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="shrink-0 rounded-none border border-accent bg-accent px-4 py-1.5 text-xs tracking-[0.1em] text-on-accent transition-[transform,filter] duration-150 ease-out hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "READING…" : "BUILD MIX"}
          </button>
        </form>

        <div className="mb-8">
          <p className="mb-1 text-[11px] tracking-[0.15em] text-text-muted">
            AURORA ACTIVITY — TONIGHT
          </p>
          <AuroraTrace />
        </div>

        {status === "error" && (
          <p className="text-sm text-error">Something went wrong building the playlist.</p>
        )}

        {status === "ready" && playlist && (
          <section>
            <div className="mb-3 flex items-baseline justify-between border-b border-border pb-2">
              <h1 className="text-lg font-bold tracking-tight">TONIGHT&apos;S MIX</h1>
              {playlist.matchedMoods.length > 0 && (
                <p className="text-xs text-text-muted">{playlist.matchedMoods.join(" · ")}</p>
              )}
            </div>
            <ol>
              {playlist.tracks.map((track, index) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={index}
                  isActive={activeTrack?.id === track.id}
                  isPlaying={isPlaying && activeTrack?.id === track.id}
                  onSelect={handleSelectTrack}
                  onTogglePlay={handleTogglePlay}
                />
              ))}
            </ol>
          </section>
        )}

        <audio ref={audioRef} src={activeTrack?.url || undefined} onEnded={() => setIsPlaying(false)} />
      </div>
    </div>
  );
}
