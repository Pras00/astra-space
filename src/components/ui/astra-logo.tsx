import React, { useId } from "react";

interface AstraLogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
}

export function AstraLogo({
  size = 36,
  className = "",
  showWordmark = false,
}: AstraLogoProps) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const chevronGradId = `astra-chevron-${id}`;
  const orbitGradId = `astra-orbit-${id}`;
  const glowFilterId = `astra-glow-${id}`;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Precision Aerospace Vector Insignia */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle Starlight Gradient */}
          <linearGradient id={chevronGradId} x1="50" y1="14" x2="50" y2="84" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Electric Cyan Orbital Beam Gradient */}
          <linearGradient id={orbitGradId} x1="12" y1="64" x2="88" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#7DD3FC" />
          </linearGradient>

          {/* Core Glow Filter */}
          <filter id={glowFilterId} x="0" y="0" width="100" height="100" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Outer Halo */}
        <circle cx="50" cy="50" r="44" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="3 5" />

        {/* Dynamic Orbital Trajectory Arc */}
        <path
          d="M 14,64 C 20,44 65,30 88,32"
          stroke={`url(#${orbitGradId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
          filter={`url(#${glowFilterId})`}
        />

        {/* Ascending Chevron / Delta Wing (The 'A') */}
        <path
          d="M 50,16 L 24,80 L 37,74 L 50,44 L 63,74 L 76,80 Z"
          fill={`url(#${chevronGradId})`}
        />

        {/* Inner Thrust Keel Notch */}
        <path
          d="M 50,47 L 39,73 L 50,65 L 61,73 Z"
          fill="#030712"
        />

        {/* Trans-orbital Beacon Node (Celestial Body / Satellite) */}
        <circle cx="86" cy="32" r="4.5" fill="#38BDF8" filter={`url(#${glowFilterId})`} />
        <circle cx="86" cy="32" r="2" fill="#FFFFFF" />
      </svg>

      {/* Optional Wordmark */}
      {showWordmark && (
        <div className="flex flex-col">
          <span className="font-orbitron font-bold text-lg tracking-[0.25em] text-white leading-none">
            ASTRA
          </span>
          <span className="font-mono text-[9px] text-slate-400 tracking-wider mt-0.5">
            EXPLORATION SYSTEMS
          </span>
        </div>
      )}
    </div>
  );
}
