export interface Spacecraft {
  id: string;
  name: string;
  classification: string;
  role: string;
  length: string;
  wingspan: string;
  dryMass: string;
  crew: string;
  propulsion: string;
  range: string;
  deltaV: string;
  powerSystem: string;
  status: string;
  summary: string;
  features: string[];
  specs: { label: string; value: string }[];
}

export const SPACECRAFT_FLEET: Spacecraft[] = [
  {
    id: "astra-1",
    name: "ASTRA I",
    classification: "LUNAR ORBITER & LOGISTICS FREIGHTER",
    role: "Cislunar Transit & Surface Payload Deployment",
    length: "32.4 METERS",
    wingspan: "18.6 METERS (PANELS DEPLOYED)",
    dryMass: "24,800 KG",
    crew: "UP TO 4 PERSONS / AUTONOMOUS",
    propulsion: "Methane-Oxygen Staged Combustion + RCS",
    range: "1,200,000 KM",
    deltaV: "4.8 KM/S",
    powerSystem: "Gallium-Arsenide Solar Array + 15kW Fuel Cell",
    status: "FLIGHT CERTIFIED",
    summary:
      "Engineered for high-frequency cislunar operations. Features an aerodynamically shielded command pod with automated orbital rendezvous docking rings and reusable lunar descent thrusters.",
    features: [
      "Modular cargo bay convertible between crew quarters and pressurized payload",
      "Tri-redundant LiDAR and optical star-tracker precision docking suite",
      "Reinforced carbon-carbon heat shield for direct lunar return atmospheric aerocapture",
    ],
    specs: [
      { label: "OVERALL HEIGHT", value: "32.4 m" },
      { label: "CREW CAPACITY", value: "0 - 4" },
      { label: "PAYLOAD TO LUNAR SURFACE", value: "14.5 t" },
      { label: "SERVICE CEILING", value: "Lunar Orbit (NRHO)" },
      { label: "HULL ALLOY", value: "Al-Li 2195 / Carbon Matrix" },
    ],
  },
  {
    id: "astra-2",
    name: "ASTRA II",
    classification: "MARS EXPEDITIONARY CRUISER",
    role: "Interplanetary Crew Habitat & Long-Duration Transit",
    length: "68.2 METERS",
    wingspan: "24.0 METERS (HULL BEAM)",
    dryMass: "86,400 KG",
    crew: "6 ASTRONAUTS (6-MONTH ROTATION)",
    propulsion: "Nuclear Thermal Rocket (NTR) + Hall Thruster Array",
    range: "450,000,000 KM",
    deltaV: "9.2 KM/S",
    powerSystem: "100 kWe Kilopower Fission Reactor",
    status: "INTEGRATION PHASE",
    summary:
      "The flagship interplanetary vessel built to bridge the void between Earth and Mars. Boasts artificial gravity centrifugal exercise rings, active cosmic-ray water shielding, and closed-loop hydroponics.",
    features: [
      "Rotating tether-balanced module generating 0.38g martian artificial gravity",
      "Heavy polyethylene and greywater radiation storm storm-shelter core",
      "Cryogenic methane re-liquefaction plant eliminating zero-boil-off fuel loss",
    ],
    specs: [
      { label: "OVERALL LENGTH", value: "68.2 m" },
      { label: "TRANSIT DURATION", value: "120 - 150 Days" },
      { label: "HABITABLE VOLUME", value: "680 m³" },
      { label: "NUCLEAR SPECIFIC IMPULSE", value: "925 s" },
      { label: "RADIATION ATTENUATION", value: "85% Solar Particle" },
    ],
  },
  {
    id: "astra-3",
    name: "ASTRA III",
    classification: "DEEP SPACE AUTONOMOUS PROBE CARRIER",
    role: "Outer Planet Gravitational Survey & Interstellar Precursor",
    length: "94.5 METERS",
    wingspan: "120.0 METERS (MAGNETIC DEFLECTOR SHIELD)",
    dryMass: "42,000 KG",
    crew: "UNMANNED / DISTRIBUTED QUANTUM NEURAL CORE",
    propulsion: "Variable Specific Impulse Magnetoplasma (VASIMR) + Fusion Drive",
    range: "15,000,000,000 KM+",
    deltaV: "42.0 KM/S",
    powerSystem: "Dual 500 kWe Fast-Neutron Fission Generators",
    status: "PROTOTYPING LABS",
    summary:
      "A transcendent long-range vehicle equipped with superconducting magnetic shielding against interstellar dust particles. Designed to operate autonomously across multi-decade outer solar system missions.",
    features: [
      "Autonomous AI navigation capable of self-correcting trajectories without Earth downlink latency",
      "High-bandwidth 1550nm optical laser transceiver transmitting 100 Mbps from Jupiter",
      "Deployable sub-probe dispersion bay carrying 12 micro-survey satellites",
    ],
    specs: [
      { label: "PRIMARY SPAN", value: "120 m" },
      { label: "CRUISING SPEED", value: "0.001c (300 km/s)" },
      { label: "COMMUNICATION BANDWIDTH", value: "1 Gbps @ Saturn" },
      { label: "OPERATIONAL LIFESPAN", value: "50+ Years" },
      { label: "AUTONOMY LEVEL", value: "Level 5 Full Synthetic" },
    ],
  },
];
