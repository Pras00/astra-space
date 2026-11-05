export interface NavLinkItem {
  readonly code: string;
  readonly label: string;
  readonly href: string;
}

export interface HeroMetricItem {
  readonly label: string;
  readonly value: string;
  readonly unit: string;
}

export const BRAND = {
  name: "ASTRA",
  division: "FLIGHT SYSTEMS",
  tagline: "Cislunar & Deep-Space Heavy Infrastructure.",
  subtagline:
    "Closed-cycle methalox freighters, nuclear thermal transit cruisers, and autonomous planetary surface outposts.",
  established: 2028,
  coordinates: "28.5721° N, 80.6480° W",
  hq: "PAD 39-OMEGA // CAPE CANAVERAL",
  status: "FLIGHT TELEMETRY NOMINAL",
  primaryCta: "Request Payload Manifest",
  secondaryCta: "Inspect Trajectory",
} as const;

export const NAV_LINKS: readonly NavLinkItem[] = [
  { code: "01", label: "Destinations", href: "#destinations" },
  { code: "02", label: "Trajectory", href: "#missions" },
  { code: "03", label: "Fleet", href: "#spacecraft" },
  { code: "04", label: "Subsystems", href: "#technology" },
  { code: "05", label: "Telemetry", href: "#mission-control" },
] as const;

export const HERO_METRICS: readonly HeroMetricItem[] = [
  { label: "LEO PAYLOAD", value: "150,000", unit: "KG" },
  { label: "TLI PAYLOAD", value: "42,000", unit: "KG" },
  { label: "NTR SPECIFIC IMPULSE", value: "925", unit: "SEC" },
  { label: "ACTIVE FLIGHT VEHICLES", value: "03", unit: "IN TRANSIT" },
] as const;
