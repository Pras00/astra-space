"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { GLOBAL_STATISTICS } from "@/data/telemetry";
import { SectionHeading } from "@/components/ui/section-heading";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface AnimatedStatNumberProps {
  readonly value: number;
  readonly decimals?: number;
  readonly padZero?: boolean;
  readonly suffix?: string;
}

function AnimatedStatNumber({
  value,
  decimals = 0,
  padZero = false,
  suffix = "",
}: AnimatedStatNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (reducedMotion) {
      const frame = requestAnimationFrame(() => setDisplayValue(value));
      return () => cancelAnimationFrame(frame);
    }

    const duration = 1400;
    const startTime = performance.now();
    let frameId = 0;

    const updateCounter = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);

      setDisplayValue(ease * value);

      if (progress < 1) {
        frameId = requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(value);
      }
    };

    frameId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, value, reducedMotion]);

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.floor(displayValue).toString();

  const rendered =
    padZero && Math.floor(displayValue) < 10 ? `0${formatted}` : formatted;

  return (
    <span
      ref={ref}
      className="font-display font-bold text-5xl sm:text-6xl text-bone tracking-tighter tabular-nums"
    >
      {rendered}
      <span className="text-signal">{suffix}</span>
    </span>
  );
}

export function Statistics() {
  return (
    <section className="relative py-24 sm:py-32 border-b border-hairline bg-obsidian">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <SectionHeading
          index="06"
          tag="VERIFIED FLIGHT HERITAGE"
          title="OPERATIONAL RECORD"
          subtitle="Cumulative orbital mass delivered, planetary survey passes, and telemetry reliability across active programs."
        />

        {/* Seamless 4-Cell Architectural Ledger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-hairline divide-y sm:divide-y-0 sm:divide-x divide-hairline bg-carbon">
          {GLOBAL_STATISTICS.map((stat) => (
            <div
              key={stat.label}
              className="p-6 sm:p-8 flex flex-col justify-between gap-6"
            >
              <div>
                <AnimatedStatNumber
                  value={stat.value}
                  decimals={stat.decimals}
                  padZero={stat.padZero}
                  suffix={stat.suffix}
                />
                {"unit" in stat && stat.unit && (
                  <span className="font-mono text-xs font-bold text-ash ml-2">
                    {stat.unit}
                  </span>
                )}
              </div>

              <div className="pt-4 border-t border-hairline">
                <h3 className="font-mono text-2xs font-bold uppercase tracking-widest text-bone mb-1.5">
                  {stat.label}
                </h3>
                <p className="text-xs text-ash leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
