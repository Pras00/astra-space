"use client";

import { useEffect, useState } from "react";
import { Menu, Radio } from "lucide-react";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import { HudBadge } from "@/components/ui/hud-badge";
import { AstraLogo } from "@/components/ui/astra-logo";
import { MobileMenu } from "./mobile-menu";
import { LaunchControlModal } from "./launch-control-modal";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [launchControlOpen, setLaunchControlOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3.5"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Telemetry Indicator */}
          <a
            href="#"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-sm"
            aria-label="ASTRA Homepage"
          >
            <AstraLogo size={36} />

            <div className="flex flex-col">
              <span className="font-orbitron font-bold text-lg tracking-[0.25em] text-white group-hover:text-sky-300 transition-colors">
                {BRAND.name}
              </span>
              <span className="font-mono text-[9px] text-slate-400 tracking-wider hidden sm:block">
                EXPLORATION SYSTEMS
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-space text-sm tracking-wider text-slate-300 hover:text-white relative py-1 transition-colors group focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-sky-400 group-hover:w-full transition-all duration-300 ease-out" />
              </a>
            ))}
          </nav>

          {/* Right Action: Launch Control & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center">
              <HudBadge variant="cyan" pulse className="font-mono">
                NET 28.4 KM/S
              </HudBadge>
            </div>

            <button
              onClick={() => setLaunchControlOpen(true)}
              type="button"
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded font-orbitron font-semibold text-xs tracking-wider text-slate-950 bg-sky-400 hover:bg-sky-300 transition-all duration-200 shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:shadow-[0_0_25px_rgba(56,189,248,0.45)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>LAUNCH CONTROL</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              type="button"
              className="p-2 md:hidden text-slate-400 hover:text-white rounded border border-slate-800 bg-slate-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenLaunchControl={() => setLaunchControlOpen(true)}
      />

      {/* Launch Control Tactical Modal */}
      <LaunchControlModal
        isOpen={launchControlOpen}
        onClose={() => setLaunchControlOpen(false)}
      />
    </>
  );
}
