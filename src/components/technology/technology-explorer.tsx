"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Crosshair } from "lucide-react";
import { TECHNOLOGIES } from "@/data/technologies";
import { HudBadge } from "@/components/ui/hud-badge";
import {
  PinnedStageShell,
  StageDescriptor,
  usePinnedStage,
} from "@/components/scrollytelling/pinned-stage";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const TECH_STAGES: readonly StageDescriptor[] = TECHNOLOGIES.map((tech) => ({
  id: tech.id,
  code: tech.tag,
  label: tech.category,
}));

export function TechnologyExplorer() {
  const reducedMotion = useReducedMotion();
  const {
    containerRef,
    activeIndex,
    overallProgress,
    totalRunwayVh,
    jumpToStage,
  } = usePinnedStage(TECH_STAGES, 105);

  const selectedTech = TECHNOLOGIES[activeIndex] ?? TECHNOLOGIES[0];
  const scannerX = Math.max(4, Math.min(96, Math.round(overallProgress * 100)));

  return (
    <PinnedStageShell
      id="technology"
      containerRef={containerRef}
      totalRunwayVh={totalRunwayVh}
      className="bg-obsidian"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="flex items-end justify-between gap-2 pb-2 mb-2 sm:pb-2.5 sm:mb-3 border-b border-hairline">
          <div className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 font-mono text-3xs sm:text-2xs uppercase tracking-widest text-ash mb-0.5 sm:mb-1">
              <span className="text-signal font-semibold">04</span>
              <span className="w-3 sm:w-4 h-px bg-hairline-strong shrink-0" />
              <span className="truncate">
                CLOSED-CYCLE SUBSYSTEMS — X-RAY SCHEMATIC SCAN
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tighter text-bone leading-none">
              VEHICLE SUBSYSTEMS
            </h2>
          </div>

          <div className="font-mono text-3xs uppercase tracking-widest text-ash tabular-nums shrink-0">
            SCAN X:{scannerX.toString().padStart(2, "0")}% —{" "}
            <span className="text-signal">{selectedTech.tag}</span>
          </div>
        </div>

        {/* Subsystem Index Strip */}
        <div
          role="tablist"
          aria-label="Spacecraft Subsystems"
          className="grid grid-cols-3 sm:grid-cols-6 border border-hairline divide-x divide-y sm:divide-y-0 divide-hairline bg-carbon mb-2.5 sm:mb-3.5"
        >
          {TECHNOLOGIES.map((tech, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={tech.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`tech-panel-${tech.id}`}
                id={`tech-tab-${tech.id}`}
                onClick={() => jumpToStage(idx)}
                className={`px-2 py-1 sm:px-2.5 sm:py-1.5 text-left font-mono transition-colors cursor-pointer ${
                  isActive
                    ? "bg-signal text-bone"
                    : "text-ash hover:text-bone hover:bg-graphite"
                }`}
              >
                <span className="text-3xs block opacity-80">{tech.tag}</span>
                <span className="text-3xs sm:text-2xs font-bold uppercase tracking-wider block truncate">
                  {tech.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Blueprint Canvas + Spec Readout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 lg:gap-6 items-stretch">
          {/* Left Column: Scroll-Scrubbed SVG Engineering Blueprint */}
          <div className="lg:col-span-7 relative p-2.5 sm:p-5 border border-hairline bg-carbon blueprint-dots min-h-40 sm:min-h-56 lg:min-h-76 flex items-center justify-center overflow-hidden hud-frame touch-pan-y">
            {!reducedMotion && (
              <div
                className="absolute top-0 bottom-0 w-px bg-signal/75 pointer-events-none z-10"
                style={{ left: `${scannerX}%` }}
              >
                <span
                  className={`absolute bottom-2 px-1 py-0.5 bg-obsidian/90 border border-signal/40 font-mono text-3xs text-signal whitespace-nowrap ${
                    scannerX > 55 ? "-translate-x-full -left-1.5" : "left-1.5"
                  }`}
                >
                  SCAN {scannerX}%
                </span>
              </div>
            )}

            <div className="absolute top-2 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1.5 sm:gap-2 font-mono text-3xs text-ash uppercase tracking-widest pointer-events-none">
              <Crosshair
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-signal"
                aria-hidden="true"
              />
              <span>CAD — ASTRA-MK4-STRUCTURAL</span>
            </div>

            <div className="absolute bottom-2 right-2.5 sm:bottom-3 sm:right-3 font-mono text-3xs text-ash uppercase tracking-widest pointer-events-none">
              SCALE 1:50 — METRIC
            </div>

            <div className="relative w-full max-w-xs sm:max-w-lg aspect-video">
              <svg
                viewBox="0 0 800 500"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="ASTRA Mk4 Spacecraft Structural Blueprint"
              >
                <line
                  x1="30"
                  y1="250"
                  x2="770"
                  y2="250"
                  stroke="rgba(244,244,240,0.16)"
                  strokeWidth="1"
                  strokeDasharray="6 6"
                />
                <line
                  x1="400"
                  y1="40"
                  x2="400"
                  y2="460"
                  stroke="rgba(244,244,240,0.12)"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                />

                <path
                  d="M 80,250 C 135,175 230,168 350,168 L 620,168 L 690,136 L 715,136 L 715,364 L 690,364 L 620,332 L 350,332 C 230,332 135,325 80,250 Z"
                  stroke="#C8CCD6"
                  strokeWidth="1.75"
                  fill="rgba(6, 6, 8, 0.72)"
                />

                <rect
                  x="250"
                  y="188"
                  width="145"
                  height="124"
                  stroke="rgba(244,244,240,0.35)"
                  strokeWidth="1.2"
                />
                <rect
                  x="415"
                  y="184"
                  width="175"
                  height="132"
                  stroke="rgba(244,244,240,0.35)"
                  strokeWidth="1.2"
                />

                <ellipse
                  cx="405"
                  cy="250"
                  rx="36"
                  ry="148"
                  stroke="#FF3B1D"
                  strokeOpacity="0.55"
                  strokeWidth="1.25"
                  strokeDasharray="5 4"
                />

                <polygon
                  points="715,175 765,152 765,222 715,208"
                  stroke="#F4F4F0"
                  strokeWidth="1.5"
                />
                <polygon
                  points="715,292 765,278 765,348 715,325"
                  stroke="#F4F4F0"
                  strokeWidth="1.5"
                />
                <polygon
                  points="715,232 778,220 778,280 715,268"
                  stroke="#FF3B1D"
                  strokeWidth="1.75"
                />

                <path
                  d="M 74,250 C 110,178 158,166 184,164"
                  stroke="#FF3B1D"
                  strokeWidth="2.5"
                />
                <path
                  d="M 74,250 C 110,322 158,334 184,336"
                  stroke="#FF3B1D"
                  strokeWidth="2.5"
                />
              </svg>

              {TECHNOLOGIES.map((tech, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => jumpToStage(idx)}
                    style={{
                      left: `${tech.hotspotX}%`,
                      top: `${tech.hotspotY}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20 cursor-pointer"
                    aria-label={`Inspect ${tech.tag}: ${tech.title}`}
                  >
                    {isSelected && (
                      <span className="absolute -inset-2 border border-signal animate-ping opacity-60" />
                    )}
                    <span
                      className={`relative flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 border font-mono text-3xs font-bold transition-colors ${
                        isSelected
                          ? "bg-signal text-bone border-bone scale-110"
                          : "bg-obsidian/90 text-titanium border-hairline-strong group-hover:border-signal group-hover:text-bone"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Engineering Specification Sheet */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTech.id}
                id={`tech-panel-${selectedTech.id}`}
                role="tabpanel"
                aria-labelledby={`tech-tab-${selectedTech.id}`}
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="h-full border border-hairline bg-carbon p-3 sm:p-4 flex flex-col justify-between space-y-2 sm:space-y-2.5"
              >
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-hairline pb-1.5 sm:pb-2">
                    <span className="font-mono text-3xs sm:text-xs font-bold text-signal">
                      {selectedTech.tag} — {selectedTech.category}
                    </span>
                    <HudBadge variant="neutral">
                      {selectedTech.readinessLevel}
                    </HudBadge>
                  </div>

                  <h3 className="font-display text-base sm:text-xl font-bold uppercase tracking-tight text-bone leading-tight sm:leading-snug">
                    {selectedTech.title}
                  </h3>

                  <p className="text-2xs sm:text-xs text-titanium leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {selectedTech.description}
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-2.5">
                  <div className="grid grid-cols-2 border border-hairline divide-x divide-y divide-hairline bg-obsidian font-mono">
                    {selectedTech.keySpecs.map((spec) => (
                      <div
                        key={spec.label}
                        className="p-1.5 sm:p-2 flex flex-col justify-between gap-0.5"
                      >
                        <span className="text-3xs text-ash uppercase tracking-widest block truncate">
                          {spec.label}
                        </span>
                        <span className="text-2xs sm:text-xs font-bold text-bone tabular-nums block truncate">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 sm:p-2.5 border-l-2 border-signal bg-obsidian font-mono text-3xs text-titanium leading-snug line-clamp-2 sm:line-clamp-none">
                    <span className="text-3xs text-signal uppercase tracking-widest block mb-0.5">
                      OPERATIONAL IMPACT — {selectedTech.efficiency}
                    </span>
                    {selectedTech.breakthrough}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PinnedStageShell>
  );
}
