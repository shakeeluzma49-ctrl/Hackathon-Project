import { useEffect } from "react";
import { motion } from "framer-motion";
import AuroraTrace from "./AuroraTrace.jsx";
import bgImage from "../assets/aurora-bg.jpg";

const EASE = [0.16, 1, 0.3, 1];

const bgStyle = {
  backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.35)), url(${bgImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

export default function SplashScreen({ onContinue }) {
  useEffect(() => {
    window.addEventListener("keydown", onContinue);
    return () => window.removeEventListener("keydown", onContinue);
  }, [onContinue]);

  return (
    <motion.div
      onClick={onContinue}
      style={bgStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="flex min-h-screen cursor-pointer flex-col items-center justify-center bg-bg px-6 text-center text-text [text-shadow:0_2px_18px_rgba(0,0,0,0.75)]"
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
        className="mb-6 text-xs tracking-[0.3em] text-text-muted"
      >
        YOUR MOOD, IN MUSIC
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
        className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl"
      >
        AURORA
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
        className="mb-8 w-full max-w-xs"
      >
        <AuroraTrace />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
        className="text-sm tracking-[0.15em] text-text-muted"
      >
        PRESS ANY KEY TO CONTINUE<span className="blink-cursor ml-1">_</span>
      </motion.p>
    </motion.div>
  );
}
