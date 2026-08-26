export default function NowPlayingBar({ track, isPlaying, onTogglePlay }) {
  if (!track) {
    return (
      <footer className="flex h-20 shrink-0 items-center justify-center border-t border-border bg-surface text-sm text-text-muted">
        Pick a track to get started
      </footer>
    );
  }

  const hasAudio = Boolean(track.url);

  return (
    <footer className="flex h-20 shrink-0 items-center justify-between border-t border-border bg-surface px-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{track.title}</p>
        <p className="truncate text-xs text-text-muted">{track.artist}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onTogglePlay}
          disabled={!hasAudio}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black disabled:cursor-not-allowed disabled:opacity-30"
          title={hasAudio ? (isPlaying ? "Pause" : "Play") : "No audio file loaded yet"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
      </div>
      <div className="hidden text-xs text-text-muted sm:block">
        {hasAudio ? "" : "Audio files not wired up yet"}
      </div>
    </footer>
  );
}
