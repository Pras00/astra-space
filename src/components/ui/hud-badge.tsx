import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type HudBadgeVariant = "signal" | "neutral" | "solid";

interface HudBadgeProps {
  readonly children: ReactNode;
  readonly variant?: HudBadgeVariant;
  readonly pulse?: boolean;
  readonly className?: string;
}

export function HudBadge({
  children,
  variant = "neutral",
  pulse = false,
  className,
}: HudBadgeProps) {
  const variantStyles: Record<HudBadgeVariant, string> = {
    signal: "border-signal/50 text-signal bg-signal-muted",
    neutral: "border-hairline-strong text-titanium bg-carbon",
    solid: "border-signal bg-signal text-bone font-semibold",
  };

  const dotStyles: Record<HudBadgeVariant, string> = {
    signal: "bg-signal",
    neutral: "bg-bone",
    solid: "bg-bone",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-none text-3xs font-mono uppercase tracking-widest border select-none",
        variantStyles[variant],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full opacity-75",
              dotStyles[variant]
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-1.5 w-1.5",
              dotStyles[variant]
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}
