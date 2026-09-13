"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { HudBadge } from "@/components/ui/hud-badge";
import { Calendar, Rocket } from "lucide-react";

export function MissionCountdown() {
  // Target date set 127 days, 4 hours, 32 minutes from a consistent anchor
  // To keep it persistent and realistic, anchor to a future launch target date
  const targetDate = new Date("2028-04-18T14:00:00Z").getTime();
  const { days, hours, minutes, seconds, mounted } = useCountdown(targetDate);

  const timeBlocks = [
    { label: "DAYS", value: mounted ? days : "127" },
    { label: "HOURS", value: mounted ? hours : "04" },
    { label: "MINUTES", value: mounted ? minutes : "32" },
    { label: "SECONDS", value: mounted ? seconds : "18" },
  ];

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-xl border border-slate-800/80 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-950/80 border border-sky-500/30 flex items-center justify-center">
            <Rocket className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-orbitron font-bold text-lg text-white tracking-wider">
                NEXT LAUNCH WINDOW
              </h3>
              <HudBadge variant="emerald" pulse>
                T-MINUS
              </HudBadge>
            </div>
            <span className="font-mono text-xs text-slate-400">
              MISSION ASTRA-L1 // LUNAR GATEWAY TRANSLUNAR INJECTION
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Calendar className="w-4 h-4 text-sky-400" />
          <span>LAUNCH PAD: LC-39A</span>
        </div>
      </div>

      {/* Countdown Digits Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 my-6">
        {timeBlocks.map((block) => (
          <div
            key={block.label}
            className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-lg bg-slate-900/60 border border-slate-800 relative group hover:border-sky-500/40 transition-colors"
          >
            <span className="font-orbitron text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white glow-text-blue">
              {block.value}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-sky-400 mt-2">
              {block.label}
            </span>
          </div>
        ))}
      </div>

      {/* Mission Readiness Status Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>VEHICLE FLIGHT COMPUTER: SYNCHRONIZED</span>
        </div>
        <div className="text-slate-500">
          CRYOGENIC TANK PRESSURIZATION: STANDBY
        </div>
      </div>
    </div>
  );
}
