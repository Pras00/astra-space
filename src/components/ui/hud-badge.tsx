import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HudBadgeProps {
  children: ReactNode;
  variant?: "cyan" | "emerald" | "amber" | "slate" | "violet";
  pulse?: boolean;
  className?: string;
}

export function HudBadge({
  children,
  variant = "cyan",
  pulse = false,
  className,
}: HudBadgeProps) {
  const variantStyles = {
    cyan: "border-sky-500/30 text-sky-300 bg-sky-950/40",
    emerald: "border-emerald-500/30 text-emerald-300 bg-emerald-950/40",
    amber: "border-amber-500/30 text-amber-300 bg-amber-950/40",
    slate: "border-slate-700/60 text-slate-300 bg-slate-900/60",
    violet: "border-indigo-500/30 text-indigo-300 bg-indigo-950/40",
  };

  const dotStyles = {
    cyan: "bg-sky-400",
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    slate: "bg-slate-400",
    violet: "bg-indigo-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-mono uppercase tracking-widest border backdrop-blur-md select-none",
        variantStyles[variant],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              dotStyles[variant]
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-1.5 w-1.5",
              dotStyles[variant]
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}
