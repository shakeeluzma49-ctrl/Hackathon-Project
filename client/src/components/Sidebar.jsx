const TIME_GREETING = {
  morning: "Good morning",
  afternoon: "Good afternoon",
  evening: "Good evening",
  night: "Late night",
};

export default function Sidebar({ timeOfDay }) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-6 bg-black p-6 md:flex">
      <div className="flex items-center gap-2">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          className="text-accent"
          aria-hidden="true"
        >
          <path
            d="M4 13v-1a8 8 0 0 1 16 0v1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="3" y="13" width="4" height="7" rx="1.5" fill="currentColor" />
          <rect x="17" y="13" width="4" height="7" rx="1.5" fill="currentColor" />
        </svg>
        <span className="text-lg font-bold tracking-tight">DayMix</span>
      </div>
      <div className="rounded-lg bg-surface p-4">
        <p className="text-xs text-text-muted uppercase tracking-wide">Right now</p>
        <p className="mt-1 font-semibold">{TIME_GREETING[timeOfDay] ?? "Hello"}</p>
      </div>
      <nav className="flex flex-col gap-1 text-sm text-text-muted">
        <span className="rounded px-2 py-1.5 font-medium text-text">Your Day</span>
        <span className="rounded px-2 py-1.5 opacity-50">Liked Songs (soon)</span>
        <span className="rounded px-2 py-1.5 opacity-50">History (soon)</span>
      </nav>
    </aside>
  );
}
