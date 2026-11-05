"use client";

import { useEffect, useState } from "react";
import { ACTIVE_PROBE_TELEMETRY } from "@/data/telemetry";
import { SectionHeading } from "@/components/ui/section-heading";
import { HudBadge } from "@/components/ui/hud-badge";
import { MissionCountdown } from "./countdown";

function formatKm(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function LiveStatus() {
  const [distance, setDistance] = useState<number>(
    ACTIVE_PROBE_TELEMETRY.distanceKm
  );
  const [telemetryTimer, setTelemetryTimer] = useState<number>(261);

  useEffect(() => {
    const interval = setInterval(() => {
      setDistance((prev) => prev + Math.floor(28.4 * 1.5));
      setTelemetryTimer((prev) => (prev <= 1 ? 300 : prev - 1));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const formatSecondsToMMSS = (sec: number): string => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `00:${m}:${s}`;
  };

  return (
    <section
      id="mission-control"
      className="relative py-24 sm:py-32 border-b border-hairline bg-obsidian"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <SectionHeading
          index="05"
          tag="DEEP SPACE NETWORK // LIVE OPTICAL DOWNLINK"
          title="FLIGHT TELEMETRY"
          subtitle="Continuous 1550nm laser telemetry from deep-space survey vehicles operating across outer-system transfer trajectories."
        />

        {/* Hawthorne-Grade Telemetry Matrix */}
        <div className="border border-hairline-strong bg-carbon p-6 sm:p-8 relative overflow-hidden hud-frame">
          <div className="absolute inset-0 scanlines opacity-15 pointer-events-none" />

          {/* Vehicle Identification Header */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-hairline">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display font-bold text-xl sm:text-2xl text-bone uppercase tracking-tight">
                  {ACTIVE_PROBE_TELEMETRY.missionId} —{" "}
                  {ACTIVE_PROBE_TELEMETRY.vehicleName}
                </h3>
                <HudBadge variant="signal" pulse>
                  {ACTIVE_PROBE_TELEMETRY.missionStatus}
                </HudBadge>
              </div>
              <span className="font-mono text-2xs text-ash uppercase tracking-widest block mt-1">
                VECTOR: {ACTIVE_PROBE_TELEMETRY.targetDestination}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-3xs text-titanium uppercase tracking-widest tabular-nums">
              <span className="px-3 py-1.5 bg-obsidian border border-hairline">
                {ACTIVE_PROBE_TELEMETRY.epochTimestamp}
              </span>
              <span className="px-3 py-1.5 bg-obsidian border border-hairline">
                HELIOCENTRIC: {ACTIVE_PROBE_TELEMETRY.coordinates.sunDistanceAu}
              </span>
            </div>
          </div>

          {/* 4-Column Live Metric Strip */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-hairline divide-y sm:divide-y-0 sm:divide-x divide-hairline my-6 bg-obsidian font-mono">
            <div className="p-5">
              <span className="text-3xs text-ash uppercase tracking-widest block mb-2">
                EARTH RANGE
              </span>
              <span className="text-xl sm:text-2xl font-bold text-bone tabular-nums block">
                {formatKm(distance)}
              </span>
              <span className="text-3xs text-signal uppercase tracking-widest mt-1 block">
                KILOMETERS (+28.4 KM/S)
              </span>
            </div>

            <div className="p-5">
              <span className="text-3xs text-ash uppercase tracking-widest block mb-2">
                CRUISE VELOCITY
              </span>
              <span className="text-xl sm:text-2xl font-bold text-bone tabular-nums block">
                {ACTIVE_PROBE_TELEMETRY.velocityKmS} KM/S
              </span>
              <span className="text-3xs text-ash uppercase tracking-widest mt-1 block">
                SOLAR RELATIVE
              </span>
            </div>

            <div className="p-5">
              <span className="text-3xs text-ash uppercase tracking-widest block mb-2">
                DSOC CARRIER GAIN
              </span>
              <span className="text-xl sm:text-2xl font-bold text-bone tabular-nums block">
                {ACTIVE_PROBE_TELEMETRY.signalStrength}%
              </span>
              <span className="text-3xs text-ash uppercase tracking-widest mt-1 block">
                LIGHT-TIME DELAY {formatSecondsToMMSS(telemetryTimer)}
              </span>
            </div>

            <div className="p-5">
              <span className="text-3xs text-ash uppercase tracking-widest block mb-2">
                CELESTIAL FIX (J2000)
              </span>
              <span className="text-sm font-bold text-bone tabular-nums block">
                RA {ACTIVE_PROBE_TELEMETRY.coordinates.ra}
              </span>
              <span className="text-xs text-titanium tabular-nums mt-1 block">
                DEC {ACTIVE_PROBE_TELEMETRY.coordinates.dec}
              </span>
            </div>
          </div>

          {/* 6-Cell Avionics Bus Health */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between font-mono text-3xs text-ash uppercase tracking-widest">
              <span>ONBOARD AVIONICS &amp; PROPULSION BUS</span>
              <span className="text-bone">ALL CHANNELS NOMINAL</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 font-mono">
              {ACTIVE_PROBE_TELEMETRY.subsystems.map((sub) => (
                <div
                  key={sub.name}
                  className="px-4 py-3 bg-obsidian border border-hairline flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-2xs text-bone font-medium block">
                      {sub.name}
                    </span>
                    <span className="text-3xs text-ash block mt-0.5">
                      {sub.value}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 border border-signal/40 bg-signal-muted text-signal text-3xs uppercase tracking-widest shrink-0">
                    {sub.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Launch Window Countdown */}
        <MissionCountdown />
      </div>
    </section>
  );
}
