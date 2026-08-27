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
            <span className="border border-border px-2 py-0.5 text-[11px] tracking-wide">
              NO AUDIO
            </span>
          )}
          <span className="tabular-nums">{formatDuration(track.durationSec)}</span>
        </span>
      </button>

      {isActive && (
        <div className="mb-3 flex items-center gap-3 border border-border bg-surface px-3 py-2">
          <button
            type="button"
            onClick={onTogglePlay}
            disabled={!hasAudio}
            className="flex h-6 w-6 items-center justify-center border border-accent bg-accent text-on-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-30"
            title={hasAudio ? (isPlaying ? "Pause" : "Play") : "No audio file loaded yet"}
          >
            {isPlaying ? (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="5" y="4" width="5" height="16" rx="1" />
                <rect x="14" y="4" width="5" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 4.5v15l14-7.5z" />
              </svg>
            )}
          </button>
          <span className="text-xs text-text-muted">
            {hasAudio ? (isPlaying ? "PLAYING" : "PAUSED") : "AUDIO FILE NOT WIRED UP YET"}
          </span>
        </div>
      )}
    </li>
  );
}
