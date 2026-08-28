import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

function formatTime(seconds) {
  if (!seconds) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
}

function Icon({ children }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{children}</svg>;
}

export default function PlayerBar({
  track,
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext,
  canNavigate,
  canPlay,
  currentTime,
  duration,
  onSeek,
  isShuffle,
  isRepeat,
  onToggleShuffle,
  onToggleRepeat,
}) {
  const hasAudio = Boolean(track?.youtubeId) && canPlay;
  const progress = duration ? Math.min((currentTime / duration) * 100, 100) : 0;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
      className="fixed inset-x-0 bottom-0 isolate overflow-hidden border-t border-border bg-surface/90 backdrop-blur-md"
    >
      {track?.coverUrl && (
        <div
          className="pointer-events-none absolute inset-0 -z-10 scale-110 bg-cover bg-center opacity-25 blur-2xl"
          style={{ backgroundImage: `url(${track.coverUrl})` }}
          aria-hidden="true"
        />
      )}
      <div className="relative mx-auto max-w-5xl px-6 py-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:grid-cols-3">
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={track?.id ?? "none"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: EASE }}
              >
                <p className="truncate text-sm font-bold">{track ? track.title : "Nothing selected"}</p>
                <p className="truncate text-xs text-text-muted">{track ? track.artist : "—"}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <button type="button" onClick={onToggleShuffle} className={`transition-colors hover:text-text ${isShuffle ? "text-accent" : "text-text-muted"}`} aria-label="Shuffle playlist" title="Shuffle playlist">
              <Icon><path d="M17 3h4v4M3 7h3c4 0 5 10 9 10h6M17 17h4v4M3 17h3c1.5 0 2.5-1 3.25-2.25M14.75 9.25C15.5 8 16.5 7 18 7h3" fill="none" stroke="currentColor" strokeWidth="2" /></Icon>
            </button>
            <button type="button" onClick={onPrev} disabled={!canNavigate} className="text-text-muted transition-colors hover:text-text disabled:opacity-30" aria-label="Previous track" title="Previous track">
              <Icon><path d="M6 5h2v14H6zM20 5v14l-11-7z" /></Icon>
            </button>
            <motion.button
              type="button"
              onClick={onTogglePlay}
              disabled={!hasAudio}
              whileTap={hasAudio ? { scale: 0.92 } : {}}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-accent bg-accent text-on-accent disabled:cursor-not-allowed disabled:opacity-30"
              aria-label={isPlaying ? "Pause" : "Play"}
              title={hasAudio ? (isPlaying ? "Pause" : "Play") : "YouTube player loading"}
            >
              {isPlaying ? <Icon><rect x="5" y="4" width="5" height="16" rx="1" /><rect x="14" y="4" width="5" height="16" rx="1" /></Icon> : <Icon><path d="M6 4.5v15l14-7.5z" /></Icon>}
            </motion.button>
            <button type="button" onClick={onNext} disabled={!canNavigate} className="text-text-muted transition-colors hover:text-text disabled:opacity-30" aria-label="Next track" title="Next track">
              <Icon><path d="M16 5h2v14h-2zM4 5v14l11-7z" /></Icon>
            </button>
            <button type="button" onClick={onToggleRepeat} className={`transition-colors hover:text-text ${isRepeat ? "text-accent" : "text-text-muted"}`} aria-label="Repeat track" title="Repeat track">
              <Icon><path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3" fill="none" stroke="currentColor" strokeWidth="2" /></Icon>
            </button>
          </div>

          <div className="hidden sm:block" aria-hidden="true" />
        </div>

        <div className="mt-2 flex items-center gap-2 text-[10px] tabular-nums text-text-muted">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="1"
            value={Math.min(currentTime, duration || 0)}
            onChange={onSeek}
            disabled={!hasAudio || !duration}
            aria-label="Track progress"
            className="h-1 min-w-0 flex-1 accent-accent disabled:opacity-30"
            style={{ background: `linear-gradient(to right, var(--color-accent) ${progress}%, color-mix(in oklch, var(--color-border) 70%, transparent) ${progress}%)` }}
          />
          <span>{formatTime(duration)}</span>
        </div>
        <p className="mt-2 text-[9px] leading-4 text-text-muted/75">
          YouTube embedded playback may include ads. Firefox with uBlock Origin may block them; Aurora does not control YouTube advertising.
        </p>
      </div>
    </motion.div>
  );
}
