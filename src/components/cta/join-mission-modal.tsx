"use client";

import { useEffect, useState, useCallback, FormEvent } from "react";
import { createPortal } from "react-dom";
import { X, ArrowRight, Check } from "lucide-react";
import { HudBadge } from "@/components/ui/hud-badge";
import { AstraLogo } from "@/components/ui/astra-logo";
import { BRAND } from "@/lib/constants";
import { useMounted } from "@/hooks/use-mounted";

interface JoinMissionModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

interface ManifestFormState {
  organization: string;
  email: string;
  payloadClass: string;
  flightWindow: string;
}

export function JoinMissionModal({ isOpen, onClose }: JoinMissionModalProps) {
  const mounted = useMounted();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<ManifestFormState>({
    organization: "",
    email: "",
    payloadClass: "CISLUNAR SURFACE PAYLOAD (UP TO 14,500 KG)",
    flightWindow: "2028 // ASTRA-L1 SHACKLETON RIM",
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Payload Manifest Allocation Request"
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-obsidian/90 backdrop-blur-sm"
    >
      <div
        className="relative w-full max-w-xl bg-carbon border border-hairline-strong rounded-none p-6 sm:p-8 hud-frame"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-hairline">
          <div className="flex items-center gap-3.5">
            <AstraLogo size={32} />
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-display font-bold text-lg uppercase tracking-tight text-bone">
                  Payload Manifest Allocation
                </span>
                <HudBadge variant="signal">WINDOW OPEN</HudBadge>
              </div>
              <span className="font-mono text-3xs text-ash uppercase tracking-widest block mt-1">
                FLIGHT OPERATIONS // {BRAND.hq}
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            type="button"
            className="p-2 text-ash hover:text-bone border border-transparent hover:border-hairline-strong transition-colors cursor-pointer"
            aria-label="Close Payload Manifest Modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 space-y-5">
            <div className="w-12 h-12 bg-signal text-bone flex items-center justify-center">
              <Check className="w-6 h-6" aria-hidden="true" />
            </div>
            <h4 className="font-display font-bold text-2xl text-bone uppercase tracking-tight">
              Manifest Dossier Logged
            </h4>
            <p className="font-sans text-titanium text-sm leading-relaxed">
              Allocation inquiry for{" "}
              <span className="text-bone font-semibold">
                {formData.organization || "Partner Mission"}
              </span>{" "}
              has been assigned to ASTRA Flight Integration Engineering. Expect orbital mass-budget documentation at{" "}
              <span className="font-mono text-xs text-bone">{formData.email}</span>.
            </p>
            <div className="pt-2">
              <button
                onClick={handleClose}
                type="button"
                className="px-6 py-3 rounded-none bg-bone hover:bg-signal text-obsidian hover:text-bone font-mono text-2xs font-semibold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Return to Overview
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="manifest-org"
                className="block font-mono text-3xs text-ash uppercase tracking-widest mb-1.5"
              >
                INSTITUTION / PRINCIPAL INVESTIGATOR
              </label>
              <input
                id="manifest-org"
                type="text"
                required
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
                placeholder="Jet Propulsion Laboratory — Cryo Volatiles Lab"
                className="w-full px-3.5 py-2.5 rounded-none bg-obsidian border border-hairline-strong text-bone placeholder-ash/50 focus:outline-none focus:border-signal font-sans text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="manifest-email"
                className="block font-mono text-3xs text-ash uppercase tracking-widest mb-1.5"
              >
                MISSION DISPATCH EMAIL
              </label>
              <input
                id="manifest-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="flight-ops@agency.org"
                className="w-full px-3.5 py-2.5 rounded-none bg-obsidian border border-hairline-strong text-bone placeholder-ash/50 focus:outline-none focus:border-signal font-sans text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="manifest-class"
                  className="block font-mono text-3xs text-ash uppercase tracking-widest mb-1.5"
                >
                  PAYLOAD MASS CLASS
                </label>
                <select
                  id="manifest-class"
                  value={formData.payloadClass}
                  onChange={(e) =>
                    setFormData({ ...formData, payloadClass: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-none bg-obsidian border border-hairline-strong text-bone focus:outline-none focus:border-signal font-mono text-2xs"
                >
                  <option>CISLUNAR SURFACE PAYLOAD (UP TO 14,500 KG)</option>
                  <option>MARS AEROCAPTURE BAY (UP TO 28,000 KG)</option>
                  <option>DEDICATED ORBITAL DEPLOYER (ESPA-HEAVY)</option>
                  <option>CREWED RESEARCH MODULE ALLOCATION</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="manifest-window"
                  className="block font-mono text-3xs text-ash uppercase tracking-widest mb-1.5"
                >
                  LAUNCH MANIFEST WINDOW
                </label>
                <select
                  id="manifest-window"
                  value={formData.flightWindow}
                  onChange={(e) =>
                    setFormData({ ...formData, flightWindow: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-none bg-obsidian border border-hairline-strong text-bone focus:outline-none focus:border-signal font-mono text-2xs"
                >
                  <option>2028 // ASTRA-L1 SHACKLETON RIM</option>
                  <option>2031 // ASTRA-M1 JEZERO BASIN</option>
                  <option>2035 // ASTRA-E1 JOVIAN SYSTEM</option>
                  <option>2040 // ASTRA-DS HELIOPAUSE</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 px-5 rounded-none bg-signal hover:bg-signal-hover text-bone font-mono font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                <span>Submit Manifest Inquiry</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center justify-between text-3xs font-mono text-ash uppercase tracking-widest pt-2 border-t border-hairline">
              <span>COSPAR CAT-IV COMPLIANT</span>
              <span>ITAR / EAR CLEARED</span>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
