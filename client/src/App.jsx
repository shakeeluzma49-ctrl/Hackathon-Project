import { useEffect, useRef, useState } from "react";
import TrackRow from "./components/TrackRow.jsx";
import { fetchPlaylist } from "./api.js";

const HEADLINE = {
  morning: "Morning.\nEase in.",
  afternoon: "Afternoon.\nKeep moving.",
  evening: "Evening.\nWind toward something.",
  night: "Late night,\nstill going?",
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

  const headline = HEADLINE[playlist?.timeOfDay] ?? "Building\nyour mix.";
  const isLoading = status === "loading";

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-text">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="aurora-band absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-accent/20 blur-[110px]" />
        <div
          className="aurora-band absolute top-8 right-0 h-80 w-80 rounded-full bg-accent-teal/20 blur-[110px]"
          style={{ animationDelay: "-8s" }}
        />
        <div
          className="aurora-band absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent-violet/15 blur-[110px]"
          style={{ animationDelay: "-16s" }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-10 sm:py-16">
        <header className="mb-12 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-text-muted">
          <span>Aurora</span>
          <span>
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </header>

        <section className="mb-12 grid gap-8 sm:grid-cols-[1.3fr_1fr] sm:items-end">
          <h1 className="font-display whitespace-pre-line text-5xl leading-[1.05] italic sm:text-6xl">
            {headline}
          </h1>
          <form onSubmit={handleGenerate} className="flex flex-col gap-3">
            <label htmlFor="keywords" className="text-sm text-text-muted">
              Tell it about your day
            </label>
            <textarea
              id="keywords"
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
              placeholder="stressed, hyped, chill study session…"
              rows={2}
              className="resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-text-muted focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/50"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="self-start rounded-full bg-accent px-5 py-2 text-sm font-medium text-bg transition-[transform,filter] duration-150 ease-out hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Building…" : "Build the mix"}
            </button>
          </form>
        </section>

        {status === "error" && (
          <p className="text-sm text-error">Something went wrong building the playlist.</p>
        )}

        {status === "ready" && playlist && (
          <section>
            {playlist.matchedMoods.length > 0 && (
              <p className="mb-4 text-sm text-text-muted">
                Matched: {playlist.matchedMoods.join(", ")}
              </p>
            )}
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
