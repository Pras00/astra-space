"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { MISSIONS, MissionNode } from "@/data/missions";
import { SectionHeading } from "@/components/ui/section-heading";
import { HudBadge } from "@/components/ui/hud-badge";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function MissionTimeline() {
  const [activeMissionIndex, setActiveMissionIndex] = useState<number>(0);
  const activeMission = MISSIONS[activeMissionIndex];
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="missions"
      className="relative py-28 sm:py-36 border-b border-slate-900 overflow-hidden"
    >
      {/* Background Orbital Ambience */}
      <div className="absolute top-1/3 -right-[15%] w-[600px] h-[500px] bg-indigo-900/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          tag="FLIGHT TRAJECTORY // SECTION 03"
          title="MISSION TIMELINE"
          subtitle="Humanity's multi-decade roadmap from cislunar propellant harvesting to interstellar precursor voyages."
        />

        {/* Trajectory Flight Path Navigation Bar */}
        <div className="mt-14 mb-12">
          {/* Orbital Curvature Connecting Track */}
          <div className="relative">
            {/* Background dashed flight line */}
            <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-slate-800 hidden md:block" />

            {/* Glowing progress line connecting to active index */}
            <div
              className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500 hidden md:block shadow-[0_0_12px_rgba(56,189,248,0.5)]"
              style={{
                width: `${(activeMissionIndex / (MISSIONS.length - 1)) * 100}%`,
              }}
            />

            {/* Trajectory Nodes Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              {MISSIONS.map((mission, idx) => {
                const isActive = idx === activeMissionIndex;
                const isPast = idx < activeMissionIndex;

                return (
                  <button
                    key={mission.code}
                    onClick={() => setActiveMissionIndex(idx)}
                    type="button"
                    className={`text-left p-4 sm:p-5 rounded-lg border transition-all duration-300 relative group select-none ${
                      isActive
                        ? "bg-slate-900/90 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.2)]"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40"
                    }`}
                  >
                    {/* Node Dot for Desktop */}
                    <div className="hidden md:flex absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full items-center justify-center bg-slate-950 border-2 transition-colors duration-300">
                      <div
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          isActive
                            ? "bg-sky-400 scale-125 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                            : isPast
                            ? "bg-sky-600"
                            : "bg-slate-700"
                        }`}
                      />
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="font-orbitron font-bold text-xl sm:text-2xl text-white">
                        {mission.year}
                      </span>
                      <span className="font-mono text-[10px] text-sky-400 font-semibold px-2 py-0.5 rounded bg-sky-950/60 border border-sky-500/20">
                        {mission.code}
                      </span>
                    </div>

                    <h4 className="font-orbitron text-xs font-semibold tracking-wider text-slate-300 group-hover:text-white uppercase truncate">
                      {mission.title}
                    </h4>

                    <span className="block font-mono text-[10px] text-slate-500 mt-1 uppercase">
                      TARGET: {mission.target}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Mission Trajectory Details Canvas Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMission.code}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="glass-panel rounded-xl p-6 sm:p-10 border border-slate-800/80 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Mission Narrative & Milestones */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <HudBadge
                      variant={
                        activeMission.status === "CURRENT FLIGHT"
                          ? "emerald"
                          : activeMission.status === "PLANNED"
                          ? "cyan"
                          : "violet"
                      }
                      pulse
                    >
                      {activeMission.status}
                    </HudBadge>
                    <span className="font-mono text-xs text-slate-400">
                      PHASE {activeMission.phase} OF 4
                    </span>
                  </div>

                  <h3 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                    {activeMission.title}
                  </h3>
                  <p className="font-mono text-sm text-sky-400 font-medium mt-1">
                    DESTINATION: {activeMission.target}
                  </p>
                </div>

                <p className="font-space text-slate-300 text-base sm:text-lg leading-relaxed font-light">
                  {activeMission.description}
                </p>

                {/* Key Flight Milestones */}
                <div>
                  <h4 className="font-orbitron text-xs tracking-widest text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <Rocket className="w-3.5 h-3.5 text-sky-400" />
                    CORE MISSION FLIGHT MILESTONES
                  </h4>
                  <div className="space-y-2.5">
                    {activeMission.milestones.map((milestone, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded bg-slate-900/50 border border-slate-800/80 text-sm text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                        <span>{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Aerospace Flight Metrics */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-slate-400 block pb-2 border-b border-slate-800">
                    ASTRODYNAMICS PARAMETERS
                  </span>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-4 h-4 text-sky-400" />
                      <span>MISSION DURATION</span>
                    </div>
                    <span className="font-orbitron font-semibold text-white">
                      {activeMission.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users className="w-4 h-4 text-sky-400" />
                      <span>CREW CONFIGURATION</span>
                    </div>
                    <span className="font-orbitron font-semibold text-white">
                      {activeMission.crew}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>ORBITAL DELTA-V BUDGET</span>
                    </div>
                    <span className="font-orbitron font-semibold text-emerald-400">
                      {activeMission.trajectoryDeltaV}
                    </span>
                  </div>
                </div>

                {/* Trajectory Graphic Homage */}
                <div className="p-4 rounded-lg border border-slate-800/80 bg-slate-950/80 relative overflow-hidden">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                    <span>TRANSMISSION CARRIER: S-BAND</span>
                    <span className="text-emerald-400">STATUS: VERIFIED</span>
                  </div>
                  <div className="h-20 w-full relative flex items-center justify-center">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 300 80"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M 10,70 Q 150,10 290,40"
                        stroke="rgba(56, 189, 248, 0.4)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                      <circle cx="10" cy="70" r="4" fill="#94a3b8" />
                      <circle cx="290" cy="40" r="5" fill="#38bdf8" />
                      <circle cx="290" cy="40" r="10" stroke="#38bdf8" strokeWidth="1" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>EARTH ORBIT INSERTION</span>
                    <span>TARGET PERIAPSIS</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
