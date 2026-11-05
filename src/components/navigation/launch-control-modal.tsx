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
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function LaunchControlModal({
  isOpen,
  onClose,
}: LaunchControlModalProps) {
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
      aria-label="Flight Telemetry Command Console"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-obsidian/90 backdrop-blur-sm"
    >
      <div
        className="relative w-full max-w-2xl bg-carbon border border-hairline-strong rounded-none p-6 sm:p-8 hud-frame overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-hairline">
          <div className="flex items-center gap-3.5">
            <AstraLogo size={32} />
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-display font-bold text-lg uppercase tracking-tight text-bone">
                  Flight Telemetry Console
                </span>
                <HudBadge variant="signal" pulse>
                  LOCKED
                </HudBadge>
              </div>
              <p className="font-mono text-3xs text-ash uppercase tracking-widest mt-1">
                {BRAND.hq} — {BRAND.coordinates}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-ash hover:text-bone border border-transparent hover:border-hairline-strong transition-colors cursor-pointer"
            aria-label="Close Flight Telemetry Console"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Telemetry Readout Cells */}
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 border border-hairline divide-y sm:divide-y-0 sm:divide-x divide-hairline bg-obsidian">
            <div className="p-4">
              <span className="font-mono text-3xs text-ash uppercase tracking-widest block mb-1">
                ACTIVE VEHICLE
              </span>
              <span className="font-mono text-sm font-bold text-bone block">
                {ACTIVE_PROBE_TELEMETRY.missionId}
              </span>
              <span className="font-mono text-3xs text-ash truncate block mt-0.5">
                {ACTIVE_PROBE_TELEMETRY.vehicleName}
              </span>
            </div>

            <div className="p-4">
              <span className="font-mono text-3xs text-ash uppercase tracking-widest block mb-1">
                HELIOCENTRIC VELOCITY
              </span>
              <span className="font-mono text-sm font-bold text-signal tabular-nums block">
                {ACTIVE_PROBE_TELEMETRY.velocityKmS} KM/S
              </span>
              <span className="font-mono text-3xs text-ash block mt-0.5">
                JOVIAN TRANSFER
              </span>
            </div>

            <div className="p-4">
              <span className="font-mono text-3xs text-ash uppercase tracking-widest block mb-1">
                OPTICAL DOWNLINK
              </span>
              <span className="font-mono text-sm font-bold text-bone tabular-nums block">
                {ACTIVE_PROBE_TELEMETRY.signalStrength}%
              </span>
              <span className="font-mono text-3xs text-ash block mt-0.5">
                1550NM DSOC CARRIER
              </span>
            </div>
          </div>

          {/* Avionics Bus Table */}
          <div className="border border-hairline bg-obsidian p-4">
            <div className="flex items-center justify-between text-3xs font-mono text-ash uppercase tracking-widest pb-3 mb-3 border-b border-hairline">
              <span className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-signal" aria-hidden="true" />
                <span>AVIONICS SUBSYSTEMS</span>
              </span>
              <span className="text-bone">06 / 06 NOMINAL</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-2xs">
              {ACTIVE_PROBE_TELEMETRY.subsystems.map((sub) => (
                <div
                  key={sub.name}
                  className="flex items-center justify-between px-3 py-2 bg-carbon border border-hairline"
                >
                  <span className="text-titanium truncate pr-2">{sub.name}</span>
                  <span className="text-3xs text-signal font-semibold shrink-0">
                    {sub.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#mission-control"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-none bg-signal hover:bg-signal-hover text-bone font-mono font-semibold text-2xs uppercase tracking-widest transition-colors"
            >
              <Radio className="w-4 h-4" aria-hidden="true" />
              <span>Open Full Telemetry Matrix</span>
            </a>
            <a
              href="#missions"
              onClick={onClose}
              className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-none border border-hairline-strong hover:border-bone text-titanium hover:text-bone font-mono text-2xs uppercase tracking-widest transition-colors"
            >
              <Compass className="w-4 h-4" aria-hidden="true" />
              <span>{BRAND.secondaryCta}</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-between text-3xs font-mono text-ash uppercase tracking-widest">
          <span>DEEP SPACE NETWORK // NODE 04</span>
          <span>ESC TO CLOSE</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
