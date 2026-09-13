import { InitialLoader } from "@/components/ui/initial-loader";
import { StarField } from "@/components/ui/star-field";
import { Navbar } from "@/components/navigation/navbar";
import { Hero } from "@/components/hero/hero";
import { Philosophy } from "@/components/philosophy/philosophy";
import { PlanetExplorer } from "@/components/destinations/planet-explorer";
import { MissionTimeline } from "@/components/missions/mission-timeline";
import { SpacecraftShowcase } from "@/components/spacecraft/spacecraft-showcase";
import { TechnologyExplorer } from "@/components/technology/technology-explorer";
import { LiveStatus } from "@/components/mission-control/live-status";
import { Statistics } from "@/components/statistics/statistics";
import { FinalCta } from "@/components/cta/final-cta";
import { Footer } from "@/components/footer/footer";
import { AudioToggle } from "@/components/ui/audio-toggle";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-void-950 text-slate-100 selection:bg-sky-500/30 selection:text-white">
      {/* Short Cinematic Initial Loading Screen */}
      <InitialLoader />

      {/* Multi-layered Deep Space Starfield & Atmosphere */}
      <StarField />

      {/* Sticky Futuristic Navigation & Launch Control */}
      <Navbar />

      {/* Main Content Area */}
      <main id="main-content" className="relative z-10 flex flex-col">
        {/* Cinematic Hero */}
        <Hero />

        {/* Philosophy Section */}
        <Philosophy />

        {/* Interactive 3D Planet Explorer */}
        <PlanetExplorer />

        {/* Trajectory Mission Timeline */}
        <MissionTimeline />

        {/* Spacecraft Fleet Showcase */}
        <SpacecraftShowcase />

        {/* Interactive Aerospace Technology Blueprint */}
        <TechnologyExplorer />

        {/* Live Mission Control & Launch Countdown */}
        <LiveStatus />

        {/* Mission Statistics */}
        <Statistics />

        {/* Final CTA Horizon */}
        <FinalCta />
      </main>

      {/* Footer */}
      <Footer />

      {/* Muted-by-Default Ambient Cosmic Audio Synthesizer Toggle */}
      <AudioToggle />
    </div>
  );
}
