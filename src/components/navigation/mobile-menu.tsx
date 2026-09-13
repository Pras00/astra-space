"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronRight, Radio } from "lucide-react";
import { NAV_LINKS, BRAND } from "@/lib/constants";
import { HudBadge } from "@/components/ui/hud-badge";
import { AstraLogo } from "@/components/ui/astra-logo";
import { useMounted } from "@/hooks/use-mounted";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLaunchControl: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  onOpenLaunchControl,
}: MobileMenuProps) {
  const mounted = useMounted();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-slate-950/98 backdrop-blur-2xl p-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-300"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <AstraLogo size={28} />
          <span className="font-orbitron font-bold text-base tracking-widest text-white">
            {BRAND.name}
          </span>
          <HudBadge variant="cyan">SYS ONLINE</HudBadge>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="p-2.5 text-slate-400 hover:text-white rounded-lg bg-slate-900/60 border border-slate-800"
          aria-label="Close navigation menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="my-auto py-8 space-y-3">
        {NAV_LINKS.map((link, idx) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="group flex items-center justify-between py-3 px-4 rounded-lg bg-slate-900/40 border border-slate-800/60 hover:border-sky-500/40 hover:bg-slate-900/80 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-sky-400">0{idx + 1}</span>
              <span className="font-orbitron text-lg font-medium text-slate-200 group-hover:text-white group-hover:translate-x-1 transition-transform">
                {link.label}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 transition-colors" />
          </a>
        ))}
      </nav>

      {/* Launch Control CTA & Footer */}
      <div className="pt-6 border-t border-slate-800/80 space-y-4">
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenLaunchControl();
          }}
          className="w-full py-3.5 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-orbitron font-bold text-xs tracking-widest flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-all"
        >
          <Radio className="w-4 h-4" />
          LAUNCH CONTROL COMMAND
        </button>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>{BRAND.established} {"//"} DEEP CISLUNAR</span>
          <span>SYSTEM VER 4.2</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
