export interface TechnologyItem {
  id: string;
  tag: string;
  title: string;
  category: "PROPULSION" | "AVIONICS" | "DEFENSE" | "TELEMETRY" | "LIFE SUPPORT";
  hotspotX: number; // percentage on diagram (0 - 100)
  hotspotY: number; // percentage on diagram (0 - 100)
  headline: string;
  efficiency: string;
  readinessLevel: string; // TRL 1-9
  description: string;
  keySpecs: { label: string; value: string }[];
  breakthrough: string;
}

export const TECHNOLOGIES: TechnologyItem[] = [
  {
    id: "propulsion",
    tag: "SYS-01",
    title: "High-Density Ion & Plasma Propulsion",
    category: "PROPULSION",
    hotspotX: 84,
    hotspotY: 52,
    headline: "Continuous acceleration using krypton/xenon electrostatic thrusters.",
    efficiency: "94.2% ISP EFFICIENCY",
    readinessLevel: "TRL-9 FLIGHT READY",
    description:
      "Unlike chemical rockets that burn their entire fuel in minutes, our dual-stage gridded ion engines provide continuous, gentle acceleration over months, cutting interplanetary transit times by over 40% while consuming one-tenth the fuel mass.",
    keySpecs: [
      { label: "SPECIFIC IMPULSE", value: "4,800 s" },
      { label: "EXHAUST VELOCITY", value: "47.1 km/s" },
      { label: "FUEL RECOVERY", value: "Closed Krypton Loop" },
      { label: "POWER CONSUMPTION", value: "25 kW Direct Fission" },
    ],
    breakthrough: "Enables multi-year continuous cruising trajectories without requiring in-flight refuel tankers.",
  },
  {
    id: "navigation",
    tag: "SYS-02",
    title: "Autonomous Deep-Space Optical AI",
    category: "AVIONICS",
    hotspotX: 20,
    hotspotY: 38,
    headline: "Edge-computed pulsar triangulation and autonomous orbit corrections.",
    efficiency: "0.002 ARCSEC PRECISION",
    readinessLevel: "TRL-8 FLIGHT QUALIFIED",
    description:
      "When signals take 45 minutes round-trip from Earth, remote joystick flying is lethal. ASTRA's onboard neural cluster monitors thousands of optical stars, asteroids, and X-ray pulsars to recalculate trajectories in real-time without ground guidance.",
    keySpecs: [
      { label: "TRIANGULATION SOURCE", value: "X-Ray Millisecond Pulsars" },
      { label: "LATENCY COMPENSATION", value: "Zero Earth-Downlink Dependency" },
      { label: "COMPUTE PLATFORM", value: "Radiation-Hardened Neural ASIC" },
      { label: "COURSE CORRECTION ERROR", value: "< 1.2 meters over 1AU" },
    ],
    breakthrough: "Decouples vessel survival from Earth command station line-of-sight during solar conjunctions.",
  },
  {
    id: "thermal",
    tag: "SYS-03",
    title: "Ultra-High Temperature Ceramic Matrix Composites",
    category: "DEFENSE",
    hotspotX: 12,
    hotspotY: 65,
    headline: "Multi-use aerocapture heat shields enduring 3,200°C atmospheric entries.",
    efficiency: "3,200°C THERMAL TOLERANCE",
    readinessLevel: "TRL-9 OPERATIONAL",
    description:
      "Engineered from carbon fiber-reinforced silicon carbide (C/SiC) and hafnium diboride aerogels. Replaces disposable ablative tiles with fully reusable, impact-tolerant outer thermal shells designed for direct interplanetary aerocapture at hyperbolic speeds.",
    keySpecs: [
      { label: "PEAK SURF TEMP", value: "3,200°C (5,792°F)" },
      { label: "REUSABILITY RATING", value: "100+ Entry Cycles" },
      { label: "CORE ATTENUATION", value: "Sub-35°C Internal Core" },
      { label: "MASS SAVINGS", value: "38% vs Traditional PICA" },
    ],
    breakthrough: "Eliminates the need for massive deceleration propellant burns upon arrival at Mars or Titan.",
  },
  {
    id: "telemetry",
    tag: "SYS-04",
    title: "Coherent Deep-Space Laser Communications (DSOC)",
    category: "TELEMETRY",
    hotspotX: 52,
    hotspotY: 28,
    headline: "1550nm optical laser downlink achieving gigabit throughput across the solar system.",
    efficiency: "100x RF BANDWIDTH",
    readinessLevel: "TRL-8 DEPLOYED",
    description:
      "Replaces legacy radio frequencies with sub-microradian pointed infrared laser transceivers. Streams high-definition 8K scientific video feeds, multispectral topographic LIDAR scans, and volumetric biological data across astronomical distances.",
    keySpecs: [
      { label: "CARRIER WAVELENGTH", value: "1550 nm Near-IR" },
      { label: "EARTH DOWNLINK SPEED", value: "267 Mbps @ Mars Perigee" },
      { label: "POINTING ACCURACY", value: "0.1 Microradians" },
      { label: "QUANTUM ENCRYPTION", value: "BB84 Entanglement Protocol" },
    ],
    breakthrough: "Provides true broadband data links for interplanetary science laboratories and human colonies.",
  },
  {
    id: "shielding",
    tag: "SYS-05",
    title: "Superconducting Active Magnetic Deflector",
    category: "DEFENSE",
    hotspotX: 50,
    hotspotY: 74,
    headline: "Miniaturized magnetosphere deflecting Galactic Cosmic Rays and solar flares.",
    efficiency: "92% GCR DEFLECTION",
    readinessLevel: "TRL-7 INTEGRATION",
    description:
      "A high-temperature superconducting coil arrangement encircles the crew citadel, generating a 3.5-Tesla toroidal magnetic field. Positively charged ionizing radiation particles are deflected around the vessel in the same manner Earth's magnetosphere protects life.",
    keySpecs: [
      { label: "MAGNETIC FIELD STRENGTH", value: "3.5 Tesla Toroid" },
      { label: "COIL TEMPERATURE", value: "77 K Liquid Nitrogen Cooled" },
      { label: "CREW RADIATION DOSE", value: "< 20 mSv / 180 Days" },
      { label: "WEIGHT PENALTY", value: "1/5th of Lead/Water Passive" },
    ],
    breakthrough: "Safeguards astronauts from irreversible neurological and DNA damage during multi-year deep space flights.",
  },
  {
    id: "biosphere",
    tag: "SYS-06",
    title: "Closed-Loop Bioregenerative Life Support (ECLSS)",
    category: "LIFE SUPPORT",
    hotspotX: 38,
    hotspotY: 50,
    headline: "99.4% biological recycling loop for oxygen, nitrogen, and potable water.",
    efficiency: "99.4% MATERIAL CLOSURE",
    readinessLevel: "TRL-8 CERTIFIED",
    description:
      "Combines engineered Spirulina photobioreactors, Sabatier carbon dioxide reduction units, and catalytic greywater purification. Yields fresh caloric protein supplements, breathes out pure oxygen, and turns humidity back into crisp drinking water.",
    keySpecs: [
      { label: "WATER RECOVERY EFFICIENCY", value: "99.8%" },
      { label: "OXYGEN REGENERATION", value: "98.5% Via Electrolysis & Algae" },
      { label: "DAILY FOOD PRODUCTION", value: "2,400 kcal per crew member" },
      { label: "MAINTENANCE INTERVAL", value: "18 Months Unattended" },
    ],
    breakthrough: "Allows deep-space craft to venture beyond the asteroid belt without requiring cargo supply vessels.",
  },
];
