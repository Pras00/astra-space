"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { HudBadge } from "@/components/ui/hud-badge";

const LAUNCH_TARGET_TIMESTAMP = new Date("2028-04-18T14:00:00Z").getTime();

export function MissionCountdown() {
  const { days, hours, minutes, seconds, mounted } = useCountdown(
    LAUNCH_TARGET_TIMESTAMP
  );

  const timeBlocks = [
    { label: "DAYS", value: mounted ? days : "529" },
    { label: "HOURS", value: mounted ? hours : "11" },
    { label: "MINUTES", value: mounted ? minutes : "04" },
    { label: "SECONDS", value: mounted ? seconds : "18" },
  ] as const;

  return (
    <div className="border border-hairline bg-carbon p-6 sm:p-8 hud-frame">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-display font-bold text-xl uppercase tracking-tight text-bone">
              Next Translunar Injection Window
            </h3>
            <HudBadge variant="signal" pulse>
              T-MINUS
            </HudBadge>
          </div>
          <span className="font-mono text-3xs text-ash uppercase tracking-widest block mt-1">
            FLIGHT ASTRA-L1 // SHACKLETON FOUNDRY CARGO DEPLOYMENT
          </span>
        </div>

        <div className="font-mono text-2xs text-titanium uppercase tracking-widest">
          PAD 39-OMEGA // 28.5721° N
        </div>
      </div>

      {/* Tabular Countdown Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border border-hairline divide-x divide-y sm:divide-y-0 divide-hairline my-6 bg-obsidian">
        {timeBlocks.map((block) => (
          <div
            key={block.label}
            className="flex flex-col items-start justify-between p-5 sm:p-6"
          >
            <span className="font-mono text-3xs uppercase tracking-widest text-ash">
              {block.label}
            </span>
            <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-bone tabular-nums mt-3">
              {block.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-hairline font-mono text-3xs text-ash uppercase tracking-widest">
        <span className="flex items-center gap-2 text-titanium">
          <span className="w-1.5 h-1.5 bg-signal inline-block" />
          <span>FLIGHT TERMINATION &amp; AVIONICS BUS: ARMED</span>
        </span>
        <span>LOX / LCH4 DENSIFICATION: STANDBY</span>
      </div>
    </div>
  );
}
