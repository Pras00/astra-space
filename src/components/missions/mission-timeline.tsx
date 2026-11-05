"use client";

import { useCallback, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { Check } from "lucide-react";
import { MISSIONS } from "@/data/missions";
import { HudBadge } from "@/components/ui/hud-badge";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function MissionTimeline() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.38,
    restDelta: 0.0005,
  });

  // Stepped dwell plateaus so each mission card locks squarely at 100% width while reading
  const trackX = useTransform(
    smoothProgress,
    [0, 0.18, 0.28, 0.46, 0.56, 0.74, 0.84, 1],
    ["0%", "0%", "-25%", "-25%", "-50%", "-50%", "-75%", "-75%"]
  );

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const nextIdx =
      latest < 0.23 ? 0 : latest < 0.51 ? 1 : latest < 0.79 ? 2 : 3;
    setActiveIndex((prev) => (prev === nextIdx ? prev : nextIdx));
  });

  const jumpToMission = useCallback(
    (index: number) => {
      const container = sectionRef.current;
      const safeIndex = Math.max(0, Math.min(MISSIONS.length - 1, index));

      if (
        !container ||
        typeof window === "undefined" ||
        window.innerWidth < 1024
      ) {
        setActiveIndex(safeIndex);
        return;
      }

      const rect = container.getBoundingClientRect();
      const containerTop = window.scrollY + rect.top;
      const scrollable = Math.max(0, container.offsetHeight - window.innerHeight);
      if (scrollable <= 0) return;

      const plateauCenters = [0.08, 0.37, 0.65, 0.92] as const;
      const ratio =
        plateauCenters[index] ?? index / Math.max(1, MISSIONS.length - 1);
      window.scrollTo({
        top: containerTop + scrollable * ratio,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [reducedMotion]
  );

  if (reducedMotion) {
    return (
      <section
        id="missions"
        className="relative py-24 sm:py-32 border-b border-hairline bg-obsidian"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="border-b border-hairline pb-6">
            <div className="flex items-center gap-3 font-mono text-2xs uppercase tracking-widest text-ash mb-2">
              <span className="text-signal font-semibold">02</span>
              <span className="w-4 h-px bg-hairline-strong" />
              <span>MULTI-DECADE FLIGHT CORRIDOR</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tighter text-bone">
              TRAJECTORY MANIFEST
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MISSIONS.map((mission) => (
              <article
                key={mission.code}
                className="border border-hairline bg-carbon p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-hairline pb-3">
                  <span className="font-mono text-2xl font-bold text-signal">
                    {mission.year}
                  </span>
                  <HudBadge variant="neutral">{mission.status}</HudBadge>
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-bone">
                  {mission.title}
                </h3>
                <p className="text-sm text-titanium">{mission.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const renderMissionCard = (
    mission: (typeof MISSIONS)[number],
    idx: number
  ) => (
    <article className="h-full border border-hairline-strong bg-carbon p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center hud-frame">
      {/* Left Monumental Year & Telemetry */}
      <div className="lg:col-span-5 space-y-4 border-b lg:border-b-0 lg:border-r border-hairline pb-5 lg:pb-0 lg:pr-7">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-ash uppercase tracking-widest">
            FLIGHT PHASE 0{idx + 1} — {mission.code}
          </span>
          <HudBadge
            variant={
              mission.status === "CURRENT FLIGHT" ? "signal" : "neutral"
            }
            pulse={mission.status === "CURRENT FLIGHT"}
          >
            {mission.status}
          </HudBadge>
        </div>

        <div className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-bone leading-none tabular-nums">
          {mission.year}
        </div>

        <div className="grid grid-cols-3 border border-hairline divide-x divide-hairline bg-obsidian font-mono">
          <div className="p-2 sm:p-2.5">
            <span className="text-3xs text-ash uppercase block truncate">
              DELTA-V
            </span>
            <span className="text-xs sm:text-sm font-bold text-signal tabular-nums mt-0.5 block truncate">
              {mission.trajectoryDeltaV}
            </span>
          </div>
          <div className="p-2 sm:p-2.5">
            <span className="text-3xs text-ash uppercase block truncate">
              DURATION
            </span>
            <span className="text-xs sm:text-sm font-bold text-bone tabular-nums mt-0.5 block truncate">
              {mission.duration}
            </span>
          </div>
          <div className="p-2 sm:p-2.5">
            <span className="text-3xs text-ash uppercase block truncate">
              MANIFEST
            </span>
            <span className="text-xs sm:text-sm font-bold text-bone mt-0.5 block truncate">
              {mission.crew}
            </span>
          </div>
        </div>
      </div>

      {/* Right Mission Narrative & Milestones */}
      <div className="lg:col-span-7 space-y-4">
        <div>
          <span className="font-mono text-2xs text-signal uppercase tracking-widest block mb-1">
            TARGET CORRIDOR — {mission.target}
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-bone">
            {mission.title}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-titanium leading-relaxed">
          {mission.description}
        </p>

        <div className="space-y-2 pt-2 border-t border-hairline">
          <span className="font-mono text-3xs text-ash uppercase tracking-widest block">
            PRIMARY MISSION ARCHITECTURE GATES
          </span>
          <ul className="grid grid-cols-1 gap-1.5">
            {mission.milestones.map((milestone) => (
              <li
                key={milestone}
                className="flex items-center gap-3 px-3 py-2 bg-obsidian border border-hairline text-xs sm:text-sm text-bone"
              >
                <Check
                  className="w-3.5 h-3.5 text-signal shrink-0"
                  aria-hidden="true"
                />
                <span>{milestone}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );

  return (
    <section
      id="missions"
      ref={sectionRef}
      style={
        { "--runway-vh": `${MISSIONS.length * 105}vh` } as React.CSSProperties
      }
      className="relative border-b border-hairline bg-obsidian lg:min-h-[var(--runway-vh)]"
    >
      <div className="relative py-12 sm:py-16 lg:py-0 lg:sticky lg:top-0 lg:min-h-svh flex flex-col justify-center overflow-x-clip lg:pt-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Header + Scroll-Linked Flight Trajectory Ruler */}
          <div className="pb-4 mb-5 border-b border-hairline space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-3 font-mono text-2xs uppercase tracking-widest text-ash mb-1.5">
                  <span className="text-signal font-semibold">02</span>
                  <span className="w-4 h-px bg-hairline-strong" />
                  <span>HORIZONTAL FLIGHT CORRIDOR — SCROLL TO ADVANCE EPOCH</span>
                </div>
                <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tighter text-bone leading-none">
                  TRAJECTORY MANIFEST
                </h2>
              </div>

              <div className="font-mono text-3xs uppercase tracking-widest text-ash tabular-nums">
                PHASE 0{activeIndex + 1} OF 0{MISSIONS.length} —{" "}
                <span className="text-signal">
                  {MISSIONS[activeIndex]?.code}
                </span>
              </div>
            </div>

            {/* Interactive Epoch Nodes Ruler */}
            <div className="relative pt-1">
              <div className="w-full h-px bg-steel relative overflow-hidden mb-2.5">
                <motion.div
                  style={{ scaleX: smoothProgress }}
                  className="absolute inset-0 bg-signal origin-left"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MISSIONS.map((mission, idx) => {
                  const isCurrent = idx === activeIndex;
                  const isPassed = idx < activeIndex;

                  return (
                    <button
                      key={mission.code}
                      type="button"
                      onClick={() => jumpToMission(idx)}
                      className={`text-left py-1.5 px-2.5 border transition-colors cursor-pointer ${
                        isCurrent
                          ? "border-signal bg-carbon text-bone"
                          : isPassed
                          ? "border-hairline-strong bg-obsidian text-titanium"
                          : "border-hairline bg-obsidian text-ash hover:text-bone"
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-2xs">
                        <span
                          className={
                            isCurrent
                              ? "text-signal font-bold"
                              : "font-semibold"
                          }
                        >
                          {mission.year}
                        </span>
                        <span className="hidden sm:inline text-3xs text-ash">
                          {mission.code}
                        </span>
                      </div>
                      <div className="hidden sm:block font-sans text-xs font-medium truncate mt-0.5">
                        {mission.target}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile & Tablet Interactive Card View (No clipping, natural height) */}
          <div className="block lg:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={MISSIONS[activeIndex]?.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderMissionCard(MISSIONS[activeIndex], activeIndex)}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Desktop Horizontal Sliding Viewport */}
          <div className="w-full overflow-hidden hidden lg:block">
            <motion.div
              style={{
                width: `${MISSIONS.length * 100}%`,
                x: trackX,
              }}
              className="flex items-stretch"
            >
              {MISSIONS.map((mission, idx) => (
                <div
                  key={mission.code}
                  style={{ width: `${100 / MISSIONS.length}%` }}
                  className="shrink-0"
                >
                  {renderMissionCard(mission, idx)}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
