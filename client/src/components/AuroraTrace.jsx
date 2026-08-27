export default function AuroraTrace() {
  return (
    <svg
      viewBox="0 0 400 48"
      className="h-10 w-full text-border"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,26 L20,24 L40,22 L60,26 L80,20 L100,24 L120,18 L140,26 L160,22 L180,20 L200,26 L220,22 L240,18 L260,24 L280,22 L300,20 L320,26 L340,22 L360,24 L380,20 L400,24"
        fill="none"
        stroke="var(--color-accent-teal)"
        strokeWidth="1.5"
        className="aurora-trace-path"
      />
      <path
        d="M0,24 L20,18 L40,30 L60,14 L80,26 L100,20 L120,34 L140,12 L160,24 L180,28 L200,16 L220,30 L240,20 L260,26 L280,14 L300,24 L320,18 L340,30 L360,16 L380,24 L400,20"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        className="aurora-trace-path is-delayed"
      />
      <path
        d="M0,22 L20,28 L40,20 L60,24 L80,16 L100,26 L120,20 L140,30 L160,18 L180,24 L200,20 L220,26 L240,16 L260,22 L280,28 L300,18 L320,24 L340,20 L360,28 L380,18 L400,24"
        fill="none"
        stroke="var(--color-accent-violet)"
        strokeWidth="1"
        opacity="0.7"
        className="aurora-trace-path is-more-delayed"
      />
    </svg>
  );
}
