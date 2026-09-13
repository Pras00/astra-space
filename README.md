# 🌌 ASTRA — Beyond Earth. Explore What's Next.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)](https://threejs.org/)

**ASTRA** is a high-fidelity, cinematic web application that brings space exploration to life. Built with modern aerospace aesthetics and cutting-edge web technologies, it features procedural 3D celestial rendering, real-time mission telemetry, interactive spacecraft schematics, and an ambient cosmic audio synthesizer.

---

## 🌟 Highlights & Key Features

### 1. 🪐 3D Celestial & Orbital Experiences
- **Interactive 3D Earth (Hero)**: Procedurally shaded Earth globe featuring atmospheric Rayleigh scattering glow, distant orbiting lunar body, and an active satellite following an elliptical orbital path with mouse-driven parallax.
- **Planetary Explorer (Destinations)**:
  - Procedurally generated, mathematically seamless spherical textures (no external image assets required) for **Earth**, **Moon**, **Mars**, **Europa**, and **Titan**.
  - **Full 360° Drag-to-Rotate Control** with realistic angular inertia and smooth damping.
  - **Clickable Surface Outposts**: Interactive 3D orbital beacons marking scientific settlements (e.g., Olympus Outpost, Conamara Marine Base, Kraken Methane Station).
  - Scientific telemetry HUD displaying distance from Earth, equatorial surface gravity, mean temperatures, and orbital mapped percentages.

### 2. 🛰️ Spacecraft Fleet & Technology Blueprints
- **Zero-Gravity Fleet Showcase**: Inspect the **ASTRA I (Lunar Orbiter)**, **ASTRA II (Mars Explorer)**, and **ASTRA III (Deep Space Probe Carrier)** with 3D attitude rotation and flight specification metrics (Delta-V budgets, dry mass, payload capacities).
- **Interactive Technology Blueprint**: Clickable hotspot schematics across spacecraft subsystems including Ion Propulsion, Ceramic Heat Shields, Optical Laser Comms (DSOC), and Closed-Loop ECLSS.

### 3. 📡 Mission Control & Telemetry Command
- **Live Mission Control Dashboard**: Real-time trajectory and telemetry stream for probe **ASTRA-07 (Horizon Surveyor VII)** en route to the Jovian system, featuring an incrementing live distance counter at 28.4 km/s.
- **Launch Countdown Clock**: Precision real-time countdown to the upcoming *Cislunar Gateway Expedition*.
- **Command Center Modals**:
  - **Launch Control Center**: Instant station status and active telemetry monitor.
  - **Cadet Enrollment Directive**: Encrypted recruit transmission form for future mission specialists.

### 4. 🎧 Audio & Accessibility
- **Web Audio API Ambient Synthesizer**: Built-in cosmic drone synthesizer operating at 55Hz and 82.4Hz harmonic frequencies. Muted by default; toggle anytime via the floating soundwave widget.
- **Performance & Context Recovery**: Three.js WebGL renderers feature strict memory disposal, `webglcontextlost` auto-recovery, and high-fidelity 2D Canvas/SVG fallbacks for legacy hardware.
- **Full Accessibility**: Automatic detection for `prefers-reduced-motion` and keyboard navigation support.

---

## 🛠️ Tech Stack

| Technology | Role |
| :--- | :--- |
| **Next.js 16 (App Router)** | Framework with Turbopack, React Server Components, and optimized static asset generation |
| **React 19** | Modern UI primitives with `useSyncExternalStore` for hydration safety |
| **TypeScript 5** | Strict end-to-end type safety |
| **Tailwind CSS v4** | Modern CSS engine with custom aerospace color spaces and typography |
| **Three.js (WebGL)** | Procedural shaders, 3D coordinate mapping, lighting, and camera inertia |
| **Framer Motion** | Physics-based micro-interactions, layout transitions, and scroll animations |
| **Web Audio API** | Real-time dual-oscillator procedural cosmic drone |
| **Lucide React** | Clean, minimalist aerospace iconography |

---

## 🕹️ Interactive Controls Guide

| Feature | How to Try |
| :--- | :--- |
| **Hero 3D Earth** | Move your mouse across the hero section to experience reactive camera parallax. |
| **3D Planet Explorer** | Click and drag on any planet to rotate it in 3D. Click on the floating outpost beacons to view outpost coordinates. Switch destinations using the tabs above. |
| **Fleet Showcase** | Click and drag to inspect spacecraft hulls at different angles. Click the selector buttons to inspect different vessels. |
| **Cosmic Soundscape** | Click the floating soundwave button in the bottom-left corner to activate the generative ambient drone. |
| **Mission Control Modal** | Click **"LAUNCH CONTROL"** in the top navbar or mobile menu to open the real-time command station. |
| **Cadet Application** | Click **"JOIN THE MISSION"** in the navigation or final section to open the cadet enrollment modal. |

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js 18.18+** (Node 20+ recommended) installed:
```bash
node -v
```

### 1. Clone the Repository
```bash
git clone https://github.com/Pras00/astra-space.git
cd astra-space
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore ASTRA.

---

## 📦 Available Scripts

- **`npm run dev`**: Starts the local development server with Turbopack at `http://localhost:3000`.
- **`npm run build`**: Compiles and creates a production-ready optimized build.
- **`npm run start`**: Starts the production server.
- **`npm run lint`**: Runs ESLint to verify code quality and React 19 rules.

---

## 📁 Project Structure

```text
astra/
├── public/                     # Static assets (Favicons, PNGs, SVGs)
├── src/
│   ├── app/                    # Next.js App Router routes and layout
│   │   ├── layout.tsx          # Global layout, fonts, and metadata
│   │   ├── page.tsx            # Main landing page assembling all sections
│   │   ├── icon.svg            # Vector favicon
│   │   └── globals.css         # Tailwind v4 directives and HUD styling
│   ├── components/
│   │   ├── 3d/                 # Three.js experiences (Earth, Planets, Spacecraft)
│   │   ├── hero/               # Hero headline, telemetry ribbon, and CTA
│   │   ├── destinations/       # Planet Explorer and celestial telemetry
│   │   ├── missions/           # Interactive mission roadmap timeline
│   │   ├── spacecraft/         # Fleet showcase and technical specs
│   │   ├── technology/         # Blueprint schematic with telemetry hotspots
│   │   ├── mission-control/    # Live distance tracker and launch countdown
│   │   ├── philosophy/         # Mission philosophy and core pillars
│   │   ├── navigation/         # Responsive navbar, mobile drawer, launch modal
│   │   ├── cta/                # Final banner and Cadet Enrollment Modal
│   │   ├── footer/             # Spaceport coordinates and science links
│   │   └── ui/                 # Starfield canvas, audio synthesizer, HUD badges, logo
│   ├── data/                   # Telemetry, missions, fleet, and destinations data
│   ├── hooks/                  # useMounted, useReducedMotion, useWebGLSupport, useCountdown
│   └── lib/                    # Procedural planet texture generator and constants
└── README.md
```

---

## 🛡️ License

This project is created for **ASTRA Exploration Systems**. Open science, aerospace telemetry, and web development showcase.

---

<p align="center">
  <sub>Engineered for humanity's journey beyond Earth. 🚀</sub>
</p>

