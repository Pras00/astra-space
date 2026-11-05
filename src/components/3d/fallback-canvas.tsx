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
    <div className="relative w-full h-96 sm:h-112 flex items-center justify-center pointer-events-none select-none">
      {/* Architectural Target Reticle */}
      <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full border border-hairline-strong border-dashed" />
      <div className="absolute w-84 sm:w-112 h-px bg-hairline" />
      <div className="absolute h-84 sm:h-112 w-px bg-hairline" />

      {/* Optical Sphere Simulation */}
      <div
        className="relative w-56 sm:w-72 md:w-80 h-56 sm:h-72 md:w-80 rounded-full overflow-hidden border border-hairline-strong"
        style={{
          background: `radial-gradient(circle at 32% 28%, ${accentColor} 0%, #161820 48%, #060608 82%)`,
        }}
      >
        <div className="absolute inset-0 blueprint-dots opacity-35" />
        <div className="absolute bottom-6 inset-x-0 text-center font-mono text-3xs tracking-widest text-bone/60 uppercase">
          {planetName} — TELEMETRY MODEL
        </div>
      </div>
    </div>
  );
}
