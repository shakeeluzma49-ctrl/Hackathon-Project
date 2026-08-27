export default function PlayerBar({ track, isPlaying, onTogglePlay, onPrev, onNext, canNavigate }) {
  const hasAudio = Boolean(track?.url);

  return (
    <div className="fixed inset-x-0 bottom-0 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-5xl grid-cols-3 items-center gap-4 px-6 py-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-bold">{track ? track.title : "Nothing selected"}</p>
          <p className="truncate text-[11px] text-text-muted">{track ? track.artist : "—"}</p>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={onPrev}
            disabled={!canNavigate}
            className="text-text-muted transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous track"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 5h2v14H6zM20 5v14l-11-7z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            disabled={!hasAudio}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-accent bg-accent text-on-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-30"
            title={hasAudio ? (isPlaying ? "Pause" : "Play") : "No audio file loaded yet"}
          >
            {isPlaying ? (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="5" y="4" width="5" height="16" rx="1" />
                <rect x="14" y="4" width="5" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 4.5v15l14-7.5z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!canNavigate}
            className="text-text-muted transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Next track"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16 5h2v14h-2zM4 5v14l11-7z" />
            </svg>
          </button>
        </div>

        <div aria-hidden="true" />
      </div>
    </div>
  );
}
