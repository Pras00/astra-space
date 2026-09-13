"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Zap,
  Shield,
  Radio,
  Activity,
  Crosshair,
} from "lucide-react";
import { TECHNOLOGIES, TechnologyItem } from "@/data/technologies";
import { SectionHeading } from "@/components/ui/section-heading";
import { HudBadge } from "@/components/ui/hud-badge";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function TechnologyExplorer() {
  const [selectedTechId, setSelectedTechId] = useState<string>("propulsion");
  const selectedTech =
    TECHNOLOGIES.find((t) => t.id === selectedTechId) || TECHNOLOGIES[0];
  const reducedMotion = useReducedMotion();

  const getCategoryIcon = (cat: TechnologyItem["category"]) => {
    switch (cat) {
      case "PROPULSION":
        return <Zap className="w-4 h-4 text-sky-400" />;
      case "AVIONICS":
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      case "DEFENSE":
        return <Shield className="w-4 h-4 text-indigo-400" />;
      case "TELEMETRY":
        return <Radio className="w-4 h-4 text-amber-400" />;
      case "LIFE SUPPORT":
        return <Activity className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <section
      id="technology"
      className="relative py-28 sm:py-36 border-b border-slate-900 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[650px] h-[500px] bg-sky-950/20 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          tag="AEROSPACE SYSTEMS // SECTION 05"
          title="ENGINEERED FOR THE IMPOSSIBLE"
          subtitle="Interactive engineering schematic. Select any subsystem hotspot to inspect aerospace telemetry and specifications."
        />

        {/* Tactical Subsystem Selector Bar */}
        <div className="flex items-center gap-2 mt-12 mb-8 overflow-x-auto pb-2 select-none">
          {TECHNOLOGIES.map((tech) => {
            const isActive = tech.id === selectedTechId;
            return (
              <button
                key={tech.id}
                onClick={() => setSelectedTechId(tech.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-md font-mono text-xs whitespace-nowrap border transition-all duration-200 ${
                  isActive
                    ? "bg-sky-950/70 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                    : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                {getCategoryIcon(tech.category)}
                <span className="font-semibold">{tech.tag}</span>
                <span className="hidden sm:inline text-[11px] text-slate-400 truncate max-w-[120px]">
                  {tech.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Blueprint & Specification Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Blueprint Canvas */}
          <div className="lg:col-span-7 relative p-6 sm:p-8 rounded-xl border border-slate-800/80 bg-slate-950/80 shadow-[0_15px_50px_rgba(0,0,0,0.8)] min-h-[420px] sm:min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* Engineering Grid & Radar Scanlines */}
            <div className="absolute inset-0 space-grid opacity-25 pointer-events-none" />

            {/* Corner Tactical Marks */}
            <div className="absolute top-3 left-3 flex items-center gap-2 font-mono text-[10px] text-slate-400">
              <Crosshair className="w-3.5 h-3.5 text-sky-400" />
              <span>SCHEMATIC: ASTRA-MK4-AVX</span>
            </div>

            <div className="absolute top-3 right-3 font-mono text-[10px] text-slate-400">
              SCALE 1:50 // SEC 04
            </div>

            {/* Futuristic Vector Blueprint Wireframe of Spacecraft */}
            <div className="relative w-full max-w-xl aspect-[16/10]">
              <svg
                viewBox="0 0 800 500"
                className="w-full h-full text-slate-700"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Center Hull Guideline */}
                <line
                  x1="60"
                  y1="250"
                  x2="740"
                  y2="250"
                  stroke="rgba(56, 189, 248, 0.25)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Aerodynamic Forward Bow */}
                <path
                  d="M 60,250 L 160,200 L 260,200 L 300,160 L 520,160 L 580,210 L 720,225 L 720,275 L 580,290 L 520,340 L 300,340 L 260,300 L 160,300 Z"
                  stroke="rgba(148, 163, 184, 0.4)"
                  strokeWidth="2"
                  fill="rgba(8, 15, 30, 0.6)"
                />

                {/* Cockpit / Sensor Dome */}
                <path
                  d="M 120,230 L 180,215 L 230,225 L 200,250 Z"
                  stroke="rgba(56, 189, 248, 0.7)"
                  strokeWidth="1.5"
                  fill="rgba(56, 189, 248, 0.15)"
                />

                {/* Toroidal Magnetic Ring / Life Support Spoke */}
                <ellipse
                  cx="400"
                  cy="250"
                  rx="60"
                  ry="130"
                  stroke="rgba(129, 140, 248, 0.6)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />

                {/* Propulsion Thruster Nozzles */}
                <rect
                  x="680"
                  y="235"
                  width="50"
                  height="30"
                  stroke="rgba(56, 189, 248, 0.8)"
                  strokeWidth="2"
                  fill="rgba(56, 189, 248, 0.2)"
                />
                <line
                  x1="730"
                  y1="250"
                  x2="770"
                  y2="250"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />

                {/* Structural ribs */}
                <line x1="300" y1="160" x2="300" y2="340" stroke="rgba(148,163,184,0.2)" strokeWidth="1" />
                <line x1="520" y1="160" x2="520" y2="340" stroke="rgba(148,163,184,0.2)" strokeWidth="1" />

                {/* Dynamic SVG Leader Line from Hotspot to Edge */}
                <circle
                  cx={(selectedTech.hotspotX / 100) * 800}
                  cy={(selectedTech.hotspotY / 100) * 500}
                  r="14"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  className="animate-[spin_8s_linear_infinite]"
                />
              </svg>

              {/* Clickable Interactive Hotspot Nodes */}
              {TECHNOLOGIES.map((tech) => {
                const isActive = tech.id === selectedTechId;
                return (
                  <button
                    key={tech.id}
                    onClick={() => setSelectedTechId(tech.id)}
                    type="button"
                    aria-label={`Inspect ${tech.title}`}
                    style={{
                      left: `${tech.hotspotX}%`,
                      top: `${tech.hotspotY}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group p-1.5 rounded-full transition-transform duration-300 select-none ${
                      isActive ? "scale-125" : "hover:scale-110"
                    }`}
                  >
                    <span className="relative flex h-5 w-5 items-center justify-center">
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isActive
                            ? "animate-ping bg-sky-400"
                            : "bg-slate-500 group-hover:bg-sky-400"
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-3 w-3 border-2 ${
                          isActive
                            ? "bg-sky-400 border-white shadow-[0_0_12px_#38bdf8]"
                            : "bg-slate-900 border-slate-400 group-hover:border-sky-300"
                        }`}
                      />
                    </span>

                    {/* Hotspot Floating Tag */}
                    <span
                      className={`absolute top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider whitespace-nowrap pointer-events-none transition-opacity duration-200 border ${
                        isActive
                          ? "bg-sky-950 border-sky-400 text-white opacity-100 shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                          : "bg-slate-900/90 border-slate-700 text-slate-400 opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {tech.tag} {"//"} {tech.title.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Blueprint HUD Telemetry */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-900 pt-2 pointer-events-none">
              <span>ACTIVE SYSTEM: {selectedTech.tag}</span>
              <span className="text-sky-400">{selectedTech.efficiency}</span>
              <span className="hidden sm:inline">CAD REV 8.04</span>
            </div>
          </div>

          {/* Right Column: Aerospace Spec Breakdown Panel */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTech.id}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="glass-panel p-6 sm:p-8 rounded-xl border border-slate-800 space-y-6 shadow-xl"
              >
                {/* Header & Classification */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <HudBadge variant="cyan" pulse>
                      {selectedTech.readinessLevel}
                    </HudBadge>
                    <span className="font-mono text-xs text-sky-400 font-semibold">
                      {selectedTech.category}
                    </span>
                  </div>

                  <h3 className="font-orbitron text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {selectedTech.title}
                  </h3>
                  <p className="font-space text-sky-300 text-sm font-medium mt-1">
                    {selectedTech.headline}
                  </p>
                </div>

                {/* Detailed Engineering Narrative */}
                <p className="text-slate-300 text-sm leading-relaxed font-light">
                  {selectedTech.description}
                </p>

                {/* Subsystem Specifications List */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="font-mono text-xs uppercase tracking-widest text-slate-400 block mb-3">
                    SUBSYSTEM TELEMETRY BENCHMARKS
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedTech.keySpecs.map((spec, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded bg-slate-900/60 border border-slate-800"
                      >
                        <span className="text-slate-400 text-[10px] font-mono block">
                          {spec.label}
                        </span>
                        <span className="text-slate-100 font-mono text-xs font-semibold">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engineering Breakthrough Callout */}
                <div className="p-4 rounded-lg bg-sky-950/40 border border-sky-500/30 text-xs">
                  <span className="font-orbitron font-bold text-sky-300 block mb-1 uppercase">
                    STRATEGIC BREAKTHROUGH
                  </span>
                  <p className="text-slate-300 leading-relaxed font-light">
                    {selectedTech.breakthrough}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
