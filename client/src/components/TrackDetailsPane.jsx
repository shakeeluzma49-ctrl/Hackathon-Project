function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TrackDetailsPane({ track }) {
  if (!track) {
    return (
      <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-text-muted">
        Select a track to see its details.
      </div>
    );
  }

  const hasAudio = Boolean(track.url);

  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-5">
      <p className="mb-1 text-[11px] tracking-[0.15em] text-text-muted">TRACK DETAILS</p>
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
          <dd>{hasAudio ? "Loaded" : "Not wired up yet"}</dd>
        </div>
      </dl>
    </div>
  );
}
