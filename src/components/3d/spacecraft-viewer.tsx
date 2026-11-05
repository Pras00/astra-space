"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Spacecraft } from "@/data/spacecraft";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useWebGLSupport } from "@/hooks/use-webgl-support";
import {
  getHullPlatingMaps,
  getRadiatorGridMaps,
} from "@/lib/planet-textures";

interface SpacecraftViewerProps {
  readonly spacecraft: Spacecraft;
  readonly stageProgress?: number;
}

export function SpacecraftViewer({
  spacecraft,
  stageProgress = 0,
}: SpacecraftViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageProgressRef = useRef<number>(stageProgress);
  const [webglError, setWebglError] = useState(false);
  const reducedMotion = useReducedMotion();
  const { supported: webglSupported, checking: webglChecking } =
    useWebGLSupport();

  useEffect(() => {
    stageProgressRef.current = stageProgress;
  }, [stageProgress]);

  useEffect(() => {
    if (webglChecking || !webglSupported) return;
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      queueMicrotask(() => setWebglError(true));
      return;
    }

    const scene = new THREE.Scene();
    let width = container.clientWidth || 440;
    let height = container.clientHeight || 368;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    const getAspectScale = (aspect: number) =>
      Math.max(1, 1.18 / Math.max(0.55, aspect));
    camera.position.set(0, 0, 9.4 * getAspectScale(width / height));

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.24;
    container.appendChild(renderer.domElement);

    const disposableGeometries: THREE.BufferGeometry[] = [];
    const disposableMaterials: THREE.Material[] = [];
    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      disposableGeometries.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      disposableMaterials.push(m);
      return m;
    };

    const hullMaps = getHullPlatingMaps();
    const arrayMaps = getRadiatorGridMaps();

    // Aerospace PBR Material Palette
    const titaniumPlateMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: hullMaps.map,
        bumpMap: hullMaps.bumpMap,
        bumpScale: 0.024,
        roughnessMap: hullMaps.roughnessMap,
        color: 0xf0f2f7,
        metalness: 0.78,
        roughness: 0.34,
      })
    );

    const darkAlloyMat = trackMat(
      new THREE.MeshStandardMaterial({
        bumpMap: hullMaps.bumpMap,
        bumpScale: 0.02,
        color: 0x1b1f2b,
        metalness: 0.72,
        roughness: 0.38,
      })
    );

    const tpsCarbonMat = trackMat(
      new THREE.MeshStandardMaterial({
        bumpMap: arrayMaps.bumpMap,
        bumpScale: 0.018,
        color: 0x0d0f14,
        metalness: 0.35,
        roughness: 0.65,
      })
    );

    const solarArrayMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: arrayMaps.map,
        bumpMap: arrayMaps.bumpMap,
        bumpScale: 0.015,
        roughnessMap: arrayMaps.roughnessMap,
        color: 0x22365c,
        metalness: 0.82,
        roughness: 0.22,
      })
    );

    const mliGoldMat = trackMat(
      new THREE.MeshStandardMaterial({
        bumpMap: hullMaps.bumpMap,
        bumpScale: 0.03,
        color: 0xd99b38,
        metalness: 0.9,
        roughness: 0.28,
      })
    );

    const signalAccentMat = trackMat(
      new THREE.MeshBasicMaterial({ color: 0xff3b1d })
    );

    const viewportGlowMat = trackMat(
      new THREE.MeshBasicMaterial({ color: 0xdbeafe })
    );

    const timeUniform = { value: 0 };

    const createPlasmaPlume = (radius: number, length: number, coreHex: number) => {
      const plumeGeo = trackGeo(new THREE.ConeGeometry(radius, length, 24, 1, true));
      const plumeMat = trackMat(
        new THREE.ShaderMaterial({
          uniforms: {
            uTime: timeUniform,
            uColor: { value: new THREE.Color(coreHex) },
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float uTime;
            uniform vec3 uColor;
            varying vec2 vUv;
            void main() {
              // Cone uv.y = 1 at tip, 0 at base; fade from nozzle base (0) to exhaust tip (1)
              float axial = pow(clamp(1.0 - vUv.y, 0.0, 1.0), 1.75);
              float shock = 0.82 + 0.18 * sin(vUv.y * 26.0 + uTime * 18.0);
              gl_FragColor = vec4(uColor * axial * shock * 1.45, axial * 0.85);
            }
          `,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false,
        })
      );
      const mesh = new THREE.Mesh(plumeGeo, plumeMat);
      // Cone points +Y by default; rotate +PI/2 around X so tip points -Z (aft exhaust)
      mesh.rotation.x = -Math.PI / 2;
      return mesh;
    };

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const craftGroup = new THREE.Group();
    rootGroup.add(craftGroup);

    // Subtle CAD Orbital Datum Ring & Centerline Axis around Spacecraft
    const cadTicks: THREE.Vector3[] = [];
    const cadR = 2.48;
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      const rIn = i % 6 === 0 ? cadR - 0.05 : cadR - 0.02;
      const rOut = i % 6 === 0 ? cadR + 0.05 : cadR + 0.02;
      cadTicks.push(
        new THREE.Vector3(Math.cos(a) * rIn, 0, Math.sin(a) * rIn),
        new THREE.Vector3(Math.cos(a) * rOut, 0, Math.sin(a) * rOut)
      );
    }
    const cadRing = new THREE.LineSegments(
      trackGeo(new THREE.BufferGeometry().setFromPoints(cadTicks)),
      trackMat(
        new THREE.LineBasicMaterial({
          color: 0xc8ccd6,
          transparent: true,
          opacity: 0.18,
        })
      )
    );
    cadRing.rotation.x = 0.15;
    rootGroup.add(cadRing);

    const axisLine = new THREE.Line(
      trackGeo(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, -2.75),
          new THREE.Vector3(0, 0, 2.75),
        ])
      ),
      trackMat(
        new THREE.LineBasicMaterial({
          color: 0xff3b1d,
          transparent: true,
          opacity: 0.24,
        })
      )
    );
    craftGroup.add(axisLine);

    let centrifugeGroup: THREE.Group | null = null;
    let pulseCoreMesh: THREE.Mesh | null = null;

    if (spacecraft.id === "astra-1") {
      // =====================================================================
      // ASTRA I: HEAVY CISLUNAR CREW & LOGISTICS FREIGHTER
      // =====================================================================

      // 1. Stepped Command Module & Nose Frustum
      const cmdModule = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.36, 0.78, 1.15, 32)),
        titaniumPlateMat
      );
      cmdModule.rotation.x = Math.PI / 2;
      cmdModule.position.z = 1.25;
      craftGroup.add(cmdModule);

      // Forward Crew Viewport Slits
      for (let i = -2; i <= 2; i++) {
        const win = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.09, 0.035, 0.12)),
          viewportGlowMat
        );
        const angle = i * 0.26;
        win.position.set(
          Math.sin(angle) * 0.56,
          Math.cos(angle) * 0.56,
          1.22
        );
        win.rotation.z = -angle;
        win.rotation.x = -0.32;
        craftGroup.add(win);
      }

      // Attached IDSS Mechanical Docking Adapter (firmly mounted to nose)
      const dockBase = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.32, 0.36, 0.18, 24)),
        darkAlloyMat
      );
      dockBase.rotation.x = Math.PI / 2;
      dockBase.position.z = 1.9;
      craftGroup.add(dockBase);

      const dockCollar = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.28, 0.032, 12, 32)),
        signalAccentMat
      );
      dockCollar.position.z = 2.0;
      craftGroup.add(dockCollar);

      for (let i = 0; i < 6; i++) {
        const latch = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.04, 0.06, 0.08)),
          titaniumPlateMat
        );
        const a = (i / 6) * Math.PI * 2;
        latch.position.set(Math.cos(a) * 0.28, Math.sin(a) * 0.28, 2.02);
        latch.rotation.z = a;
        craftGroup.add(latch);
      }

      // 2. Pressurized Cargo & Avionics Bay with Structural Ribs
      const mainHull = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.78, 0.78, 1.95, 32)),
        titaniumPlateMat
      );
      mainHull.rotation.x = Math.PI / 2;
      mainHull.position.z = -0.3;
      craftGroup.add(mainHull);

      // Ventral Carbon-Matrix TPS Heatshield Belly
      const heatShield = new THREE.Mesh(
        trackGeo(
          new THREE.CylinderGeometry(
            0.792,
            0.792,
            1.9,
            24,
            1,
            false,
            Math.PI * 0.65,
            Math.PI * 0.7
          )
        ),
        tpsCarbonMat
      );
      heatShield.rotation.x = Math.PI / 2;
      heatShield.position.z = -0.3;
      craftGroup.add(heatShield);

      // Dorsal Avionics Spine & Gold MLI Equipment Bay
      const dorsalSpine = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.22, 0.14, 2.15)),
        darkAlloyMat
      );
      dorsalSpine.position.set(0, 0.8, -0.2);
      craftGroup.add(dorsalSpine);

      const mliBay = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.786, 0.786, 0.34, 32)),
        mliGoldMat
      );
      mliBay.rotation.x = Math.PI / 2;
      mliBay.position.z = 0.36;
      craftGroup.add(mliBay);

      // 4 Structural Stiffening Rings + RCS Quads
      [-1.15, -0.55, 0.05, 0.65].forEach((zPos) => {
        const rib = new THREE.Mesh(
          trackGeo(new THREE.TorusGeometry(0.795, 0.024, 12, 36)),
          darkAlloyMat
        );
        rib.position.z = zPos;
        craftGroup.add(rib);
      });

      for (let i = 0; i < 4; i++) {
        const rcsPod = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.12, 0.1, 0.22)),
          darkAlloyMat
        );
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        rcsPod.position.set(Math.cos(a) * 0.8, Math.sin(a) * 0.8, 0.58);
        rcsPod.rotation.z = a;
        craftGroup.add(rcsPod);
      }

      // 3. Articulated Solar Photovoltaic Wing Arrays (Port & Starboard)
      [-1, 1].forEach((side) => {
        const boom = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 1.65, 12)),
          darkAlloyMat
        );
        boom.rotation.z = Math.PI / 2;
        boom.position.set(side * 1.45, 0, -0.35);
        craftGroup.add(boom);

        // Dual segmented solar panels per wing
        [0.98, 1.78].forEach((offset) => {
          const frame = new THREE.Mesh(
            trackGeo(new THREE.BoxGeometry(0.72, 0.026, 0.78)),
            darkAlloyMat
          );
          frame.position.set(side * (0.45 + offset), 0, -0.35);
          frame.rotation.x = 0.22;
          craftGroup.add(frame);

          const cells = new THREE.Mesh(
            trackGeo(new THREE.BoxGeometry(0.66, 0.032, 0.72)),
            solarArrayMat
          );
          cells.position.copy(frame.position);
          cells.rotation.copy(frame.rotation);
          craftGroup.add(cells);
        });

        const wingTipBeacon = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.04, 0.04, 0.8)),
          signalAccentMat
        );
        wingTipBeacon.position.set(side * 2.62, 0, -0.35);
        wingTipBeacon.rotation.x = 0.22;
        craftGroup.add(wingTipBeacon);
      });

      // 4. Aft Engine Skirt & Triple Gimbaled Methalox Vacuum Nozzles
      const aftSkirt = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.78, 0.88, 0.45, 32)),
        darkAlloyMat
      );
      aftSkirt.rotation.x = Math.PI / 2;
      aftSkirt.position.z = -1.48;
      craftGroup.add(aftSkirt);

      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
        const nx = Math.cos(a) * 0.36;
        const ny = Math.sin(a) * 0.36;

        const bell = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.14, 0.3, 0.58, 24, 1, true)),
          darkAlloyMat
        );
        bell.rotation.x = Math.PI / 2;
        bell.position.set(nx, ny, -1.92);
        craftGroup.add(bell);

        const coolingRing = new THREE.Mesh(
          trackGeo(new THREE.TorusGeometry(0.28, 0.015, 8, 24)),
          signalAccentMat
        );
        coolingRing.position.set(nx, ny, -2.18);
        craftGroup.add(coolingRing);

        const throatGlow = new THREE.Mesh(
          trackGeo(new THREE.CircleGeometry(0.13, 16)),
          signalAccentMat
        );
        throatGlow.rotation.y = Math.PI;
        throatGlow.position.set(nx, ny, -1.66);
        craftGroup.add(throatGlow);

        const plume = createPlasmaPlume(0.24, 0.95, 0xff5a2a);
        plume.position.set(nx, ny, -2.62);
        craftGroup.add(plume);
      }
    } else if (spacecraft.id === "astra-2") {
      // =====================================================================
      // ASTRA II: INTERPLANETARY CENTRIFUGAL MARS CRUISER
      // =====================================================================

      // 1. Axial Structural Spine & External Truss Lattice
      const centralSpine = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.32, 0.36, 4.1, 16)),
        darkAlloyMat
      );
      centralSpine.rotation.x = Math.PI / 2;
      craftGroup.add(centralSpine);

      // 4 External Truss Longerons running bow-to-stern
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const rail = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.025, 0.025, 3.9, 8)),
          titaniumPlateMat
        );
        rail.rotation.x = Math.PI / 2;
        rail.position.set(Math.cos(a) * 0.44, Math.sin(a) * 0.44, 0);
        craftGroup.add(rail);
      }

      // Forward Command Cupola & High-Gain DSN Parabolic Dish
      const bowHab = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.28, 0.52, 0.72, 24)),
        titaniumPlateMat
      );
      bowHab.rotation.x = Math.PI / 2;
      bowHab.position.z = 2.15;
      craftGroup.add(bowHab);

      const bowDock = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.24, 0.028, 12, 24)),
        signalAccentMat
      );
      bowDock.position.z = 2.52;
      craftGroup.add(bowDock);

      // Articulated DSN Parabolic Antenna Dish
      const dishBoom = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.02, 0.02, 0.55, 8)),
        titaniumPlateMat
      );
      dishBoom.position.set(0, 0.62, 1.85);
      craftGroup.add(dishBoom);

      const dishReflector = new THREE.Mesh(
        trackGeo(
          new THREE.SphereGeometry(0.36, 24, 12, 0, Math.PI * 2, 0, 0.95)
        ),
        titaniumPlateMat
      );
      dishReflector.rotation.x = -Math.PI / 2;
      dishReflector.position.set(0, 0.96, 2.02);
      craftGroup.add(dishReflector);

      const dishFeed = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.015, 0.03, 0.22, 8)),
        signalAccentMat
      );
      dishFeed.rotation.x = Math.PI / 2;
      dishFeed.position.set(0, 0.9, 2.08);
      craftGroup.add(dishFeed);

      // 2. Rotating Artificial-Gravity Centrifuge Ring with 6 Spokes & 6 Hab Pods
      centrifugeGroup = new THREE.Group();
      centrifugeGroup.position.z = 0.72;
      craftGroup.add(centrifugeGroup);

      const hubCollar = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.54, 0.54, 0.42, 24)),
        titaniumPlateMat
      );
      hubCollar.rotation.x = Math.PI / 2;
      centrifugeGroup.add(hubCollar);

      const mainTorus = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(1.72, 0.14, 20, 64)),
        titaniumPlateMat
      );
      centrifugeGroup.add(mainTorus);

      const torusTrim = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(1.73, 0.024, 12, 64)),
        signalAccentMat
      );
      torusTrim.position.z = 0.11;
      centrifugeGroup.add(torusTrim);

      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        // Pressurized Radial Transfer Spoke connecting Hub to Ring
        const spoke = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.055, 0.065, 1.58, 12)),
          darkAlloyMat
        );
        spoke.position.set(Math.cos(a) * 0.88, Math.sin(a) * 0.88, 0);
        spoke.rotation.z = a - Math.PI / 2;
        centrifugeGroup.add(spoke);

        // Clamped Crew Habitat Module Pod on Outer Torus
        const habPod = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.52, 0.34, 0.38)),
          titaniumPlateMat
        );
        habPod.position.set(Math.cos(a) * 1.72, Math.sin(a) * 1.72, 0);
        habPod.rotation.z = a;
        centrifugeGroup.add(habPod);

        const habWin = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.3, 0.04, 0.4)),
          viewportGlowMat
        );
        habWin.position.copy(habPod.position);
        habWin.rotation.z = a;
        centrifugeGroup.add(habWin);
      }

      // 3. Spherical Cryogenic LH2 Propellant Depot Cluster
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const cryoSphere = new THREE.Mesh(
          trackGeo(new THREE.SphereGeometry(0.36, 24, 24)),
          i % 2 === 0 ? mliGoldMat : titaniumPlateMat
        );
        cryoSphere.position.set(Math.cos(a) * 0.64, Math.sin(a) * 0.64, -0.58);
        craftGroup.add(cryoSphere);
      }

      // 4. Aft Graphene Thermal Radiator Wings (4 Cross Vanes)
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const radWing = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(1.25, 0.024, 1.05)),
          solarArrayMat
        );
        radWing.position.set(Math.cos(a) * 0.98, Math.sin(a) * 0.98, -1.42);
        radWing.rotation.z = a;
        craftGroup.add(radWing);

        const radManifold = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(1.28, 0.035, 0.04)),
          signalAccentMat
        );
        radManifold.position.set(Math.cos(a) * 0.98, Math.sin(a) * 0.98, -0.9);
        radManifold.rotation.z = a;
        craftGroup.add(radManifold);
      }

      // 5. Nuclear Thermal Reactor Shield & Quad NTR Nozzles
      const reactorCore = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.56, 0.66, 0.55, 24)),
        tpsCarbonMat
      );
      reactorCore.rotation.x = Math.PI / 2;
      reactorCore.position.z = -2.05;
      craftGroup.add(reactorCore);

      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const nx = Math.cos(a) * 0.32;
        const ny = Math.sin(a) * 0.32;

        const ntrBell = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.11, 0.24, 0.54, 20, 1, true)),
          darkAlloyMat
        );
        ntrBell.rotation.x = Math.PI / 2;
        ntrBell.position.set(nx, ny, -2.52);
        craftGroup.add(ntrBell);

        const plume = createPlasmaPlume(0.19, 0.95, 0xff451d);
        plume.position.set(nx, ny, -3.12);
        craftGroup.add(plume);
      }
    } else {
      // =====================================================================
      // ASTRA III: DEEP-SPACE Z-PINCH FUSION PRECURSOR PROBE
      // =====================================================================

      // 1. Stepped Dual-Disc Whipple Micrometeoroid Shield at Bow
      const outerShield = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(1.42, 1.58, 0.07, 36)),
        tpsCarbonMat
      );
      outerShield.rotation.x = Math.PI / 2;
      outerShield.position.z = 2.05;
      craftGroup.add(outerShield);

      const shieldRim = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(1.58, 0.032, 12, 48)),
        signalAccentMat
      );
      shieldRim.position.z = 2.05;
      craftGroup.add(shieldRim);

      const innerShield = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(1.05, 1.15, 0.08, 32)),
        titaniumPlateMat
      );
      innerShield.rotation.x = Math.PI / 2;
      innerShield.position.z = 1.72;
      craftGroup.add(innerShield);

      // DSOC Optical Laser Comm Telescope at Bow Tip
      const laserBus = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.18, 0.34, 0.38, 24)),
        mliGoldMat
      );
      laserBus.rotation.x = Math.PI / 2;
      laserBus.position.z = 2.26;
      craftGroup.add(laserBus);

      const laserLens = new THREE.Mesh(
        trackGeo(new THREE.CircleGeometry(0.16, 24)),
        viewportGlowMat
      );
      laserLens.position.z = 2.46;
      craftGroup.add(laserLens);

      // 6 Structural Stand-off Struts supporting the Whipple Shield
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const strut = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.024, 0.024, 1.15, 8)),
          titaniumPlateMat
        );
        strut.position.set(Math.cos(a) * 0.72, Math.sin(a) * 0.72, 1.55);
        strut.rotation.z = a;
        strut.rotation.x = 0.68 * Math.sin(a);
        strut.rotation.y = -0.68 * Math.cos(a);
        craftGroup.add(strut);
      }

      // 2. Central Deuterium-He3 Spine & Spherical Cryotanks
      const fusionSpine = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.28, 0.34, 3.85, 24)),
        darkAlloyMat
      );
      fusionSpine.rotation.x = Math.PI / 2;
      fusionSpine.position.z = -0.15;
      craftGroup.add(fusionSpine);

      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const he3Tank = new THREE.Mesh(
          trackGeo(new THREE.SphereGeometry(0.26, 20, 20)),
          i % 2 === 0 ? titaniumPlateMat : mliGoldMat
        );
        he3Tank.position.set(Math.cos(a) * 0.48, Math.sin(a) * 0.48, 0.85);
        craftGroup.add(he3Tank);
      }

      // 3. 7 Progressive Superconducting Z-Pinch Magnetic Confinement Coils
      for (let i = 0; i < 7; i++) {
        const zCoil = 0.35 - i * 0.32;
        const coilRadius = 0.76 - i * 0.032;
        const coil = new THREE.Mesh(
          trackGeo(new THREE.TorusGeometry(coilRadius, 0.042, 14, 36)),
          i % 3 === 0 ? signalAccentMat : titaniumPlateMat
        );
        coil.position.z = zCoil;
        craftGroup.add(coil);
      }

      // 4. 4 Swept X-Wing Graphene Radiator Vanes
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const vane = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(1.42, 0.022, 0.95)),
          solarArrayMat
        );
        vane.position.set(Math.cos(a) * 1.05, Math.sin(a) * 1.05, -0.65);
        vane.rotation.z = a;
        craftGroup.add(vane);
      }

      // 5. Open 8-Strut Magnetic Flux Nozzle & Pulsing Fusion Pinch Core
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const magRail = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.022, 0.03, 0.95, 8)),
          titaniumPlateMat
        );
        magRail.position.set(Math.cos(a) * 0.58, Math.sin(a) * 0.58, -2.18);
        magRail.rotation.x = Math.PI / 2 + Math.sin(a) * 0.28;
        magRail.rotation.y = -Math.cos(a) * 0.28;
        craftGroup.add(magRail);
      }

      const aftFluxRing = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.72, 0.035, 12, 36)),
        signalAccentMat
      );
      aftFluxRing.position.z = -2.55;
      craftGroup.add(aftFluxRing);

      pulseCoreMesh = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.22, 24, 24)),
        signalAccentMat
      );
      pulseCoreMesh.position.z = -2.05;
      craftGroup.add(pulseCoreMesh);

      const fusionPlume = createPlasmaPlume(0.42, 1.35, 0xff5528);
      fusionPlume.position.z = -2.75;
      craftGroup.add(fusionPlume);
    }

    // Studio Aerospace Multi-Point Lighting
    const engineLight = new THREE.PointLight(0xff421d, 3.6, 9);
    engineLight.position.set(0, 0, -2.8);
    craftGroup.add(engineLight);

    const keyLight = new THREE.DirectionalLight(0xfffdf8, 3.2);
    keyLight.position.set(5, 5.5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x8aa4d6, 1.35);
    fillLight.position.set(-5, -2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff6b47, 1.15);
    rimLight.position.set(-3, 4, -5);
    scene.add(rimLight);

    const ambLight = new THREE.AmbientLight(0x161924, 0.85);
    scene.add(ambLight);

    // Interactive Pointer Drag + Hover Parallax
    let isDragging = false;
    let prevPointer = { x: 0, y: 0 };
    let userYawOffset = 0;
    let userPitchOffset = 0;
    const velocity = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevPointer = { x: e.clientX, y: e.clientY };
      velocity.x = 0;
      velocity.y = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.targetY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      }

      if (!isDragging) return;
      const dx = e.clientX - prevPointer.x;
      const dy = e.clientY - prevPointer.y;
      velocity.x = dx * 0.006;
      velocity.y = dy * 0.006;
      userYawOffset += velocity.x;
      userPitchOffset = Math.max(
        -0.75,
        Math.min(0.75, userPitchOffset + velocity.y)
      );
      prevPointer = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    let animationFrameId = 0;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = (performance.now() - startTime) * 0.001;
      timeUniform.value = time;
      const scrub = stageProgressRef.current;

      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      const aspectScale = getAspectScale(camera.aspect);
      const targetZ = (9.4 - Math.sin(scrub * Math.PI) * 0.8) * aspectScale;
      camera.position.z += (targetZ - camera.position.z) * 0.08;

      if (!reducedMotion) {
        if (!isDragging) {
          userYawOffset += velocity.x;
          userPitchOffset = Math.max(
            -0.75,
            Math.min(0.75, userPitchOffset + velocity.y)
          );
          velocity.x *= 0.93;
          velocity.y *= 0.93;
        }

        craftGroup.position.y = Math.sin(time * 0.85) * 0.07;
        craftGroup.rotation.y =
          0.52 + scrub * 2.55 + userYawOffset + mouse.x * 0.22;
        craftGroup.rotation.x =
          0.2 + (scrub - 0.5) * 0.32 + userPitchOffset + mouse.y * 0.14;
        craftGroup.rotation.z = -mouse.x * 0.06;

        cadRing.rotation.y = -time * 0.05;

        if (centrifugeGroup) {
          centrifugeGroup.rotation.z = time * 0.42;
        }
        if (pulseCoreMesh) {
          const s = 1 + Math.sin(time * 8) * 0.12;
          pulseCoreMesh.scale.setScalar(s);
        }
      } else {
        craftGroup.rotation.y = 0.68 + userYawOffset;
        craftGroup.rotation.x = 0.22 + userPitchOffset;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      renderer.forceContextLoss();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      disposableGeometries.forEach((g) => g.dispose());
      disposableMaterials.forEach((m) => m.dispose());
      scene.clear();
    };
  }, [spacecraft.id, reducedMotion, webglChecking, webglSupported]);

  if (!webglSupported || webglError) {
    return (
      <div className="w-full h-40 sm:h-60 lg:h-92 flex items-center justify-center p-6 border border-hairline bg-obsidian">
        <div className="px-4 py-3 border border-signal text-bone font-mono text-2xs uppercase tracking-widest">
          {spacecraft.name} — STRUCTURAL CAD READY
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-40 sm:h-60 lg:h-92 flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y select-none"
      aria-label={`3D orbital hull inspection of ${spacecraft.name}. Drag or scroll to rotate.`}
    />
  );
}
