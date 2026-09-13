"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Send, CheckCircle2, ShieldCheck } from "lucide-react";
import { HudBadge } from "@/components/ui/hud-badge";
import { AstraLogo } from "@/components/ui/astra-logo";
import { BRAND } from "@/lib/constants";
import { useMounted } from "@/hooks/use-mounted";

interface JoinMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinMissionModal({ isOpen, onClose }: JoinMissionModalProps) {
  const mounted = useMounted();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    discipline: "ASTRODYNAMICS & TRAJECTORY OPTIMIZATION",
    destination: "MARS EXPEDITION ONE",
  });

  const handleClose = useCallback(() => {
    setSubmitted(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Join ASTRA Mission Cadet Program"
      onClick={handleClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-xl bg-[#080d1a] border border-sky-500/40 rounded-xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(56,189,248,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <AstraLogo size={32} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-bold text-base text-white">
                  CADET ENROLLMENT DIRECTIVE
                </span>
                <HudBadge variant="cyan">TRL-CLASS 1</HudBadge>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                INTERPLANETARY PERSONNEL DIVISION // {BRAND.hq}
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            type="button"
            className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            aria-label="Close Enrollment Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-orbitron font-extrabold text-2xl text-white uppercase tracking-tight">
              APPLICATION TRANSMITTED
            </h4>
            <p className="font-space text-slate-300 text-sm max-w-md mx-auto">
              Welcome to the cohort, Cadet {formData.name || "Explorer"}. Your dossier has been encrypted and routed to ASTRA Mission Operations.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                type="button"
                className="px-6 py-2.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-orbitron text-xs font-bold tracking-wider"
              >
                RETURN TO MISSION
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block font-mono text-xs text-slate-300 uppercase tracking-wider mb-1.5">
                FULL NAME / CALLSIGN
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Dr. Elena Vance"
                className="w-full px-3.5 py-2.5 rounded bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-space text-sm"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-slate-300 uppercase tracking-wider mb-1.5">
                SECURE COMMS (EMAIL)
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="vance@deepspace.network"
                className="w-full px-3.5 py-2.5 rounded bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-space text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs text-slate-300 uppercase tracking-wider mb-1.5">
                  SCIENTIFIC DISCIPLINE
                </label>
                <select
                  value={formData.discipline}
                  onChange={(e) =>
                    setFormData({ ...formData, discipline: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded bg-slate-900/90 border border-slate-700 text-slate-200 focus:outline-none focus:border-sky-400 font-space text-xs"
                >
                  <option>ASTRODYNAMICS & TRAJECTORY</option>
                  <option>CRYOGENIC PROPULSION</option>
                  <option>CLOSED-LOOP ECLSS BIOLOGY</option>
                  <option>AUTONOMOUS OPTICAL AVIONICS</option>
                  <option>HIGH-ENERGY PLASMA PHYSICS</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-300 uppercase tracking-wider mb-1.5">
                  ASSIGNMENT TARGET
                </label>
                <select
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded bg-slate-900/90 border border-slate-700 text-slate-200 focus:outline-none focus:border-sky-400 font-space text-xs"
                >
                  <option>LUNAR GATEWAY FOUNDRY</option>
                  <option>MARS EXPEDITION ONE</option>
                  <option>EUROPA CRYO-OCEAN PROBE</option>
                  <option>DEEP SPACE INTERSTELLAR</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-orbitron font-bold text-xs tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all active:scale-98"
              >
                <Send className="w-4 h-4" />
                TRANSMIT ENCRYPTED APPLICATION
              </button>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>OUTER SPACE TREATY ARTICLE VI COMPLIANT</span>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
