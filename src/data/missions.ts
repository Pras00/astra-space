export interface MissionNode {
  year: string;
  code: string;
  title: string;
  target: string;
  status: "COMPLETED" | "CURRENT FLIGHT" | "PLANNED" | "FUTURE HORIZON";
  duration: string;
  crew: string;
  description: string;
  milestones: string[];
  trajectoryDeltaV: string;
  phase: number;
}

export const MISSIONS: MissionNode[] = [
  {
    year: "2028",
    code: "ASTRA-L1",
    title: "LUNAR GATEWAY FOUNDRY",
    target: "LUNAR SOUTH POLE",
    status: "CURRENT FLIGHT",
    duration: "730 DAYS",
    crew: "4 ASTRONAUTS",
    description:
      "Establishing the first permanent cislunar propellant harvesting depot and modular pressurized habitat at Shackleton Crater rim, tapping perpetual solar illumination.",
    milestones: [
      "Autonomous autonomous regolith landing",
      "Deploy 50kW nuclear Stirling reactor",
      "Liquid methane & LOX production synthesis",
    ],
    trajectoryDeltaV: "3.92 km/s",
    phase: 1,
  },
  {
    year: "2031",
    code: "ASTRA-M1",
    title: "MARS EXPEDITION ONE",
    target: "JEZERO BASIN, MARS",
    status: "PLANNED",
    duration: "940 DAYS",
    crew: "6 ASTRONAUTS",
    description:
      "Humanity's inaugural interplanetary landing. Direct transit via nuclear thermal propulsion, deploying modular subterranean habitats to shield against solar cosmic radiation.",
    milestones: [
      "Aerocapture and supersonic retro-propulsion",
      "Autonomous biospheric life-support activation",
      "Subsurface ice core analysis for paleobiology",
    ],
    trajectoryDeltaV: "5.87 km/s",
    phase: 2,
  },
  {
    year: "2035",
    code: "ASTRA-E1",
    title: "EUROPA OCEAN RESEARCH",
    target: "JOVIAN SYSTEM",
    status: "PLANNED",
    duration: "1,825 DAYS",
    crew: "ROBOTIC AUTONOMY",
    description:
      "Orbital insertion around Jupiter followed by autonomous robotic descent to Europa's icy shell, deploying melt-probe technology to sample the 100km-deep subterranean saltwater ocean.",
    milestones: [
      "Jovian radiation belt hardening",
      "Thermal cryo-drill deployment through ice crust",
      "Submarine robotic explorer hydrothermal search",
    ],
    trajectoryDeltaV: "8.41 km/s",
    phase: 3,
  },
  {
    year: "2040",
    code: "ASTRA-DS",
    title: "DEEP SPACE HORIZON",
    target: "HELIOPAUSE & INTERSTELLAR PRECURSOR",
    status: "FUTURE HORIZON",
    duration: "INDEFINITE",
    crew: "QUANTUM AI CORE",
    description:
      "Propelled by high-power pulsed plasma and solar sail laser collimation, reaching 0.05c to explore the gravitational lensing focus point 550 AU beyond our solar boundary.",
    milestones: [
      "Solar gravitational lens observatory positioning",
      "Direct exo-planetary surface imaging",
      "Quantum encrypted long-range laser relay",
    ],
    trajectoryDeltaV: "45.0 km/s",
    phase: 4,
  },
];
