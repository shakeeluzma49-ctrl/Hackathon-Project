import { motion } from "framer-motion";

function formatDuration(seconds) {
  if (seconds == null) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export default function TrackRow({ track, index, isActive, onSelect }) {
  const hasAudio = Boolean(track.youtubeId || track.url);

  return (
    <motion.li variants={item} className="border-b border-border last:border-b-0">
      <motion.button
        type="button"
        onClick={() => onSelect(track)}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className={`grid w-full grid-cols-[2.75rem_3rem_minmax(0,1fr)_auto] items-center gap-3 rounded-md py-3 text-left transition-colors hover:bg-surface-hover/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent sm:grid-cols-[3rem_3.5rem_minmax(0,1fr)_auto] ${
          isActive ? "bg-surface-hover/60" : ""
        }`}
      >
        <span
          className={`text-sm tabular-nums ${isActive ? "text-accent-teal" : "text-text-muted"}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        {track.coverUrl ? (
          <img
            src={track.coverUrl}
            alt={`Album cover for ${track.title}`}
            className="h-12 w-12 rounded object-cover"
            loading="lazy"
          />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded border border-border text-lg text-text-muted" aria-hidden="true">
            ♪
          </span>
        )}
        <span className="min-w-0">
          <p className={`truncate text-sm ${isActive ? "font-bold text-accent" : "text-text"}`}>
            {track.title}
          </p>
          <p className="truncate text-xs text-text-muted">{track.artist}</p>
        </span>
        <span className="flex items-center gap-3 text-xs text-text-muted">
          {!hasAudio && (
            <span className="rounded-full border border-border px-2 py-0.5 text-[11px] tracking-wide">
              NO AUDIO
            </span>
          )}
          <span className="tabular-nums">{formatDuration(track.durationSec)}</span>
        </span>
      </motion.button>
    </motion.li>
  );
}
