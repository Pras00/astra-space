"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Thermometer, Orbit, Gauge, Activity } from "lucide-react";
import { DESTINATIONS } from "@/data/destinations";
import { SectionHeading } from "@/components/ui/section-heading";
import { HudBadge } from "@/components/ui/hud-badge";
import { FallbackCanvas } from "@/components/3d/fallback-canvas";

const DynamicPlanetViewer = dynamic(
  () => import("@/components/3d/planet-viewer").then((mod) => mod.PlanetViewer),
  {
    ssr: false,
    loading: () => <FallbackCanvas />,
  }
);

export function PlanetExplorer() {
  const [selectedDestId, setSelectedDestId] = useState<string>("mars");
  const selectedDest =
    DESTINATIONS.find((d) => d.id === selectedDestId) || DESTINATIONS[2];

  return (
    <section
      id="destinations"
      className="relative py-28 sm:py-36 border-b border-slate-900 overflow-hidden"
    >
      {/* Dynamic Background Atmosphere Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[180px] opacity-25 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: selectedDest.glowColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            tag="ORBITAL TARGETS // SECTION 02"
            title="DESTINATIONS"
            subtitle="Worlds waiting to be explored. From cislunar outposts to prebiotic methane seas."
          />

          {/* Planet Selector Tabs */}
          <div
            role="tablist"
            aria-label="Celestial Destinations"
            className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950/80 border border-slate-800 backdrop-blur-md overflow-x-auto max-w-full"
          >
            {DESTINATIONS.map((dest) => {
              const isActive = dest.id === selectedDestId;
              return (
                <button
                  key={dest.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${dest.id}`}
                  id={`tab-${dest.id}`}
                  onClick={() => setSelectedDestId(dest.id)}
                  className={`relative px-3.5 py-2 rounded font-orbitron text-xs tracking-wider uppercase transition-all duration-300 select-none whitespace-nowrap ${
                    isActive
                      ? "text-slate-950 font-bold bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  {dest.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Explorer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 3D Interactive Planet Canvas */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Background Radar Range Marks */}
            <div className="absolute w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] rounded-full border border-slate-800/80 pointer-events-none" />
            <div className="absolute w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] rounded-full border border-slate-800/40 border-dashed pointer-events-none" />

            <div className="w-full relative z-10">
              <DynamicPlanetViewer destination={selectedDest} />
            </div>
          </div>

          {/* Right Column: Planet Telemetry & Deep Narrative */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDest.id}
                id={`panel-${selectedDest.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${selectedDest.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Header & Status */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <HudBadge
                      variant={
                        selectedDest.status === "ACTIVE EXPEDITION"
                          ? "emerald"
                          : selectedDest.status === "ESTABLISHED BASE"
                          ? "cyan"
                          : "violet"
                      }
                      pulse
                    >
                      {selectedDest.status}
                    </HudBadge>
                    <span className="font-mono text-xs text-slate-400">
                      ORBITAL PERIOD: {selectedDest.orbitalPeriod}
                    </span>
                  </div>

                  <h3 className="font-orbitron text-4xl sm:text-5xl font-black tracking-tight text-white uppercase">
                    {selectedDest.name}
                  </h3>
                  <p className="font-space text-base text-sky-300/90 font-medium mt-1">
                    {selectedDest.subtitle}
                  </p>
                </div>

                {/* Telemetry Metrics 4-Box Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Distance */}
                  <div className="glass-panel p-4 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono mb-1">
                      <Compass className="w-3.5 h-3.5 text-sky-400" />
                      <span>{selectedDest.distanceLabel}</span>
                    </div>
                    <span className="font-orbitron text-xl sm:text-2xl font-bold text-white tracking-wide">
                      {selectedDest.distance}
                    </span>
                  </div>

                  {/* Surface Temperature */}
                  <div className="glass-panel p-4 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono mb-1">
                      <Thermometer className="w-3.5 h-3.5 text-orange-400" />
                      <span>SURFACE TEMPERATURE</span>
                    </div>
                    <span className="font-orbitron text-xl sm:text-2xl font-bold text-white tracking-wide">
                      {selectedDest.temperature}
                    </span>
                  </div>

                  {/* Surface Gravity */}
                  <div className="glass-panel p-4 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono mb-1">
                      <Gauge className="w-3.5 h-3.5 text-sky-400" />
                      <span>SURFACE GRAVITY</span>
                    </div>
                    <span className="font-orbitron text-xl sm:text-2xl font-bold text-white tracking-wide">
                      {selectedDest.gravity}
                    </span>
                  </div>

                  {/* Exploration Progress */}
                  <div className="glass-panel p-4 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
                      <span className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-emerald-400" />
                        SURFACE MAPPED
                      </span>
                      <span className="text-emerald-400 font-bold">
                        {selectedDest.progress}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedDest.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Narrative & Scientific Goal */}
                <div className="space-y-3 pt-2">
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                    {selectedDest.description}
                  </p>

                  <div className="p-3.5 rounded bg-slate-900/50 border border-slate-800/80 text-xs font-mono text-slate-300 flex items-start gap-2.5">
                    <Orbit className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sky-400 font-semibold uppercase block mb-0.5">
                        PRIMARY SCIENTIFIC DIRECTIVE
                      </span>
                      <span>{selectedDest.scientificGoal}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
