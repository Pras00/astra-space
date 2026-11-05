"use client";

import { useRef } from "react";
import { motion, MotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface ScrubWordProps {
  readonly word: string;
  readonly range: readonly [number, number];
  readonly progress: MotionValue<number>;
  readonly isSignal?: boolean;
}

function ScrubWord({ word, range, progress, isSignal = false }: ScrubWordProps) {
  const opacity = useTransform(progress, [range[0], range[1]], [0.16, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className={isSignal ? "text-signal inline-block mr-3 sm:mr-4" : "text-bone inline-block mr-3 sm:mr-4"}
    >
      {word}
    </motion.span>
  );
}

interface ScrubTextRevealProps {
  readonly text: string;
  readonly signalWords?: readonly string[];
  readonly indexCode: string;
  readonly metaLabel: string;
}

export function ScrubTextReveal({
  text,
  signalWords = [],
  indexCode,
  metaLabel,
}: ScrubTextRevealProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.75", "end 0.35"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 28,
    restDelta: 0.001,
  });

  const words = text.split(" ");
  const signalSet = new Set(signalWords.map((w) => w.toUpperCase()));

  return (
    <div ref={sectionRef} className="relative py-12 md:py-20">
      {/* Top Architectural Rule & Coordinates */}
      <div className="flex items-center justify-between pb-6 mb-10 border-b border-hairline font-mono text-2xs text-ash uppercase tracking-widest">
        <span>{indexCode}</span>
        <span>{metaLabel}</span>
      </div>

      {/* Scrubbed Kinetic Statement */}
      <p className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none uppercase max-w-6xl">
        {reducedMotion
          ? words.map((word, idx) => {
              const clean = word.replace(/[^A-Za-z0-9-]/g, "").toUpperCase();
              const isSignal = signalSet.has(clean);
              return (
                <span
                  key={`${word}-${idx}`}
                  className={isSignal ? "text-signal inline-block mr-3 sm:mr-4" : "text-bone inline-block mr-3 sm:mr-4"}
                >
                  {word}
                </span>
              );
            })
          : words.map((word, idx) => {
              const step = 1 / words.length;
              const start = idx * step * 0.85;
              const end = Math.min(1, start + step * 1.6);
              const clean = word.replace(/[^A-Za-z0-9-]/g, "").toUpperCase();
              const isSignal = signalSet.has(clean);
              return (
                <ScrubWord
                  key={`${word}-${idx}`}
                  word={word}
                  range={[start, end]}
                  progress={smoothProgress}
                  isSignal={isSignal}
                />
              );
            })}
      </p>

      {/* Progressive Shutter Hairline */}
      {!reducedMotion && (
        <div className="mt-12 w-full h-px bg-hairline relative overflow-hidden">
          <motion.div
            style={{ scaleX: smoothProgress }}
            className="absolute inset-0 bg-signal origin-left"
          />
        </div>
      )}
    </div>
  );
}

