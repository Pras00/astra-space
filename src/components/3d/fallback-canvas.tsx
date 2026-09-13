"use client";

interface FallbackCanvasProps {
  planetName?: string;
  accentColor?: string;
  glowColor?: string;
}

export function FallbackCanvas({
  planetName = "Earth",
  accentColor = "#38bdf8",
  glowColor = "rgba(56, 189, 248, 0.4)",
}: FallbackCanvasProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
      {/* Outer Atmospheric Halo */}
      <div
        className="absolute w-[280px] sm:w-[420px] md:w-[520px] h-[280px] sm:h-[420px] md:h-[520px] rounded-full blur-[80px] opacity-40 transition-all duration-700"
        style={{ backgroundColor: glowColor }}
      />

      {/* Orbital Ring Vector */}
      <div className="absolute w-[340px] sm:w-[500px] md:w-[620px] h-[340px] sm:h-[500px] md:h-[620px] rounded-full border border-sky-500/20 border-dashed animate-[spin_120s_linear_infinite]" />

      {/* Celestial Sphere SVG */}
      <div
        className="relative w-[220px] sm:w-[320px] md:w-[400px] h-[220px] sm:h-[320px] md:h-[400px] rounded-full shadow-[inset_-30px_-30px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(56,189,248,0.2)] overflow-hidden transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 35% 30%, ${accentColor} 0%, #0c1829 45%, #020617 80%)`,
        }}
      >
        {/* Surface texture simulation lines */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Planet name HUD stamp */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-white/40 uppercase">
          {planetName} {"//"} OPTICAL SIMULATION
        </div>
      </div>
    </div>
  );
}
