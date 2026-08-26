function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TrackRow({ track, index, isActive, onSelect }) {
  const hasAudio = Boolean(track.url);

  return (
    <button
      type="button"
      onClick={() => onSelect(track)}
      className={`grid w-full grid-cols-[2rem_1fr_auto] items-center gap-4 rounded-md px-3 py-2 text-left transition-colors hover:bg-surface-hover ${
        isActive ? "bg-surface-hover" : ""
      }`}
    >
      <span className={`text-sm ${isActive ? "text-accent" : "text-text-muted"}`}>
        {index + 1}
      </span>
      <span className="min-w-0">
        <p className={`truncate text-sm font-medium ${isActive ? "text-accent" : "text-text"}`}>
          {track.title}
        </p>
        <p className="truncate text-xs text-text-muted">{track.artist}</p>
      </span>
      <span className="flex items-center gap-3 text-xs text-text-muted">
        {!hasAudio && (
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide">
            No audio yet
          </span>
        )}
        {formatDuration(track.durationSec)}
      </span>
    </button>
  );
}
