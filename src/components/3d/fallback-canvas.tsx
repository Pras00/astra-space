"use client";

interface FallbackCanvasProps {
  readonly planetName?: string;
  readonly accentColor?: string;
}

export function FallbackCanvas({
  planetName = "EARTH",
  accentColor = "#ff3b1d",
}: FallbackCanvasProps) {
  return (
    <div className="relative w-full h-44 sm:h-60 lg:h-96 flex items-center justify-center pointer-events-none select-none">
      {/* Architectural Target Reticle */}
      <div className="absolute w-36 sm:w-52 lg:w-72 h-36 sm:h-52 lg:h-72 rounded-full border border-hairline-strong border-dashed" />
      <div className="absolute w-44 sm:w-64 lg:w-84 h-px bg-hairline" />
      <div className="absolute h-44 sm:h-64 lg:h-84 w-px bg-hairline" />

      {/* Optical Sphere Simulation */}
      <div
        className="relative w-32 sm:w-44 lg:w-64 h-32 sm:h-44 lg:h-64 rounded-full overflow-hidden border border-hairline-strong"
        style={{
          background: `radial-gradient(circle at 32% 28%, ${accentColor} 0%, #161820 48%, #060608 82%)`,
        }}
      >
        <div className="absolute inset-0 blueprint-dots opacity-35" />
        <div className="absolute bottom-3 sm:bottom-6 inset-x-0 text-center font-mono text-3xs tracking-widest text-bone/60 uppercase">
          {planetName} — TELEMETRY MODEL
        </div>
      </div>
    </div>
  );
}
