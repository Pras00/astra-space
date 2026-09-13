import { HERO_METRICS } from "@/lib/constants";

export function TelemetryRibbon() {
  return (
    <div className="w-full border-y border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-3.5 px-4 overflow-x-auto select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 min-w-[680px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span className="font-mono text-xs text-sky-300 font-semibold tracking-widest uppercase">
            LIVE ORBITAL FEED
          </span>
        </div>

        <div className="flex items-center gap-8 divide-x divide-slate-800">
          {HERO_METRICS.map((metric) => (
            <div key={metric.label} className="pl-8 first:pl-0 flex items-center gap-3">
              <span className="font-mono text-[11px] text-slate-400 tracking-wider">
                {metric.label}:
              </span>
              <span className="font-orbitron text-xs font-semibold text-white tracking-wider">
                {metric.value}
              </span>
            </div>
          ))}
        </div>

        <div className="font-mono text-[11px] text-slate-400 tracking-wider">
          FREQ: 8.4 GHz X-BAND
        </div>
      </div>
    </div>
  );
}
