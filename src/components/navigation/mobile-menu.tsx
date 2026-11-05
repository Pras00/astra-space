"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ArrowUpRight, Radio } from "lucide-react";
import { NAV_LINKS, BRAND } from "@/lib/constants";
import { HudBadge } from "@/components/ui/hud-badge";
import { AstraLogo } from "@/components/ui/astra-logo";
import { useMounted } from "@/hooks/use-mounted";

interface MobileMenuProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onOpenLaunchControl: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  onOpenLaunchControl,
}: MobileMenuProps) {
  const mounted = useMounted();

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

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
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-obsidian p-6 lg:hidden film-grain"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-5 border-b border-hairline">
        <div className="flex items-center gap-3">
          <AstraLogo size={28} />
          <span className="font-display font-bold text-base tracking-widest text-bone">
            {BRAND.name}
          </span>
          <HudBadge variant="signal" pulse>
            NOMINAL
          </HudBadge>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="p-2.5 text-titanium hover:text-bone rounded-none bg-carbon border border-hairline-strong cursor-pointer"
          aria-label="Close navigation menu"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Indexed Links */}
      <nav className="my-auto py-6 divide-y divide-hairline border-y border-hairline" aria-label="Mobile Navigation">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="group flex items-center justify-between py-4 px-2 hover:bg-carbon transition-colors"
          >
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-signal">{link.code}</span>
              <span className="font-display text-2xl font-bold uppercase tracking-tight text-bone">
                {link.label}
              </span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-ash group-hover:text-signal transition-colors" aria-hidden="true" />
          </a>
        ))}
      </nav>

      {/* Bottom Command Trigger */}
      <div className="pt-6 space-y-4">
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenLaunchControl();
          }}
          className="w-full py-4 px-4 rounded-none bg-signal hover:bg-signal-hover text-bone font-mono font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Radio className="w-4 h-4" aria-hidden="true" />
          <span>Open Flight Telemetry</span>
        </button>

        <div className="flex items-center justify-between text-3xs font-mono text-ash uppercase tracking-widest">
          <span>{BRAND.hq}</span>
          <span>EST. {BRAND.established}</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
