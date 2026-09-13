import { BRAND, NAV_LINKS } from "@/lib/constants";
import { Compass, ShieldCheck, ExternalLink, ArrowUp } from "lucide-react";
import { AstraLogo } from "@/components/ui/astra-logo";

export function Footer() {
  return (
    <footer className="relative bg-slate-950 border-t border-slate-900 pt-16 pb-12 overflow-hidden text-slate-400 font-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-slate-900">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <AstraLogo size={36} />
              <span className="font-orbitron font-bold text-xl tracking-[0.25em] text-white">
                {BRAND.name}
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-light">
              {BRAND.tagline} Developing high-frequency cislunar logistics, permanent Martian colonies, and autonomous deep-space probes.
            </p>

            <div className="pt-2 font-mono text-xs text-slate-400 space-y-1">
              <div>ASTRA EXPLORATION SYSTEMS // EST. {BRAND.established}</div>
              <div>SPACEPORT ONE: {BRAND.coordinates}</div>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <span className="font-orbitron text-xs font-bold uppercase tracking-widest text-white block mb-4">
              EXPEDITIONS
            </span>
            <ul className="space-y-2.5 text-xs">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="hover:text-sky-400 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Research & Data Column */}
          <div>
            <span className="font-orbitron text-xs font-bold uppercase tracking-widest text-white block mb-4">
              OPEN SCIENCE
            </span>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="#technology"
                  className="hover:text-sky-400 transition-colors flex items-center gap-1"
                >
                  <span>Propulsion Telemetry</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="#destinations"
                  className="hover:text-sky-400 transition-colors flex items-center gap-1"
                >
                  <span>Planetary Topography</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="#missions"
                  className="hover:text-sky-400 transition-colors flex items-center gap-1"
                >
                  <span>Flight Trajectories</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="#mission-control"
                  className="hover:text-sky-400 transition-colors flex items-center gap-1"
                >
                  <span>DSOC Optical Telemetry</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Standards Column */}
          <div>
            <span className="font-orbitron text-xs font-bold uppercase tracking-widest text-white block mb-4">
              GOVERNANCE
            </span>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>Outer Space Treaty Compliant</li>
              <li>COSPAR Planetary Protection (Cat IV)</li>
              <li>Radio Astronomy Quiet Zone Accord</li>
              <li>Open Space Science Charter</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span suppressHydrationWarning>© {new Date().getFullYear()} ASTRA SYSTEMS. ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#main-content" className="hover:text-sky-400 flex items-center gap-1">
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
