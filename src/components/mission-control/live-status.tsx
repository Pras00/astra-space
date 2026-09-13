"use client";

import { useEffect, useState } from "react";
import {
  Radio,
  Gauge,
  Activity,
  Compass,
  Cpu,
} from "lucide-react";
import { ACTIVE_PROBE_TELEMETRY } from "@/data/telemetry";
import { SectionHeading } from "@/components/ui/section-heading";
import { HudBadge } from "@/components/ui/hud-badge";
import { MissionCountdown } from "./countdown";

function formatKm(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function LiveStatus() {
  // Live flight distance increment ticker (simulates traveling 28.4 km/s in real time)
  const [distance, setDistance] = useState<number>(
    ACTIVE_PROBE_TELEMETRY.distanceKm
  );
  const [telemetryTimer, setTelemetryTimer] = useState<number>(261); // 4m 21s in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setDistance((prev) => prev + Math.floor(28.4 * 1.5));
      setTelemetryTimer((prev) => (prev <= 1 ? 300 : prev - 1));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const formatSecondsToMMSS = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `00:${m}:${s}`;
  };

  return (
    <section
      id="mission-control"
      className="relative py-28 sm:py-36 border-b border-slate-900 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-950/15 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          tag="REAL-TIME TELEMETRY // SECTION 06"
          title="MISSION CONTROL"
          subtitle="Live downlink telemetry from deep-space exploratory probes cruising through outer solar system flight corridors."
        />

        {/* Live HUD Telemetry Dashboard */}
        <div className="mt-12 mb-12 glass-panel rounded-xl p-6 sm:p-10 border border-slate-800/90 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Subtle Scanlines overlay */}
          <div className="absolute inset-0 scanlines opacity-15 pointer-events-none" />

          {/* Top Mission Control Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-orbitron font-extrabold text-xl sm:text-2xl text-white tracking-wider">
                    {ACTIVE_PROBE_TELEMETRY.missionId} {"//"} {ACTIVE_PROBE_TELEMETRY.vehicleName}
                  </h3>
                  <HudBadge variant="emerald" pulse>
                    {ACTIVE_PROBE_TELEMETRY.missionStatus}
                  </HudBadge>
                </div>
                <span className="font-mono text-xs text-sky-400 font-medium">
                  FLIGHT VECTOR: {ACTIVE_PROBE_TELEMETRY.targetDestination}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800">
                {ACTIVE_PROBE_TELEMETRY.epochTimestamp}
              </span>
              <span className="hidden md:inline px-3 py-1.5 rounded bg-slate-900 border border-slate-800">
                SUN DIST: {ACTIVE_PROBE_TELEMETRY.coordinates.sunDistanceAu}
              </span>
            </div>
          </div>

          {/* Core Telemetry 4-Stat Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-8">
            {/* Real-time Distance */}
            <div className="p-5 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-sky-400" />
                  DISTANCE FROM EARTH
                </span>
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              </div>
              <div
                suppressHydrationWarning
                className="font-orbitron text-2xl sm:text-3xl font-black text-white tracking-tight"
              >
                {formatKm(distance)}
              </div>
              <span className="font-mono text-[11px] text-sky-400 mt-1 block">
                KILOMETERS (LIVE TICK)
              </span>
            </div>

            {/* Velocity */}
            <div className="p-5 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-emerald-400" />
                  HELIOCENTRIC VELOCITY
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="font-orbitron text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                {ACTIVE_PROBE_TELEMETRY.velocityKmS}
              </div>
              <span className="font-mono text-[11px] text-slate-400 mt-1 block">
                KM/S // ESCAPE SPEED
              </span>
            </div>

            {/* Signal Strength */}
            <div className="p-5 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-sky-400" />
                  OPTICAL DSOC SIGNAL
                </span>
                <span className="w-2 h-2 rounded-full bg-sky-400" />
              </div>
              <div className="font-orbitron text-2xl sm:text-3xl font-black text-white tracking-tight">
                {ACTIVE_PROBE_TELEMETRY.signalStrength}%
              </div>
              <span className="font-mono text-[11px] text-sky-400 mt-1 block">
                QUANTUM ENCRYPTED
              </span>
            </div>

            {/* Next Telemetry Interval */}
            <div className="p-5 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-400" />
                  NEXT TELEMETRY BURST
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              </div>
              <div
                suppressHydrationWarning
                className="font-orbitron text-2xl sm:text-3xl font-black text-amber-300 tracking-tight font-mono"
              >
                {formatSecondsToMMSS(telemetryTimer)}
              </div>
              <span className="font-mono text-[11px] text-slate-400 mt-1 block">
                CARRIER INTERVAL T-MINUS
              </span>
            </div>
          </div>

          {/* Subsystems Avionics Bus Telemetry Grid */}
          <div className="pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-4">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-400" />
                CRITICAL SUBSYSTEMS HEALTH MONITOR (ALL SYSTEMS GREEN)
              </span>
              <span>BUS VOLTAGE: 124.8 V NOMINAL</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {ACTIVE_PROBE_TELEMETRY.subsystems.map((sub) => (
                <div
                  key={sub.name}
                  className="p-3 rounded bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <span className="text-[10px] font-mono text-slate-400 block truncate mb-1">
                    {sub.name}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-200">
                      {sub.status}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[9px] font-mono text-sky-400 block mt-1 truncate">
                    {sub.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Launch Countdown Component */}
        <MissionCountdown />
      </div>
    </section>
  );
}
