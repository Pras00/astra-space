"use client";

import { useState } from "react";
import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ScrollHudFrame() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  const [percent, setPercent] = useState<string>("000");

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const clamped = Math.max(0, Math.min(100, Math.round(latest * 100)));
    setPercent(clamped.toString().padStart(3, "0"));
  });

  const activeScale = reducedMotion ? scrollYProgress : smoothProgress;

  return (
    <div
      className="fixed inset-0 z-30 pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Top 2px International Aerospace Orange Scroll Scrubber */}
      <motion.div
        style={{ scaleX: activeScale }}
        className="fixed top-0 left-0 right-0 h-0.5 bg-signal origin-left z-50"
      />

      {/* Left & Right Architectural Viewport Datum Rails (Desktop) */}
      <div className="hidden xl:flex fixed top-20 bottom-8 left-5 flex-col justify-between items-start text-3xs font-mono text-ash/60 tracking-widest">
        <span>+</span>
        <span className="-rotate-90 origin-left translate-y-8">
          ASTRA // ORBITAL DATUM
        </span>
        <span>+</span>
      </div>

      <div className="hidden xl:flex fixed top-20 bottom-8 right-5 flex-col justify-between items-end text-3xs font-mono text-ash/70 tracking-widest tabular-nums">
        <span>+</span>
        <div className="flex flex-col items-end gap-1">
          <span className="text-signal">TRK {percent}%</span>
          <span className="w-3 h-px bg-hairline-strong" />
        </div>
        <span>+</span>
      </div>
    </div>
  );
}

