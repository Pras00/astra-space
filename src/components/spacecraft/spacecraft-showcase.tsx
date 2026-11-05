"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { SPACECRAFT_FLEET } from "@/data/spacecraft";
import { HudBadge } from "@/components/ui/hud-badge";
import {
  PinnedStageShell,
  StageDescriptor,
  usePinnedStage,
} from "@/components/scrollytelling/pinned-stage";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const DynamicSpacecraftViewer = dynamic(
  () =>
    import("@/components/3d/spacecraft-viewer").then(
      (mod) => mod.SpacecraftViewer
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-40 sm:h-60 lg:h-92 flex items-center justify-center font-mono text-2xs text-ash uppercase tracking-widest">
        LOADING HULL CAD GEOMETRY...
      </div>
    ),
  }
);

const FLEET_STAGES: readonly StageDescriptor[] = SPACECRAFT_FLEET.map(
  (craft, idx) => ({
    id: craft.id,
    code: `0${idx + 1}`,
    label: craft.name,
  })
);

export function SpacecraftShowcase() {
  const reducedMotion = useReducedMotion();
  const {
    containerRef,
    activeIndex,
    stageProgress,
    totalRunwayVh,
    jumpToStage,
  } = usePinnedStage(FLEET_STAGES, 115);

  const selectedCraft = SPACECRAFT_FLEET[activeIndex] ?? SPACECRAFT_FLEET[0];
  const yawDegrees = Math.round(25 + stageProgress * 145);

  return (
    <PinnedStageShell
      id="spacecraft"
      containerRef={containerRef}
      totalRunwayVh={totalRunwayVh}
      className="bg-obsidian"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header + Vehicle Stage Selector */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2.5 sm:gap-4 pb-2.5 mb-3 sm:pb-4 sm:mb-5 border-b border-hairline">
          <div className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 font-mono text-3xs sm:text-2xs uppercase tracking-widest text-ash mb-0.5 sm:mb-1.5">
              <span className="text-signal font-semibold">03</span>
              <span className="w-3 sm:w-4 h-px bg-hairline-strong shrink-0" />
              <span className="truncate">
                FLEET ARCHITECTURE — SCROLL TO ORBIT 3D HULL
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tighter text-bone leading-none">
              FLIGHT VEHICLES
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="ASTRA Spacecraft Fleet"
            className="flex items-center w-full sm:w-auto border border-hairline-strong bg-carbon divide-x divide-hairline"
          >
            {SPACECRAFT_FLEET.map((craft, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={craft.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`craft-panel-${craft.id}`}
                  id={`craft-tab-${craft.id}`}
                  onClick={() => jumpToStage(idx)}
                  className={`relative flex-1 sm:flex-initial text-center px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-3xs sm:text-2xs uppercase tracking-widest transition-colors cursor-pointer ${
                    isActive
                      ? "bg-signal text-bone font-bold"
                      : "text-ash hover:text-bone hover:bg-graphite"
                  }`}
                >
                  {craft.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column 3D Hangar & Engineering Spec Sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 lg:gap-8 items-center">
          {/* Left Column: 3D Hull Inspection Viewport */}
          <div className="lg:col-span-6 relative border border-hairline bg-carbon/50 blueprint-dots hud-frame">
            <div className="absolute top-2 left-2.5 right-2.5 sm:top-3 sm:left-3 sm:right-3 z-10 flex items-center justify-between font-mono text-3xs text-ash uppercase tracking-widest pointer-events-none">
              <span>HULL — {selectedCraft.name}</span>
              <span className="text-signal tabular-nums">YAW {yawDegrees}°</span>
            </div>

            <DynamicSpacecraftViewer
              spacecraft={selectedCraft}
              stageProgress={stageProgress}
            />

            <div className="px-3 py-1.5 sm:px-4 sm:py-2 border-t border-hairline bg-obsidian flex items-center justify-between gap-3 font-mono text-3xs text-ash uppercase tracking-widest">
              <span className="truncate">
                SCROLL OR DRAG TO INSPECT 360° HULL
              </span>
              <span className="text-bone shrink-0">
                {selectedCraft.deltaV} MAX DV
              </span>
            </div>
          </div>

          {/* Right Column: Structural & Propulsion Dossier */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCraft.id}
                id={`craft-panel-${selectedCraft.id}`}
                role="tabpanel"
                aria-labelledby={`craft-tab-${selectedCraft.id}`}
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="space-y-2 sm:space-y-4"
              >
                <div className="flex items-start justify-between gap-3 border-b border-hairline pb-2 sm:pb-3">
                  <div className="min-w-0">
                    <span className="font-mono text-3xs text-signal uppercase tracking-widest block mb-0.5 sm:mb-1 truncate">
                      {selectedCraft.classification}
                    </span>
                    <h3 className="font-display text-xl sm:text-4xl font-bold uppercase tracking-tighter text-bone leading-none">
                      {selectedCraft.name}
                    </h3>
                  </div>
                  <HudBadge variant="neutral">{selectedCraft.status}</HudBadge>
                </div>

                <p className="text-2xs sm:text-sm text-titanium leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {selectedCraft.summary}
                </p>

                <div className="px-2.5 py-1.5 sm:p-3 border border-hairline bg-carbon flex items-center justify-between gap-2">
                  <span className="font-mono text-3xs text-ash uppercase tracking-widest shrink-0">
                    PROPULSION
                  </span>
                  <span className="font-mono text-2xs sm:text-xs font-semibold text-bone truncate">
                    {selectedCraft.propulsion}
                  </span>
                </div>

                <div className="border border-hairline divide-y divide-hairline bg-carbon font-mono">
                  {selectedCraft.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="px-2.5 py-1 sm:px-3.5 sm:py-2 flex items-center justify-between gap-4 text-2xs sm:text-xs"
                    >
                      <span className="text-3xs text-ash uppercase tracking-widest truncate">
                        {spec.label}
                      </span>
                      <span className="text-bone font-semibold tabular-nums shrink-0">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PinnedStageShell>
  );
}
