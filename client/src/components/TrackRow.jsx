import { motion } from "framer-motion";

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export default function TrackRow({ track, index, isActive, onSelect }) {
  const hasAudio = Boolean(track.url);

  return (
    <motion.li variants={item} className="border-b border-border last:border-b-0">
      <motion.button
        type="button"
        onClick={() => onSelect(track)}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className={`grid w-full grid-cols-[3rem_1fr_auto] items-baseline gap-4 rounded-md py-3 text-left transition-colors hover:bg-surface-hover/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
          isActive ? "bg-surface-hover/60" : ""
        }`}
      >
        <span
          className={`text-sm tabular-nums ${isActive ? "text-accent-teal" : "text-text-muted"}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
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
