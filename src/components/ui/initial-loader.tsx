"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/lib/constants";
import { AstraLogo } from "@/components/ui/astra-logo";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function InitialLoader() {
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      const quickTimer = setTimeout(() => setLoading(false), 150);
      return () => clearTimeout(quickTimer);
    }

    const startTime = performance.now();
    const duration = 900;
    let frameId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const ratio = Math.min(1, elapsed / duration);
      setCounter(Math.round(ratio * 100));

      if (ratio < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setLoading(false), 120);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [reducedMotion]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-obsidian text-bone p-6 sm:p-10 select-none film-grain"
        >
          {/* Top Telemetry Header */}
          <div className="flex items-center justify-between font-mono text-3xs text-ash uppercase tracking-widest border-b border-hairline pb-4">
            <span>{BRAND.name} — {BRAND.division}</span>
            <span>{BRAND.coordinates}</span>
          </div>

          {/* Center Calibration Readout */}
          <div className="my-auto flex flex-col items-start max-w-md w-full mx-auto">
            <AstraLogo size={42} className="mb-8" />
            <div className="w-full flex items-baseline justify-between mb-3">
              <span className="font-mono text-2xs text-ash uppercase tracking-widest">
                AVIONICS BUS CALIBRATION
              </span>
              <span className="font-mono text-2xl font-bold text-bone tabular-nums">
                {counter.toString().padStart(3, "0")}%
              </span>
            </div>

            <div className="w-full h-px bg-steel relative overflow-hidden">
              <div
                className="h-full bg-signal transition-none"
                style={{ width: `${counter}%` }}
              />
            </div>
          </div>

          {/* Bottom Protocol Stamp */}
          <div className="flex items-center justify-between font-mono text-3xs text-ash uppercase tracking-widest border-t border-hairline pt-4">
            <span>FLIGHT COMPUTER SYNCHRONIZED</span>
            <span className="text-signal">NOMINAL</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
