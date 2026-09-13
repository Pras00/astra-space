export interface LiveTelemetry {
  missionId: string;
  vehicleName: string;
  targetDestination: string;
  missionStatus: "IN TRANSIT" | "ORBITAL INSERTION" | "SURFACE OPERATIONS" | "TERMINAL APPROACH";
  epochTimestamp: string;
  distanceKm: number;
  velocityKmS: number;
  signalStrength: number;
  subsystems: {
    name: string;
    status: "NOMINAL" | "ACTIVE" | "OPTIMAL" | "STANDBY";
    value: string;
  }[];
  coordinates: {
    ra: string; // Right Ascension
    dec: string; // Declination
    sunDistanceAu: string;
  };
}

export const ACTIVE_PROBE_TELEMETRY: LiveTelemetry = {
  missionId: "ASTRA-07",
  vehicleName: "HORIZON SURVEYOR VII",
  targetDestination: "EUROPA JOVIAN TRAJECTORY",
  missionStatus: "IN TRANSIT",
  epochTimestamp: "MET 482:14:22",
  distanceKm: 148392104,
  velocityKmS: 28.4,
  signalStrength: 98.7,
  subsystems: [
    { name: "MAIN ION THRUSTERS", status: "NOMINAL", value: "98.4% THRUST" },
    { name: "REACTION CONTROL (RCS)", status: "OPTIMAL", value: "PRESS 240 BAR" },
    { name: "REACTOR CORE THERMAL", status: "NOMINAL", value: "782 K / 850 K" },
    { name: "QUANTUM LASER COMM", status: "ACTIVE", value: "1.24 GBPS D/L" },
    { name: "STAR TRACKER OPTICS", status: "NOMINAL", value: "32 STARS LOCKED" },
    { name: "MAGNETIC SHIELD ARRAY", status: "ACTIVE", value: "3.52 TESLA" },
  ],
  coordinates: {
    ra: "14h 29m 42.9s",
    dec: "-62° 40' 46\"",
    sunDistanceAu: "3.48 AU",
  },
};

export const GLOBAL_STATISTICS = [
  {
    value: 12,
    suffix: "+",
    label: "MISSIONS COMPLETED",
    description: "Successful orbital, lunar, and deep-space missions launched.",
  },
  {
    value: 8,
    padZero: true,
    suffix: "",
    label: "PLANETARY TARGETS",
    description: "Celestial bodies surveyed, orbited, or surface-prospected.",
  },
  {
    value: 4.2,
    decimals: 1,
    suffix: "B",
    unit: "KM",
    label: "DISTANCE TRAVELED",
    description: "Cumulative kilometers covered by ASTRA exploration vessels.",
  },
  {
    value: 98.7,
    decimals: 1,
    suffix: "%",
    label: "MISSION SUCCESS RATE",
    description: "Unprecedented aerospace reliability across 15 flight programs.",
  },
];
