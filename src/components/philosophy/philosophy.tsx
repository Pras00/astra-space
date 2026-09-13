"use client";

import { motion } from "framer-motion";
import { Flame, Compass, Shield, ArrowUpRight } from "lucide-react";
import { HudBadge } from "@/components/ui/hud-badge";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function Philosophy() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="philosophy"
      className="relative py-28 sm:py-36 md:py-44 overflow-hidden border-b border-slate-900"
    >
      {/* Dramatic Cosmic Atmospheric Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-sky-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Background Orbital Trajectory Arc */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-20">
        <svg
          className="w-full max-w-5xl h-auto"
          viewBox="0 0 1200 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 100,500 C 300,100 900,100 1100,500"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="8 8"
          />
          <circle cx="600" cy="190" r="6" fill="#38bdf8" />
          <circle cx="600" cy="190" r="18" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 4" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Subheading Tag */}
        <div className="flex items-center justify-center mb-6">
          <HudBadge variant="cyan" pulse>
            FOUNDING DOCTRINE // SECTION 01
          </HudBadge>
        </div>

        {/* Monumental Headline */}
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="font-orbitron text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-[1.05] mb-8 glow-text-white">
            WE WERE NEVER MEANT <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-200 to-sky-400">
              TO STAY ON EARTH.
            </span>
          </h2>

          <p className="font-space text-base sm:text-xl md:text-2xl text-slate-300 font-light leading-relaxed max-w-3xl mx-auto mb-12">
            For four billion years, terrestrial biology remained bound to a single fragile cradle. 
            ASTRA exists to architect humanity&apos;s second horizon — building permanent cislunar infrastructure, 
            self-sustaining colonies on Mars, and autonomous scientific vessels sailing into interstellar deep space.
          </p>
        </motion.div>

        {/* Three Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-panel p-6 sm:p-8 rounded-lg border border-slate-800/80 hover:border-sky-500/40 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded border border-sky-500/30 bg-sky-950/40 flex items-center justify-center mb-5 group-hover:border-sky-400 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all">
              <Compass className="w-5 h-5 text-sky-400" />
            </div>
            <span className="font-mono text-[11px] text-sky-400 uppercase tracking-widest block mb-2">
              PILLAR 01 // HORIZON EXPANSION
            </span>
            <h3 className="font-orbitron text-lg font-bold text-white mb-3">
              Permanent Interplanetary Base
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Moving beyond brief exploratory visits to construct self-sufficient habitats, automated water-ice extraction facilities, and closed-loop biosystems.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel p-6 sm:p-8 rounded-lg border border-slate-800/80 hover:border-sky-500/40 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded border border-sky-500/30 bg-sky-950/40 flex items-center justify-center mb-5 group-hover:border-sky-400 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all">
              <Flame className="w-5 h-5 text-sky-400" />
            </div>
            <span className="font-mono text-[11px] text-sky-400 uppercase tracking-widest block mb-2">
              PILLAR 02 // PROPULSION REVOLUTION
            </span>
            <h3 className="font-orbitron text-lg font-bold text-white mb-3">
              Next-Gen Power & Thrusters
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Replacing chemical combustion with high-efficiency magnetoplasma, nuclear thermal rocketry, and laser photon accelerators to compress interplanetary flight times.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-panel p-6 sm:p-8 rounded-lg border border-slate-800/80 hover:border-sky-500/40 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded border border-sky-500/30 bg-sky-950/40 flex items-center justify-center mb-5 group-hover:border-sky-400 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all">
              <Shield className="w-5 h-5 text-sky-400" />
            </div>
            <span className="font-mono text-[11px] text-sky-400 uppercase tracking-widest block mb-2">
              PILLAR 03 // SURVIVAL & SHIELDING
            </span>
            <h3 className="font-orbitron text-lg font-bold text-white mb-3">
              Synthetic Magnetospheres
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Active magnetic deflector coils and high-entropy alloy thermal shields that protect human crews from cosmic rays, coronal mass ejections, and hypersonic entries.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
