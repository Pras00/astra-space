"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { HudBadge } from "@/components/ui/hud-badge";
import { JoinMissionModal } from "./join-mission-modal";

export function FinalCta() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="relative py-28 sm:py-40 border-b border-hairline bg-carbon overflow-hidden">
        <div className="absolute inset-0 architectural-grid opacity-80 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="border border-hairline-strong bg-obsidian p-8 sm:p-14 lg:p-20 hud-frame">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-hairline">
              <HudBadge variant="signal" pulse>
                2028 / 2031 LAUNCH MANIFEST OPEN
              </HudBadge>
              <span className="font-mono text-3xs text-ash uppercase tracking-widest">
                CISLUNAR &amp; MARS AEROCAPTURE ALLOCATIONS
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
              <div className="lg:col-span-8 space-y-5">
                <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tighter text-bone leading-none">
                  RESERVE ORBITAL <br />
                  PAYLOAD MASS.
                </h2>
                <p className="text-base sm:text-lg text-titanium max-w-2xl leading-relaxed">
                  Dedicated pressurized cargo bays, lunar polar surface power interfaces, and deep-space optical relay slots are now allocating for institutional and commercial flight partners.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="group w-full inline-flex items-center justify-between px-6 py-4 rounded-none bg-signal hover:bg-signal-hover text-bone font-mono font-semibold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <span>{BRAND.primaryCta}</span>
                  <ArrowRight
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </button>

                <a
                  href="#missions"
                  className="w-full inline-flex items-center justify-between px-6 py-4 rounded-none border border-hairline-strong hover:border-bone bg-carbon text-titanium hover:text-bone font-mono text-xs uppercase tracking-widest transition-colors"
                >
                  <span>{BRAND.secondaryCta}</span>
                  <ArrowUpRight
                    className="w-4 h-4 text-signal"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <JoinMissionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
