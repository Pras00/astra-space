"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Orbit } from "lucide-react";
import { HudBadge } from "@/components/ui/hud-badge";
import { JoinMissionModal } from "./join-mission-modal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function FinalCta() {
  const [modalOpen, setModalOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <>
      <section className="relative py-32 sm:py-44 overflow-hidden border-b border-slate-900 text-center">
        {/* Deep Space Horizon Light Burst Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-t from-sky-600/25 via-indigo-900/15 to-transparent rounded-t-full blur-[140px] pointer-events-none" />

        {/* Distant Celestial Silhouette Horizon Line */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[900px] sm:w-[1400px] h-[400px] rounded-[100%] border-t border-sky-400/40 bg-[#020617] shadow-[0_-20px_50px_rgba(56,189,248,0.2)] pointer-events-none select-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-center mb-6">
            <HudBadge variant="cyan" pulse>
              DESTINY HORIZON // FINAL CHAPTER
            </HudBadge>
          </div>

          <motion.div
            initial={{ opacity: 0, y: reducedMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-orbitron text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[0.98] mb-6 glow-text-white">
              THE NEXT FRONTIER <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-white to-sky-400">
                IS WAITING.
              </span>
            </h2>

            <p className="font-space text-lg sm:text-2xl text-slate-300 font-light max-w-2xl mx-auto mb-10">
              Exploration has no finish line. The void does not conquer itself — it requires the courageous.
            </p>

            {/* Primary Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-md font-orbitron font-extrabold text-sm sm:text-base tracking-widest text-slate-950 bg-white hover:bg-sky-300 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:shadow-[0_0_50px_rgba(56,189,248,0.7)] active:scale-95"
              >
                <span>JOIN THE MISSION</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <a
                href="#destinations"
                className="inline-flex items-center gap-2 px-6 py-5 rounded-md font-orbitron text-xs sm:text-sm tracking-wider text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-950/60 backdrop-blur-md transition-colors"
              >
                <Orbit className="w-4 h-4 text-sky-400" />
                <span>EXPLORE DESTINATIONS</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Cadet Enrollment Modal */}
      <JoinMissionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
