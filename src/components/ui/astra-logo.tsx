import { useId } from "react";
import { cn } from "@/lib/utils";

interface AstraLogoProps {
  readonly size?: number;
  readonly className?: string;
  readonly showWordmark?: boolean;
}

export function AstraLogo({
  size = 34,
  className,
  showWordmark = false,
}: AstraLogoProps) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const clipId = `astra-clip-${id}`;

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      {/* Precision Brutalist Aerospace Vector Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={clipId}>
            <rect width="100" height="100" />
          </clipPath>
        </defs>

        <g clipPath={`url(#${clipId})`}>
          {/* Architectural Outer Frame */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            stroke="#F4F4F0"
            strokeOpacity="0.22"
            strokeWidth="2"
          />

          {/* Corner Crosshairs */}
          <path d="M4 16V4H16" stroke="#F4F4F0" strokeWidth="2.5" />
          <path d="M84 96H96V84" stroke="#F4F4F0" strokeWidth="2.5" />

          {/* Delta Wing Monolith ('A') */}
          <path
            d="M50 16L21 82H35.5L50 46.5L64.5 82H79L50 16Z"
            fill="#F4F4F0"
          />

          {/* International Aerospace Signal Trajectory Slash */}
          <path
            d="M14 68L86 30"
            stroke="#FF3B1D"
            strokeWidth="4.5"
            strokeLinecap="square"
          />

          {/* Orbital Insertion Node */}
          <rect x="82" y="24" width="8" height="8" fill="#FF3B1D" />
        </g>
      </svg>

      {showWordmark && (
        <div className="flex flex-col">
          <span className="font-display font-bold text-lg tracking-widest text-bone leading-none">
            ASTRA
          </span>
          <span className="font-mono text-3xs text-ash tracking-widest mt-1">
            FLIGHT SYSTEMS
          </span>
        </div>
      )}
    </div>
  );
}
