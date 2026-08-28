import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TrackRow from "./components/TrackRow.jsx";
import TrackDetailsPane from "./components/TrackDetailsPane.jsx";
import PlayerBar from "./components/PlayerBar.jsx";
import AuroraTrace from "./components/AuroraTrace.jsx";
import SplashScreen from "./components/SplashScreen.jsx";
import { createPlaylist, fetchPlaylist } from "./api.js";
import bgImage from "./assets/aurora-bg.jpg";

const bgStyle = {
  backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${bgImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

const EASE = [0.16, 1, 0.3, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const READING = {
  morning: "MORNING READING",
  afternoon: "AFTERNOON READING",
  evening: "EVENING READING",
  night: "NIGHT READING",
};

export default function App() {
  const [started, setStarted] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [playlist, setPlaylist] = useState(() => createPlaylist({ keywords: "" }));
  const [activeTrack, setActiveTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState("ready");
  const playerFrameRef = useRef(null);

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

  function handleGenerate(event) {
    event.preventDefault();
    loadPlaylist(keywords);
  }

  function selectTrack(track) {
    setActiveTrack(track);
    setIsPlaying(false);
  }

  function handleTogglePlay() {
    if (!activeTrack?.youtubeId || !playerFrameRef.current?.contentWindow) return;
    const nextPlaying = !isPlaying;
    playerFrameRef.current.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: nextPlaying ? "playVideo" : "pauseVideo", args: [] }),
      "https://www.youtube.com",
    );
    setIsPlaying(nextPlaying);
  }

  function stepTrack(direction) {
    if (!playlist || !activeTrack) return;
    const tracks = playlist.tracks;
    const currentIndex = tracks.findIndex((t) => t.id === activeTrack.id);
    const nextIndex = (currentIndex + direction + tracks.length) % tracks.length;
    selectTrack(tracks[nextIndex]);
  }

  useEffect(() => {
    function handlePlayerMessage(event) {
      if (event.origin !== "https://www.youtube.com") return;
      try {
        const data = JSON.parse(event.data);
        if (data.event !== "infoDelivery") return;
        const playerState = data.info?.playerState;
        if (playerState === 0 || playerState === 2) setIsPlaying(false);
        if (playerState === 1) setIsPlaying(true);
      } catch {
        // Ignore unrelated postMessage events.
      }
    }
    window.addEventListener("message", handlePlayerMessage);
    return () => window.removeEventListener("message", handlePlayerMessage);
  }, []);

  const reading = READING[playlist?.timeOfDay] ?? "READING";
  const isLoading = status === "loading";
  const canNavigate = Boolean(playlist?.tracks?.length && activeTrack);

  return (
    <AnimatePresence mode="wait">
      {!started ? (
        <SplashScreen key="splash" onContinue={() => setStarted(true)} />
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="min-h-screen bg-bg pb-32 text-text"
          style={bgStyle}
        >
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-5xl px-6 py-8 sm:py-12"
          >
            <motion.header variants={fadeUp} className="mb-6 pb-3">
              <div className="flex items-baseline justify-between text-xs tracking-[0.2em] text-text-muted">
                <span className="font-bold text-text">AURORA</span>
                <span>
                  {new Date().toLocaleDateString([], { month: "short", day: "2-digit" })} —{" "}
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div className="aurora-rule mt-3 h-[3px] w-full rounded-full" />
            </motion.header>

            <motion.form
              variants={fadeUp}
              onSubmit={handleGenerate}
              className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-surface/85 px-4 py-3 backdrop-blur-md sm:flex-row sm:items-center"
            >
              <label htmlFor="keywords" className="shrink-0 text-xs tracking-[0.15em] text-text-muted">
                {reading}
              </label>
              <input
                id="keywords"
                type="text"
                value={keywords}
                onChange={(event) => setKeywords(event.target.value)}
                placeholder="stressed, hyped, chill study..."
                className="min-w-0 flex-1 rounded-md bg-transparent text-sm outline-none placeholder:text-text-muted focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent"
              />
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15, ease: EASE }}
                className="shrink-0 rounded-full border border-accent bg-accent px-4 py-1.5 text-xs tracking-[0.1em] text-on-accent hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "READING…" : "BUILD MIX"}
              </motion.button>
            </motion.form>

            <motion.div variants={fadeUp} className="mb-8">
              <p className="mb-1 text-[11px] tracking-[0.15em] text-text-muted">
                AURORA ACTIVITY — TONIGHT
              </p>
              <AuroraTrace />
            </motion.div>

            {status === "error" && (
              <motion.p variants={fadeUp} className="text-sm text-error">
                Something went wrong building the playlist.
              </motion.p>
            )}

            <AnimatePresence mode="wait">
              {status === "ready" && playlist && (
                <motion.div
                  key={`${playlist.timeOfDay}-${playlist.matchedMoods.join(",")}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]"
                >
                  <aside className="md:order-1 md:pt-[38px]">
                    <TrackDetailsPane track={activeTrack} />
                  </aside>

                  <section className="rounded-xl border border-border bg-surface/85 px-4 py-4 backdrop-blur-md md:order-2">
                    <div className="mb-3">
                      <div className="flex items-baseline justify-between">
                        <h1 className="text-lg font-bold tracking-tight">TONIGHT&apos;S MIX</h1>
                        {playlist.matchedMoods.length > 0 && (
                          <p className="text-xs text-text-muted">
                            {playlist.matchedMoods.join(" · ")}
                          </p>
                        )}
                      </div>
                      <div className="aurora-rule mt-2 h-[3px] w-full rounded-full" />
                    </div>
                    <motion.ol
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      {playlist.tracks.map((track, index) => (
                        <TrackRow
                          key={track.id}
                          track={track}
                          index={index}
                          isActive={activeTrack?.id === track.id}
                          onSelect={selectTrack}
                        />
                      ))}
                    </motion.ol>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>

            {activeTrack?.youtubeId && (
              <iframe
                ref={playerFrameRef}
                title={`${activeTrack.title} by ${activeTrack.artist}`}
                src={`https://www.youtube.com/embed/${activeTrack.youtubeId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&playsinline=1&controls=1&rel=0`}
                className="pointer-events-none absolute bottom-24 right-4 h-[200px] w-[200px] opacity-0"
                allow="autoplay; encrypted-media"
              />
            )}
          </motion.div>

          <PlayerBar
            track={activeTrack}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onPrev={() => stepTrack(-1)}
            onNext={() => stepTrack(1)}
            canNavigate={canNavigate}
            canPlay={Boolean(activeTrack?.youtubeId)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
