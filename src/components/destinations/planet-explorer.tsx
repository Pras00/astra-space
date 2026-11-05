"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { DESTINATIONS } from "@/data/destinations";
import { HudBadge } from "@/components/ui/hud-badge";
import { FallbackCanvas } from "@/components/3d/fallback-canvas";
import {
  PinnedStageShell,
  StageDescriptor,
  usePinnedStage,
} from "@/components/scrollytelling/pinned-stage";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const DynamicPlanetViewer = dynamic(
  () => import("@/components/3d/planet-viewer").then((mod) => mod.PlanetViewer),
  {
    ssr: false,
    loading: () => <FallbackCanvas />,
  }
);

const PLANET_STAGES: readonly StageDescriptor[] = DESTINATIONS.map(
  (dest, idx) => ({
    id: dest.id,
    code: `0${idx + 1}`,
    label: dest.name,
  })
);

export function PlanetExplorer() {
  const reducedMotion = useReducedMotion();
  const {
    containerRef,
    activeIndex,
    stageProgress,
    totalRunwayVh,
    jumpToStage,
  } = usePinnedStage(PLANET_STAGES, 110);

  const selectedDest = DESTINATIONS[activeIndex] ?? DESTINATIONS[0];
  const stagePct = Math.round(stageProgress * 100);

  return (
    <PinnedStageShell
      id="destinations"
      containerRef={containerRef}
      totalRunwayVh={totalRunwayVh}
      className="bg-obsidian"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Top Architectural Bar */}
        <div className="flex items-end justify-between gap-3 pb-2 mb-2.5 sm:pb-4 sm:mb-5 border-b border-hairline">
          <div className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 font-mono text-3xs sm:text-2xs uppercase tracking-widest text-ash mb-0.5 sm:mb-1.5">
              <span className="text-signal font-semibold">01</span>
              <span className="w-3 sm:w-4 h-px bg-hairline-strong shrink-0" />
              <span className="truncate">
                PLANETARY SURVEY — SCROLL-DRIVEN ORBITAL LOCK
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tighter text-bone leading-none">
              TARGET WORLDS
            </h2>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 font-mono text-3xs uppercase tracking-widest text-ash tabular-nums shrink-0">
            <span>
              BODY 0{activeIndex + 1}/0{DESTINATIONS.length}
            </span>
            <span className="text-signal">
              PASS {stagePct.toString().padStart(3, "0")}%
            </span>
          </div>
        </div>

        {/* 3-Zone Pinned Inspection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-4 lg:gap-8 items-center">
          {/* Left Rail: Scroll-Synced Celestial Stage Index */}
          <div
            role="tablist"
            aria-label="Celestial Bodies"
            className="lg:col-span-3 flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0"
          >
            {DESTINATIONS.map((dest, idx) => {
              const isActive = idx === activeIndex;
              const fillWidth = isActive
                ? `${Math.max(12, Math.round(stageProgress * 100))}%`
                : idx < activeIndex
                ? "100%"
                : "0%";

              return (
                <button
                  key={dest.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`planet-panel-${dest.id}`}
                  id={`planet-tab-${dest.id}`}
                  onClick={() => jumpToStage(idx)}
                  className={`relative text-left px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-none border transition-colors shrink-0 lg:shrink cursor-pointer overflow-hidden ${
                    isActive
                      ? "bg-carbon border-signal text-bone"
                      : "bg-obsidian border-hairline text-ash hover:text-bone hover:border-hairline-strong"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 sm:gap-3 font-mono text-3xs sm:text-2xs uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      <span
                        className={
                          isActive ? "text-signal font-bold" : "text-ash"
                        }
                      >
                        0{idx + 1}
                      </span>
                      <span className="font-semibold">{dest.name}</span>
                    </span>
                    <span className="hidden sm:inline lg:hidden xl:inline text-3xs text-ash tabular-nums">
                      {dest.distance}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-steel">
                    <div
                      className={`h-full transition-none ${
                        isActive ? "bg-signal" : "bg-ash/40"
                      }`}
                      style={{ width: fillWidth }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Center Column: Interactive + Scroll-Scrubbed 3D Planet */}
          <div className="lg:col-span-5 relative flex items-center justify-center border border-hairline bg-carbon/40 hud-frame">
            <DynamicPlanetViewer
              destination={selectedDest}
              stageProgress={stageProgress}
            />
          </div>

          {/* Right Column: Engineering Telemetry Readout */}
          <div className="lg:col-span-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDest.id}
                id={`planet-panel-${selectedDest.id}`}
                role="tabpanel"
                aria-labelledby={`planet-tab-${selectedDest.id}`}
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="border border-hairline bg-carbon p-3 sm:p-5 space-y-2 sm:space-y-4"
              >
                <div className="flex items-start justify-between gap-3 border-b border-hairline pb-2 sm:pb-3">
                  <div className="min-w-0">
                    <span className="font-mono text-3xs text-ash uppercase tracking-widest block mb-0.5 sm:mb-1 truncate">
                      {selectedDest.coordinates}
                    </span>
                    <h3 className="font-display text-xl sm:text-3xl font-bold uppercase tracking-tighter text-bone leading-none">
                      {selectedDest.name}
                    </h3>
                    <p className="text-2xs sm:text-xs text-titanium mt-0.5 truncate">
                      {selectedDest.subtitle}
                    </p>
                  </div>
                  <HudBadge variant="signal">{selectedDest.status}</HudBadge>
                </div>

                <p className="text-2xs sm:text-sm text-titanium leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {selectedDest.description}
                </p>

                <div className="grid grid-cols-2 border border-hairline divide-x divide-y divide-hairline bg-obsidian font-mono">
                  <div className="p-1.5 sm:p-2.5">
                    <span className="text-3xs text-ash uppercase tracking-widest block">
                      TRANSIT DIST
                    </span>
                    <span className="text-2xs sm:text-sm font-bold text-bone tabular-nums mt-0.5 block">
                      {selectedDest.distance}
                    </span>
                  </div>
                  <div className="p-1.5 sm:p-2.5">
                    <span className="text-3xs text-ash uppercase tracking-widest block">
                      SURFACE GRAVITY
                    </span>
                    <span className="text-2xs sm:text-sm font-bold text-bone tabular-nums mt-0.5 block">
                      {selectedDest.gravity}
                    </span>
                  </div>
                  <div className="p-1.5 sm:p-2.5">
                    <span className="text-3xs text-ash uppercase tracking-widest block">
                      MEAN TEMP
                    </span>
                    <span className="text-2xs sm:text-sm font-bold text-bone tabular-nums mt-0.5 block">
                      {selectedDest.temperature}
                    </span>
                  </div>
                  <div className="p-1.5 sm:p-2.5">
                    <span className="text-3xs text-ash uppercase tracking-widest block">
                      ORBITAL PERIOD
                    </span>
                    <span className="text-2xs sm:text-sm font-bold text-bone tabular-nums mt-0.5 block">
                      {selectedDest.orbitalPeriod}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2 pt-0.5 sm:pt-1">
                  <div className="flex items-center justify-between font-mono text-3xs uppercase tracking-widest">
                    <span className="text-ash">INFRASTRUCTURE READINESS</span>
                    <span className="text-signal font-bold tabular-nums">
                      {selectedDest.progress}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-obsidian border border-hairline overflow-hidden">
                    <div
                      className="h-full bg-signal"
                      style={{ width: `${selectedDest.progress}%` }}
                    />
                  </div>
                  <p className="font-mono text-3xs text-ash pt-0.5 leading-snug sm:leading-relaxed line-clamp-1 sm:line-clamp-none">
                    DIRECTIVE: {selectedDest.scientificGoal}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PinnedStageShell>
  );
}
