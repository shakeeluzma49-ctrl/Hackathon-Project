import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

function formatDuration(seconds) {
  if (seconds == null) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TrackDetailsPane({ track }) {
  return (
    <AnimatePresence mode="wait">
      {!track ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="rounded-xl border border-dashed border-border bg-surface/60 px-4 py-6 text-center text-sm text-text-muted backdrop-blur-md"
        >
          Select a track to see its details.
        </motion.div>
      ) : (
        <motion.div
          key={track.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="rounded-xl border border-border bg-surface/85 px-4 py-5 backdrop-blur-md"
        >
          <p className="mb-1 text-[11px] tracking-[0.15em] text-text-muted">TRACK DETAILS</p>
          {track.coverUrl ? (
            <img
              src={track.coverUrl}
              alt={`Album cover for ${track.title}`}
              className="mb-4 aspect-square w-full rounded object-cover"
            />
          ) : (
            <div className="mb-4 flex aspect-square w-full items-center justify-center rounded border border-border text-4xl text-text-muted" aria-hidden="true">
              ♪
            </div>
          )}
          <h2 className="mb-1 text-xl font-bold">{track.title}</h2>
          <p className="mb-4 text-sm text-text-muted">{track.artist}</p>

          <dl className="space-y-2 text-xs">
            <div className="flex justify-between border-t border-border pt-2">
              <dt className="text-text-muted">Duration</dt>
              <dd className="tabular-nums">{formatDuration(track.durationSec)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <dt className="text-text-muted">Time of day</dt>
              <dd>{track.timeTags.join(", ")}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-border pt-2">
              <dt className="shrink-0 text-text-muted">Mood</dt>
              <dd className="text-right">{track.moodTags.join(", ")}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <dt className="text-text-muted">Audio</dt>
              <dd>{track.youtubeId ? "YouTube" : track.url ? "Loaded" : "Not wired up yet"}</dd>
            </div>
          </dl>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
