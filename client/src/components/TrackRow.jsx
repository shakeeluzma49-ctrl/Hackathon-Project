function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TrackRow({ track, index, isActive, isPlaying, onSelect, onTogglePlay }) {
  const hasAudio = Boolean(track.url);

  return (
    <li className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => onSelect(track)}
        className={`grid w-full grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-4 text-left transition-colors hover:bg-surface-hover/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
          isActive ? "bg-surface-hover/40" : ""
        }`}
      >
        <span
          className={`text-lg tabular-nums ${isActive ? "text-accent-teal" : "text-text-muted"}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="min-w-0">
          <p className={`truncate text-sm font-medium ${isActive ? "text-accent" : "text-text"}`}>
            {track.title}
          </p>
          <p className="truncate text-xs text-text-muted">{track.artist}</p>
        </span>
        <span className="flex items-center gap-3 text-xs text-text-muted">
          {!hasAudio && (
            <span className="border border-border px-2 py-0.5 text-xs uppercase tracking-wide">
              No audio
            </span>
          )}
          {formatDuration(track.durationSec)}
        </span>
      </button>

      {isActive && (
        <div className="mb-4 flex items-center gap-3 rounded-md bg-surface px-4 py-2">
          <button
            type="button"
            onClick={onTogglePlay}
            disabled={!hasAudio}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-30"
            title={hasAudio ? (isPlaying ? "Pause" : "Play") : "No audio file loaded yet"}
          >
            {isPlaying ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="5" y="4" width="5" height="16" rx="1" />
                <rect x="14" y="4" width="5" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 4.5v15l14-7.5z" />
              </svg>
            )}
          </button>
          <span className="text-xs text-text-muted">
            {hasAudio ? (isPlaying ? "Playing" : "Paused") : "Audio file not wired up yet"}
          </span>
        </div>
      )}
    </li>
  );
}
