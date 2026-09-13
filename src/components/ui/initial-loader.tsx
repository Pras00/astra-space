"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/lib/constants";
import { AstraLogo } from "@/components/ui/astra-logo";

export function InitialLoader() {
  const [loading, setLoading] = useState(true);
  const [statusText, setStatusText] = useState("INITIALIZING MISSION SYSTEMS...");

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStatusText("CALIBRATING ORBITAL TELEMETRY...");
    }, 450);

    const timer2 = setTimeout(() => {
      setStatusText("ALL SYSTEMS ONLINE");
    }, 900);

    const timer3 = setTimeout(() => {
      setLoading(false);
    }, 1350);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712] text-white select-none"
        >
          {/* Subtle Scanlines */}
          <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

          {/* Logo Insignia */}
          <div className="relative mb-6">
            <AstraLogo size={64} />
          </div>

          <h1 className="font-orbitron font-extrabold text-2xl tracking-[0.3em] text-white mb-3">
            {BRAND.name}
          </h1>

          {/* Progress Bar */}
          <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800 mb-3">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-300 rounded-full"
            />
          </div>

          <p className="font-mono text-xs text-sky-400 tracking-widest uppercase">
            {statusText}
          </p>

          <span className="absolute bottom-8 font-mono text-[10px] text-slate-400">
            ASTRA FLIGHT PROTOCOL // SECURE TERMINAL
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
