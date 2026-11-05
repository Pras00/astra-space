import { BRAND, NAV_LINKS } from "@/lib/constants";
import { ArrowUp } from "lucide-react";
import { AstraLogo } from "@/components/ui/astra-logo";

export function Footer() {
  return (
    <footer className="relative bg-obsidian pt-16 pb-12 text-ash font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-hairline">
          {/* Brand Engineering Stamp */}
          <div className="lg:col-span-5 space-y-4">
            <AstraLogo size={34} showWordmark />

            <p className="text-sm text-ash max-w-sm leading-relaxed pt-1">
              {BRAND.tagline} Heavy-lift cislunar freighters, nuclear thermal interplanetary cruisers, and autonomous surface infrastructure.
            </p>

            <div className="pt-2 font-mono text-3xs text-ash uppercase tracking-widest space-y-1">
              <div>{BRAND.hq}</div>
              <div>DATUM: {BRAND.coordinates}</div>
            </div>
          </div>

          {/* Indexed Sections */}
          <div className="lg:col-span-2">
            <span className="font-mono text-3xs font-semibold uppercase tracking-widest text-bone block mb-4">
              INDEX
            </span>
            <ul className="space-y-2.5 font-mono text-2xs">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="hover:text-bone transition-colors inline-flex items-center gap-2"
                  >
                    <span className="text-signal">{item.code}</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Reference */}
          <div className="lg:col-span-3">
            <span className="font-mono text-3xs font-semibold uppercase tracking-widest text-bone block mb-4">
              ENGINEERING DATA
            </span>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#technology" className="hover:text-bone transition-colors">
                  NTR &amp; Gridded Ion Propulsion
                </a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-bone transition-colors">
                  Shackleton Volatiles Survey
                </a>
              </li>
              <li>
                <a href="#spacecraft" className="hover:text-bone transition-colors">
                  Flight Vehicle Mass Budgets
                </a>
              </li>
              <li>
                <a href="#mission-control" className="hover:text-bone transition-colors">
                  1550nm DSOC Link Telemetry
                </a>
              </li>
            </ul>
          </div>

          {/* Regulatory Compliance */}
          <div className="lg:col-span-2">
            <span className="font-mono text-3xs font-semibold uppercase tracking-widest text-bone block mb-4">
              COMPLIANCE
            </span>
            <ul className="space-y-2.5 font-mono text-3xs uppercase tracking-wider text-ash">
              <li>OUTER SPACE TREATY ART. VI</li>
              <li>COSPAR CATEGORY IV-B</li>
              <li>LUNAR RADIO QUIET ACCORD</li>
              <li>ISO-14620 SPACE SYSTEMS</li>
            </ul>
          </div>
        </div>

        {/* Colophon Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-3xs font-mono uppercase tracking-widest text-ash">
          <span suppressHydrationWarning>
            © {new Date().getFullYear()} {BRAND.name} {BRAND.division}. ALL RIGHTS RESERVED.
          </span>

          <a
            href="#main-content"
            className="hover:text-signal transition-colors inline-flex items-center gap-1.5"
          >
            <span>RETURN TO DATUM</span>
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
