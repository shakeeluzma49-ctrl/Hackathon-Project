import { useEffect } from "react";
import AuroraTrace from "./AuroraTrace.jsx";

export default function SplashScreen({ onContinue }) {
  useEffect(() => {
    window.addEventListener("keydown", onContinue);
    return () => window.removeEventListener("keydown", onContinue);
  }, [onContinue]);

  return (
    <div
      onClick={onContinue}
      className="flex min-h-screen cursor-pointer flex-col items-center justify-center bg-bg px-6 text-center text-text"
    >
      <p className="mb-6 text-xs tracking-[0.3em] text-text-muted">AURORA MONITOR — BOOT</p>
      <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl">AURORA</h1>
      <div className="mb-8 w-full max-w-xs">
        <AuroraTrace />
      </div>
      <p className="text-sm tracking-[0.15em] text-text-muted">
        PRESS ANY KEY TO CONTINUE<span className="blink-cursor ml-1">_</span>
      </p>
    </div>
  );
}
