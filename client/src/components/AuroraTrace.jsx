import { useEffect, useState } from "react";

const WIDTH = 400;
const POINTS = 21;
const FRAME_RATE = 1000 / 12;

const LAYERS = [
  { base: 26, amplitude: 5, phase: 0, speed: 0.55, delayFrames: 0, stroke: "var(--color-accent-teal)", width: 1.5, className: "aurora-trace-path" },
  { base: 24, amplitude: 8, phase: 2.4, speed: 0.8, delayFrames: 6, stroke: "var(--color-accent)", width: 1.5, className: "aurora-trace-path is-delayed" },
  { base: 22, amplitude: 6, phase: 4.8, speed: 1.05, delayFrames: 12, stroke: "var(--color-accent-violet)", width: 1, opacity: 0.7, className: "aurora-trace-path is-more-delayed" },
];

function buildPath(base, amplitude, phase, speed, frame) {
  return Array.from({ length: POINTS }, (_, index) => {
    const x = (WIDTH / (POINTS - 1)) * index;
    const direction = index % 2 === 0 ? -1 : 1;
    const modulation = 0.55 + 0.45 * ((Math.sin(index * 1.9 + phase + frame * speed) + 1) / 2);
    const y = index === 0 || index === POINTS - 1
      ? base
      : base + direction * amplitude * modulation;
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

export default function AuroraTrace() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return undefined;

    const interval = window.setInterval(() => setFrame((current) => current + 1), FRAME_RATE);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <svg
      viewBox="0 0 400 48"
      className="h-10 w-full text-border"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {LAYERS.map((layer) => (
        <path
          key={layer.className}
          d={buildPath(layer.base, layer.amplitude, layer.phase, layer.speed, frame - layer.delayFrames)}
          fill="none"
          stroke={layer.stroke}
          strokeWidth={layer.width}
          opacity={layer.opacity}
          className={layer.className}
        />
      ))}
    </svg>
  );
}
