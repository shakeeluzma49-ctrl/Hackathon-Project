function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TrackRow({ track, index, isActive, onSelect }) {
  const hasAudio = Boolean(track.url);

  return (
    <li className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => onSelect(track)}
        className={`grid w-full grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-3 text-left transition-colors hover:bg-surface-hover/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
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
      </button>
    </li>
  );
}
