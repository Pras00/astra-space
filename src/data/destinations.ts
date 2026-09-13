export interface OutpostPoint {
  name: string;
  type: string;
  lat: number; // degrees -90 to 90
  lon: number; // degrees -180 to 180
  status: "OPERATIONAL" | "ACTIVE SITE" | "PLANNED" | "SURVEYING";
}

export interface Destination {
  id: string;
  name: string;
  subtitle: string;
  distance: string;
  distanceLabel: string;
  temperature: string;
  gravity: string;
  status: "SURVEYING" | "ACTIVE EXPEDITION" | "ESTABLISHED BASE" | "ORBITAL PROBE" | "TARGET HORIZON";
  progress: number; // percentage
  atmosphere: string;
  orbitalPeriod: string;
  color: string;
  accentColor: string;
  glowColor: string;
  description: string;
  scientificGoal: string;
  coordinates: string;
  outposts: OutpostPoint[];
}

export const DESTINATIONS: Destination[] = [
  {
    id: "earth",
    name: "EARTH",
    subtitle: "Cradle of Humanity & Orbital Gateway",
    distance: "0 KM",
    distanceLabel: "ORIGIN POINT",
    temperature: "15°C",
    gravity: "9.81 M/S²",
    status: "ESTABLISHED BASE",
    progress: 100,
    atmosphere: "Nitrogen 78%, Oxygen 21%",
    orbitalPeriod: "365.25 DAYS",
    color: "#2563eb",
    accentColor: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.4)",
    description:
      "The planetary anchor point for all outward expeditions. ASTRA's orbital ring facilities coordinate launch trajectories, propellant depots, and deep-space communications arrays.",
    scientificGoal: "Cislunar orbital logistics and interplanetary launch synchronization.",
    coordinates: "0.0000° N, 0.0000° E",
    outposts: [
      { name: "Spaceport One (Star Harbor)", type: "Primary Launch Site", lat: 28.5, lon: -80.6, status: "OPERATIONAL" },
      { name: "Equatorial Orbital Ring Hub", type: "Geostationary Staging", lat: 0.0, lon: 45.0, status: "OPERATIONAL" },
    ],
  },
  {
    id: "moon",
    name: "MOON",
    subtitle: "Cislunar Foundry & Deep Space Staging",
    distance: "384,400 KM",
    distanceLabel: "AVERAGE DISTANCE",
    temperature: "-130°C",
    gravity: "1.62 M/S²",
    status: "ACTIVE EXPEDITION",
    progress: 84,
    atmosphere: "Vacuum / Exosphere",
    orbitalPeriod: "27.3 DAYS",
    color: "#94a3b8",
    accentColor: "#e2e8f0",
    glowColor: "rgba(226, 232, 240, 0.3)",
    description:
      "The Artemis-ASTRA South Pole station extracts water ice from permanently shadowed craters, producing liquid hydrogen propellant for deep-space transit vehicles.",
    scientificGoal: "Regolith mining, lunar radio astronomy, and in-situ resource propellant synthesis.",
    coordinates: "89.9° S, 0.0° E (Shackleton Rim)",
    outposts: [
      { name: "Shackleton Foundry", type: "Cryogenic Volatiles Refinery", lat: -89.9, lon: 0.0, status: "OPERATIONAL" },
      { name: "Tranquility Comm Array", type: "Deep Space Relay Terminal", lat: 0.67, lon: 23.47, status: "OPERATIONAL" },
    ],
  },
  {
    id: "mars",
    name: "MARS",
    subtitle: "The Red Frontier & First Permanent Settlement",
    distance: "225M KM",
    distanceLabel: "AVERAGE DISTANCE",
    temperature: "-63°C",
    gravity: "3.71 M/S²",
    status: "ACTIVE EXPEDITION",
    progress: 68,
    atmosphere: "CO2 95.3%, N2 2.6%",
    orbitalPeriod: "687 DAYS",
    color: "#dc2626",
    accentColor: "#f97316",
    glowColor: "rgba(249, 115, 22, 0.35)",
    description:
      "Valles Marineris Base is humanity's first self-sustaining interplanetary outpost. ASTRA rovers and atmospheric processors prepare the Jezero Basin for pressurized biome domes.",
    scientificGoal: "Paleo-biological subterranean core sampling and closed-loop biosystems deployment.",
    coordinates: "18.38° N, 77.58° E (Jezero Crater)",
    outposts: [
      { name: "Jezero Biosphere Dome", type: "Primary Habitation & Research", lat: 18.38, lon: 77.58, status: "ACTIVE SITE" },
      { name: "Valles Marineris Solar Depot", type: "Geothermal Power Array", lat: -13.9, lon: -59.2, status: "OPERATIONAL" },
    ],
  },
  {
    id: "europa",
    name: "EUROPA",
    subtitle: "Jovian Ice World & Subsurface Ocean",
    distance: "628M KM",
    distanceLabel: "AVERAGE DISTANCE",
    temperature: "-160°C",
    gravity: "1.31 M/S²",
    status: "ORBITAL PROBE",
    progress: 42,
    atmosphere: "Trace Oxygen Exosphere",
    orbitalPeriod: "3.55 DAYS",
    color: "#38bdf8",
    accentColor: "#a5f3fc",
    glowColor: "rgba(56, 189, 248, 0.45)",
    description:
      "Beneath an icy crust 20 kilometers thick lies a warm, global saltwater ocean containing more water than all of Earth combined, energized by Jovian tidal flexing.",
    scientificGoal: "Autonomous cryo-drilling probe deployment and hydrothermal vent biosignature detection.",
    coordinates: "Jovian Orbit (Europa Trajectory)",
    outposts: [
      { name: "Pwyll Cryo-Drill Array", type: "Subsurface Penetration Station", lat: -25.2, lon: 88.6, status: "PLANNED" },
      { name: "Conamara Chaos Relay", type: "Orbital Ice Penetrating Radar", lat: 9.0, lon: -82.0, status: "SURVEYING" },
    ],
  },
  {
    id: "titan",
    name: "TITAN",
    subtitle: "Saturn's Methane Moon & Prebiotic Laboratory",
    distance: "1.4B KM",
    distanceLabel: "AVERAGE DISTANCE",
    temperature: "-179°C",
    gravity: "1.35 M/S²",
    status: "TARGET HORIZON",
    progress: 25,
    atmosphere: "Nitrogen 95%, Methane 5%",
    orbitalPeriod: "15.9 DAYS",
    color: "#d97706",
    accentColor: "#fbbf24",
    glowColor: "rgba(251, 191, 36, 0.3)",
    description:
      "A golden world wrapped in dense photochemical haze, featuring liquid ethane and methane seas, dunes of organic sand, and a subterranean liquid water reservoir.",
    scientificGoal: "Dragonfly aerial reconnaissance and cryogenic liquid hydrocarbon sampling.",
    coordinates: "Kraken Mare Hydrocarbon Sea",
    outposts: [
      { name: "Kraken Mare Drone Port", type: "Autonomous Submersible & Drone Fleet", lat: 68.0, lon: 310.0, status: "PLANNED" },
      { name: "Shangri-La Base Hub", type: "Surface Meteorology Station", lat: -10.0, lon: 165.0, status: "SURVEYING" },
    ],
  },
];
