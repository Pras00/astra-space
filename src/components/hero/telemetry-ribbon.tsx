import { HERO_METRICS } from "@/lib/constants";

export function TelemetryRibbon() {
  return (
    <div className="w-full border-t border-hairline bg-obsidian/90 backdrop-blur-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 divide-hairline divide-x border-b sm:border-b-0">
        {HERO_METRICS.map((metric, idx) => (
          <div
            key={metric.label}
            className={`py-3 sm:py-4 px-3 sm:px-5 flex flex-col justify-between gap-1 ${
              idx >= 2 ? "border-t sm:border-t-0 border-hairline" : ""
            }`}
          >
            <span className="font-mono text-3xs text-ash uppercase tracking-widest">
              {metric.label}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-lg sm:text-xl font-bold text-bone tabular-nums tracking-tight">
                {metric.value}
              </span>
              <span className="font-mono text-3xs text-signal font-semibold uppercase tracking-widest">
                {metric.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
