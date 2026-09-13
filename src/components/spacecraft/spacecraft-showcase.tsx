"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  ShieldCheck,
  Zap,
  Gauge,
  Layers,
  ArrowRight,
} from "lucide-react";
import { SPACECRAFT_FLEET, Spacecraft } from "@/data/spacecraft";
import { SectionHeading } from "@/components/ui/section-heading";
import { HudBadge } from "@/components/ui/hud-badge";

const DynamicSpacecraftViewer = dynamic(
  () =>
    import("@/components/3d/spacecraft-viewer").then(
      (mod) => mod.SpacecraftViewer
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[360px] flex items-center justify-center font-mono text-xs text-sky-400">
        INITIALIZING SPACECRAFT HULL TELEMETRY...
      </div>
    ),
  }
);

export function SpacecraftShowcase() {
  const [selectedId, setSelectedId] = useState<string>("astra-2");
  const selectedCraft =
    SPACECRAFT_FLEET.find((c) => c.id === selectedId) || SPACECRAFT_FLEET[1];

  return (
    <section
      id="spacecraft"
      className="relative py-28 sm:py-36 border-b border-slate-900 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-sky-950/20 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            tag="FLEET ARCHITECTURE // SECTION 04"
            title="SPACECRAFT"
            subtitle="The vehicles engineered to cross astronomical gulfs. From lunar orbital freighters to interstellar probe carriers."
          />

          {/* Fleet Tabs */}
          <div
            role="tablist"
            aria-label="ASTRA Spacecraft Fleet"
            className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950/80 border border-slate-800 backdrop-blur-md"
          >
            {SPACECRAFT_FLEET.map((craft) => {
              const isActive = craft.id === selectedId;
              return (
                <button
                  key={craft.id}
                  role="tab"
                  aria-selected={isActive}
                  id={`craft-tab-${craft.id}`}
                  onClick={() => setSelectedId(craft.id)}
                  className={`px-4 py-2 rounded font-orbitron text-xs tracking-wider uppercase transition-all duration-300 select-none ${
                    isActive
                      ? "text-slate-950 font-bold bg-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  {craft.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Spacecraft Visual and Spec Sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: 3D Zero-G Floating Spacecraft Viewer */}
          <div className="lg:col-span-7 relative flex items-center justify-center p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 shadow-[0_10px_50px_rgba(0,0,0,0.7)] overflow-hidden">
            {/* HUD Blueprint Grid Lines */}
            <div className="absolute inset-0 space-grid opacity-20 pointer-events-none" />

            {/* Corner Bracket Accents */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-sky-400/50" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-sky-400/50" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-sky-400/50" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-sky-400/50" />

            <div className="w-full relative z-10">
              <DynamicSpacecraftViewer spacecraft={selectedCraft} />
            </div>

            {/* Vessel HUD Coordinates Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-slate-400 pointer-events-none">
              <span>HULL INTEGRITY: 100%</span>
              <span className="text-sky-400 font-semibold">
                INTERACTIVE 3D // ROTATE & TILT
              </span>
              <span>ATTITUDE: STABILIZED</span>
            </div>
          </div>

          {/* Right Column: Aerospace Spec Sheet & Systems */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCraft.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <HudBadge variant="cyan">{selectedCraft.status}</HudBadge>
                    <span className="font-mono text-xs text-slate-400">
                      {selectedCraft.classification}
                    </span>
                  </div>
                  <h3 className="font-orbitron text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {selectedCraft.name}
                  </h3>
                  <p className="font-space text-sky-400 text-sm font-medium mt-1">
                    {selectedCraft.role}
                  </p>
                </div>

                <p className="font-space text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                  {selectedCraft.summary}
                </p>

                {/* Technical Specifications Grid */}
                <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 space-y-2.5">
                  <span className="font-mono text-xs uppercase tracking-widest text-slate-400 block pb-1 border-b border-slate-800">
                    AEROSPACE FLIGHT SPECIFICATIONS
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">
                        PROPULSION
                      </span>
                      <span className="text-slate-200 font-medium truncate block">
                        {selectedCraft.propulsion}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">
                        DELTA-V
                      </span>
                      <span className="text-emerald-400 font-semibold block">
                        {selectedCraft.deltaV}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">
                        CREW CAPACITY
                      </span>
                      <span className="text-slate-200 font-medium block">
                        {selectedCraft.crew}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">
                        OPERATIONAL RANGE
                      </span>
                      <span className="text-sky-400 font-semibold block">
                        {selectedCraft.range}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Core Engineering Features */}
                <div className="space-y-2">
                  <span className="font-orbitron text-xs tracking-wider text-slate-400 uppercase block">
                    INNOVATION HIGHLIGHTS
                  </span>
                  {selectedCraft.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 text-xs text-slate-300"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
