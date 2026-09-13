"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Radio, Compass, Cpu } from "lucide-react";
import { HudBadge } from "@/components/ui/hud-badge";
import { AstraLogo } from "@/components/ui/astra-logo";
import { BRAND } from "@/lib/constants";
import { ACTIVE_PROBE_TELEMETRY } from "@/data/telemetry";
import { useMounted } from "@/hooks/use-mounted";

interface LaunchControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LaunchControlModal({ isOpen, onClose }: LaunchControlModalProps) {
  const mounted = useMounted();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Launch Control Command Center"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-2xl bg-[#080d1a] border border-sky-500/40 rounded-xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(56,189,248,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle scanline effect */}
        <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <AstraLogo size={32} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-bold text-lg tracking-wider text-white">
                  LAUNCH CONTROL
                </span>
                <HudBadge variant="emerald" pulse>
                  ONLINE
                </HudBadge>
              </div>
              <p className="font-mono text-xs text-slate-400">
                STATION ID: {BRAND.hq} {"//"} {BRAND.coordinates}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800/60 transition-colors"
            aria-label="Close Launch Control"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-6 space-y-6">
          {/* Active Probe Telemetry Mini Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded border border-slate-800/80 bg-slate-900/40">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                ACTIVE VEHICLE
              </span>
              <span className="font-mono text-sm font-semibold text-sky-400">
                {ACTIVE_PROBE_TELEMETRY.missionId}
              </span>
              <span className="block text-[11px] text-slate-400 truncate">
                {ACTIVE_PROBE_TELEMETRY.vehicleName}
              </span>
            </div>

            <div className="p-3 rounded border border-slate-800/80 bg-slate-900/40">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                VELOCITY
              </span>
              <span className="font-mono text-sm font-semibold text-emerald-400">
                {ACTIVE_PROBE_TELEMETRY.velocityKmS} KM/S
              </span>
              <span className="block text-[11px] text-slate-400">
                HYPERBOLIC ESCAPE
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 rounded border border-slate-800/80 bg-slate-900/40">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                QUANTUM SIGNAL
              </span>
              <span className="font-mono text-sm font-semibold text-sky-300">
                {ACTIVE_PROBE_TELEMETRY.signalStrength}%
              </span>
              <span className="block text-[11px] text-slate-400">
                DSOC CARRIER LOCKED
              </span>
            </div>
          </div>

          {/* Subsystems Status list */}
          <div className="border border-slate-800/80 rounded p-4 bg-slate-900/20 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800/50">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                AVIONICS BUS STATUS
              </span>
              <span className="text-emerald-400">6 OF 6 NOMINAL</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {ACTIVE_PROBE_TELEMETRY.subsystems.slice(0, 4).map((sub) => (
                <div
                  key={sub.name}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded bg-slate-900/60 border border-slate-800"
                >
                  <span className="text-slate-300 text-[11px] truncate max-w-[140px]">
                    {sub.name}
                  </span>
                  <span className="text-[10px] text-sky-400 font-semibold">
                    {sub.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Mission Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="#mission-control"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-orbitron font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)]"
            >
              <Radio className="w-4 h-4" />
              OPEN FULL TELEMETRY HUD
            </a>
            <a
              href="#destinations"
              onClick={onClose}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-orbitron text-xs tracking-wider transition-colors"
            >
              <Compass className="w-4 h-4" />
              ORBITAL DESTINATIONS
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>ASTRA COMMAND PROTOCOL v4.12</span>
          <span>PRESS ESC TO DISMISS</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
