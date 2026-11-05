"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowRight, ArrowDownRight } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { HudBadge } from "@/components/ui/hud-badge";
import { FallbackCanvas } from "@/components/3d/fallback-canvas";
import { JoinMissionModal } from "@/components/cta/join-mission-modal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { TelemetryRibbon } from "./telemetry-ribbon";

const DynamicEarthScene = dynamic(
  () => import("@/components/3d/earth-scene").then((mod) => mod.EarthScene),
  {
    ssr: false,
    loading: () => <FallbackCanvas planetName="EARTH" accentColor="#38bdf8" />,
  }
);

export function Hero() {
  const heroRunwayRef = useRef<HTMLElement | null>(null);
  const [manifestOpen, setManifestOpen] = useState(false);
  const [earthProgress, setEarthProgress] = useState(0);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRunwayRef,
    offset: ["start start", "end start"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 26,
    restDelta: 0.001,
  });

  useMotionValueEvent(smoothScroll, "change", (latest) => {
    setEarthProgress(Math.max(0, Math.min(1, latest)));
  });

  const copyOpacity = useTransform(smoothScroll, [0, 0.55], [1, 0.15]);
  const copyShiftY = useTransform(smoothScroll, [0, 0.6], [0, -48]);

  return (
    <>
      <section
        ref={heroRunwayRef}
        className="relative min-h-svh lg:min-h-144 border-b border-hairline"
      >
        <div className="min-h-svh flex flex-col justify-between pt-20 sm:pt-24">
          {/* Main Asymmetric Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 py-8 z-10">
            {/* Left Column: Brutalist Aerospace Typography */}
            <motion.div
              style={
                reducedMotion
                  ? undefined
                  : { opacity: copyOpacity, y: copyShiftY }
              }
              className="lg:col-span-7 flex flex-col items-start text-left"
            >
              <div className="flex flex-wrap items-center gap-3 mb-5 sm:mb-7">
                <HudBadge variant="signal" pulse>
                  {BRAND.status}
                </HudBadge>
                <span className="font-mono text-3xs text-ash uppercase tracking-widest">
                  {BRAND.hq}
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-bold uppercase tracking-tighter text-bone leading-none mb-5 sm:mb-6">
                CISLUNAR &amp; <br />
                DEEP-SPACE <br />
                HEAVY FLIGHT.
              </h1>

              <p className="font-sans text-sm sm:text-base lg:text-lg text-titanium leading-relaxed mb-6 sm:mb-9 max-w-xl">
                {BRAND.subtagline} Engineered for high-cadence payload delivery from low-Earth staging rings to Shackleton Crater and Jezero Basin.
              </p>

              {/* Locked Accent Action Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setManifestOpen(true)}
                  className="group inline-flex items-center justify-center gap-3 px-7 py-4 rounded-none bg-signal hover:bg-signal-hover text-bone font-mono font-semibold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <span>{BRAND.primaryCta}</span>
                  <ArrowRight
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </button>

                <a
                  href="#missions"
                  className="group inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-none border border-hairline-strong hover:border-bone bg-carbon text-titanium hover:text-bone font-mono text-xs uppercase tracking-widest transition-colors"
                >
                  <span>{BRAND.secondaryCta}</span>
                  <ArrowDownRight
                    className="w-4 h-4 text-signal"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </motion.div>

            {/* Right Column: Scroll-Linked 3D Cislunar Stage */}
            <div className="lg:col-span-5 w-full relative flex items-center justify-center">
              <DynamicEarthScene scrollProgress={earthProgress} />
            </div>
          </div>

          {/* Bottom Mass-Budget & Flight Ledger */}
          <div className="w-full z-20">
            <TelemetryRibbon />
          </div>
        </div>
      </section>

      <JoinMissionModal
        isOpen={manifestOpen}
        onClose={() => setManifestOpen(false)}
      />
    </>
  );
}
