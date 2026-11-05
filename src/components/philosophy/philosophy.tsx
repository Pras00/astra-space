"use client";

import { ScrubTextReveal } from "@/components/scrollytelling/scrub-text-reveal";

interface EngineeringThesisItem {
  readonly code: string;
  readonly metric: string;
  readonly title: string;
  readonly body: string;
}

const THESIS_PILLARS: readonly EngineeringThesisItem[] = [
  {
    code: "ARCH // 01",
    metric: "LOX / CH4 ISRU",
    title: "In-Situ Propellant Synthesis",
    body: "Shackleton Rim cryo-refineries harvest lunar polar water ice, eliminating the terrestrial gravity-well mass penalty for outward transit.",
  },
  {
    code: "ARCH // 02",
    metric: "925 SEC ISP",
    title: "Nuclear Thermal Transit",
    body: "Solid-core fission heat exchangers double specific impulse over chemical engines, halving crewed cosmic-ray exposure en route to Mars.",
  },
  {
    code: "ARCH // 03",
    metric: "ZERO-LATENCY AI",
    title: "Pulsar-Guided Autonomy",
    body: "Radiation-hardened optical star trackers and X-ray pulsar navigation execute aerocapture and surface touchdown without Earth ground-loop delay.",
  },
] as const;

export function Philosophy() {
  return (
    <section
      id="philosophy"
      className="relative py-24 sm:py-32 border-b border-hairline bg-obsidian"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrubTextReveal
          indexCode="MANIFESTO // FLIGHT DOCTRINE"
          metaLabel="SCROLL TO ILLUMINATE THESIS"
          text="CHEMICAL ROCKETS BUILT ORBITAL ACCESS. NUCLEAR THERMAL TRANSIT AND IN-SITU PROPELLANT FOUNDRIES BUILD PERMANENT CIVILIZATION."
          signalWords={["NUCLEAR", "THERMAL", "PERMANENT"]}
        />

        {/* 3-Column Architectural Ledger */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 border border-hairline divide-y md:divide-y-0 md:divide-x divide-hairline bg-carbon">
          {THESIS_PILLARS.map((pillar) => (
            <div
              key={pillar.code}
              className="p-6 sm:p-8 flex flex-col justify-between gap-6"
            >
              <div className="flex items-center justify-between font-mono text-3xs uppercase tracking-widest border-b border-hairline pb-3">
                <span className="text-ash">{pillar.code}</span>
                <span className="text-signal font-semibold">{pillar.metric}</span>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-bone mb-2.5">
                  {pillar.title}
                </h3>
                <p className="text-sm text-ash leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
