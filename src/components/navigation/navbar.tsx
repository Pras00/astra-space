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
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 border-b ${
          isScrolled
            ? "bg-obsidian/92 backdrop-blur-md border-hairline"
            : "bg-obsidian/50 backdrop-blur-xs border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          {/* Brand Insignia */}
          <a
            href="#main-content"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-1 focus-visible:ring-signal"
            aria-label="ASTRA Flight Systems Home"
          >
            <AstraLogo size={32} />
            <div className="flex flex-col">
              <span className="font-display font-bold text-base tracking-widest text-bone group-hover:text-signal transition-colors leading-none">
                {BRAND.name}
              </span>
              <span className="font-mono text-3xs text-ash tracking-widest mt-1 hidden sm:block">
                {BRAND.division}
              </span>
            </div>
          </a>

          {/* Indexed Architectural Nav Links */}
          <nav
            className="hidden lg:flex items-center gap-7"
            aria-label="Primary Sections"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group flex items-baseline gap-1.5 py-1 text-xs uppercase tracking-wider text-titanium hover:text-bone transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-signal"
              >
                <span className="font-mono text-3xs text-ash group-hover:text-signal transition-colors">
                  {link.code}
                </span>
                <span className="font-sans font-medium">{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Right Telemetry & Command Trigger */}
          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center">
              <HudBadge variant="neutral" pulse>
                DSN 28.4 KM/S
              </HudBadge>
            </div>

            <button
              onClick={() => setLaunchControlOpen(true)}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-none border border-hairline-strong bg-carbon hover:border-signal hover:bg-signal text-bone font-mono text-3xs font-semibold uppercase tracking-widest transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-signal"
            >
              <Radio className="w-3.5 h-3.5 text-signal group-hover:text-bone" aria-hidden="true" />
              <span>Flight Telemetry</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              type="button"
              className="p-2.5 lg:hidden text-titanium hover:text-bone rounded-none border border-hairline-strong bg-carbon focus:outline-none focus-visible:ring-1 focus-visible:ring-signal cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenLaunchControl={() => setLaunchControlOpen(true)}
      />

      <LaunchControlModal
        isOpen={launchControlOpen}
        onClose={() => setLaunchControlOpen(false)}
      />
    </>
  );
}
