"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { GLOBAL_STATISTICS } from "@/data/telemetry";
import { HudBadge } from "@/components/ui/hud-badge";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

function AnimatedStatNumber({
  value,
  decimals = 0,
  padZero = false,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  padZero?: boolean;
  suffix?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (reducedMotion) {
      const frame = requestAnimationFrame(() => setDisplayValue(value));
      return () => cancelAnimationFrame(frame);
    }

    const duration = 1800; // ms
    const startTime = performance.now();

    const updateCounter = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quartic curve
      const ease = 1 - Math.pow(1 - progress, 4);

      const current = ease * value;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [isInView, value, reducedMotion]);

  const formatted = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.floor(displayValue).toString();

  const rendered = padZero && Math.floor(displayValue) < 10
    ? `0${formatted}`
    : formatted;

  return (
    <span ref={ref} className="font-orbitron font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
      {rendered}
      <span className="text-sky-400 font-bold ml-0.5">{suffix}</span>
    </span>
  );
}

export function Statistics() {
  return (
    <section className="relative py-24 sm:py-32 border-b border-slate-900 overflow-hidden bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center mb-3">
            <HudBadge variant="cyan">MISSION METRICS // SECTION 07</HudBadge>
          </div>
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight uppercase">
            NUMBERS BEYOND EARTH
          </h2>
          <p className="font-space text-slate-400 text-sm sm:text-base mt-2 font-light">
            Quantifying over a decade of aerospace milestones, planetary reconnaissance, and deep-space journeys.
          </p>
        </div>

        {/* 4-Stat Minimalist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GLOBAL_STATISTICS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel p-6 sm:p-8 rounded-xl border border-slate-800/80 flex flex-col justify-between hover:border-sky-500/40 transition-colors group"
            >
              <div className="font-mono text-[10px] text-sky-400 tracking-widest uppercase mb-4">
                METRIC // 0{idx + 1}
              </div>

              <div className="my-2">
                <AnimatedStatNumber
                  value={stat.value}
                  decimals={stat.decimals}
                  padZero={stat.padZero}
                  suffix={stat.suffix}
                />
              </div>

              <div>
                <h3 className="font-orbitron text-xs sm:text-sm font-bold tracking-wider text-slate-200 group-hover:text-white uppercase mt-2">
                  {stat.label}
                </h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed font-light">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
