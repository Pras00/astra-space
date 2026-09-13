export const BRAND = {
  name: "ASTRA",
  tagline: "Beyond Earth. Explore What's Next.",
  subtagline: "We engineer the missions that take humanity beyond the known.",
  established: 2028,
  coordinates: "28.5721° N, 80.6480° W", // Cape Canaveral launch coordinate homage
  hq: "ASTRA Spaceport One, Star Harbor",
  status: "MISSION SYSTEMS OPERATIONAL",
} as const;

export const NAV_LINKS = [
  { label: "Destinations", href: "#destinations" },
  { label: "Missions", href: "#missions" },
  { label: "Spacecraft", href: "#spacecraft" },
  { label: "Technology", href: "#technology" },
  { label: "Mission Control", href: "#mission-control" },
] as const;

export const HERO_METRICS = [
  { label: "FLIGHT CORRIDOR", value: "DEEP CISLUNAR" },
  { label: "ACTIVE VEHICLES", value: "03 IN FLIGHT" },
  { label: "TELEMETRY LINK", value: "98.7% SIGNAL" },
  { label: "DELTA-V CAPACITY", value: "14.2 KM/S" },
] as const;
