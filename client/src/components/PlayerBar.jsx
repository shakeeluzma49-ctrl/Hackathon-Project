import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

export default function PlayerBar({ track, isPlaying, onTogglePlay, onPrev, onNext, canNavigate }) {
  const hasAudio = Boolean(track?.url);

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
      className="fixed inset-x-0 bottom-0 border-t border-border bg-surface/85 backdrop-blur-md"
    >
      <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-5 sm:grid-cols-3">
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

        <div className="flex items-center justify-center gap-6 sm:gap-8">
          <motion.button
            type="button"
            onClick={onPrev}
            disabled={!canNavigate}
            whileTap={canNavigate ? { scale: 0.85 } : {}}
            transition={{ duration: 0.12, ease: EASE }}
            className="text-text-muted transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous track"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 5h2v14H6zM20 5v14l-11-7z" />
            </svg>
          </motion.button>

          <motion.button
            type="button"
            onClick={onTogglePlay}
            disabled={!hasAudio}
            whileHover={hasAudio ? { scale: 1.06 } : {}}
            whileTap={hasAudio ? { scale: 0.92 } : {}}
            transition={{ duration: 0.15, ease: EASE }}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-accent bg-accent text-on-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-30"
            title={hasAudio ? (isPlaying ? "Pause" : "Play") : "No audio file loaded yet"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isPlaying ? (
                <motion.svg
                  key="pause"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.15, ease: EASE }}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <rect x="5" y="4" width="5" height="16" rx="1" />
                  <rect x="14" y="4" width="5" height="16" rx="1" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="play"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.15, ease: EASE }}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6 4.5v15l14-7.5z" />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            type="button"
            onClick={onNext}
            disabled={!canNavigate}
            whileTap={canNavigate ? { scale: 0.85 } : {}}
            transition={{ duration: 0.12, ease: EASE }}
            className="text-text-muted transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Next track"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16 5h2v14h-2zM4 5v14l11-7z" />
            </svg>
          </motion.button>
        </div>

        <div className="hidden sm:block" aria-hidden="true" />
      </div>
    </motion.div>
  );
}
