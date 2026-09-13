"use client";

import dynamic from "next/dynamic";
import { ArrowRight, Compass, ShieldCheck } from "lucide-react";
import { HudBadge } from "@/components/ui/hud-badge";
import { BRAND } from "@/lib/constants";
import { FallbackCanvas } from "@/components/3d/fallback-canvas";
import { TelemetryRibbon } from "./telemetry-ribbon";

const DynamicEarthScene = dynamic(
  () => import("@/components/3d/earth-scene").then((mod) => mod.EarthScene),
  {
    ssr: false,
    loading: () => <FallbackCanvas planetName="Earth" />,
  }
);

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-24 sm:pt-28 pb-0 overflow-hidden">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] sm:h-[700px] bg-sky-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-8 my-auto z-10">
        {/* Left Column: Editorial Typography & Actions */}
        <div className="flex-1 flex flex-col items-start text-left max-w-2xl">
          {/* Mission Status Badge */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <HudBadge variant="cyan" pulse>
              ASTRA MISSION ARCHITECTURE
            </HudBadge>
            <span className="hidden sm:inline-block font-mono text-xs text-slate-400 tracking-wider">
              // EST. {BRAND.established}
            </span>
          </div>

          {/* Hero Main Headline */}
          <h1 className="font-orbitron text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[0.95] mb-6 glow-text-white">
            BEYOND <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-sky-400">
              EARTH.
            </span>
            <br />
            <span className="text-slate-400 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-normal">
              EXPLORE WHAT&apos;S NEXT.
            </span>
          </h1>

          {/* Supporting Philosophy Text */}
          <p className="font-space text-base sm:text-lg md:text-xl text-slate-300 font-light leading-relaxed mb-8 max-w-xl">
            {BRAND.subtagline} Engineering cislunar logistics, permanent Martian habitats, and deep-space autonomous science platforms.
          </p>

          {/* Dual Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <a
              href="#missions"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded font-orbitron font-bold text-xs sm:text-sm tracking-widest text-slate-950 bg-white hover:bg-sky-300 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(56,189,248,0.5)] active:scale-95"
            >
              <span>EXPLORE MISSIONS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#destinations"
              className="group inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded font-orbitron font-semibold text-xs sm:text-sm tracking-wider text-slate-200 hover:text-white border border-slate-700/80 hover:border-sky-400/60 bg-slate-950/40 backdrop-blur-md transition-all duration-300 hover:bg-slate-900/60"
            >
              <Compass className="w-4 h-4 text-sky-400 group-hover:rotate-45 transition-transform duration-500" />
              <span>DISCOVER DESTINATIONS</span>
            </a>
          </div>

          {/* Micro HUD Metadata */}
          <div className="mt-10 pt-6 border-t border-slate-800/80 flex items-center gap-6 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>FAIL-SAFE REDUNDANCY</span>
            </div>
            <span>•</span>
            <div>INTERPLANETARY RATING: CLASS AAA</div>
          </div>
        </div>

        {/* Right Column: 3D Earth Celestial Scene */}
        <div className="flex-1 w-full relative flex items-center justify-center">
          <DynamicEarthScene />
        </div>
      </div>

      {/* Bottom Telemetry Ticker Ribbon */}
      <div className="w-full mt-8 z-20">
        <TelemetryRibbon />
      </div>
    </section>
  );
}
