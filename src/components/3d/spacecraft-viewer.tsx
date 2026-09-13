"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Spacecraft } from "@/data/spacecraft";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface SpacecraftViewerProps {
  spacecraft: Spacecraft;
}

export function SpacecraftViewer({ spacecraft }: SpacecraftViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webglError, setWebglError] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
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
      setWebglError(true);
      return;
    }

    const scene = new THREE.Scene();
    let width = container.clientWidth || 400;
    let height = container.clientHeight || 350;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Root spacecraft container group for rotation/float
    const craftGroup = new THREE.Group();
    scene.add(craftGroup);

    // Procedural 3D Spacecraft Construction based on spacecraft.id
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.85,
      roughness: 0.25,
    });

    const darkHullMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.4,
    });

    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    if (spacecraft.id === "astra-1") {
      // ASTRA I: Lunar Orbiter & Cargo Pod
      // 1. Conical Command Module
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.4, 32), hullMat);
      cone.rotation.x = Math.PI / 2;
      cone.position.z = 1.0;
      craftGroup.add(cone);

      // 2. Service Module Cylinder
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.8, 32), darkHullMat);
      cyl.rotation.x = Math.PI / 2;
      cyl.position.z = -0.5;
      craftGroup.add(cyl);

      // 3. Solar Wing Arrays
      const wingGeo = new THREE.BoxGeometry(3.6, 0.04, 0.6);
      const wing = new THREE.Mesh(wingGeo, glowMat);
      wing.position.z = -0.5;
      craftGroup.add(wing);

      // 4. Engine Bell Nozzle
      const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.7, 24), darkHullMat);
      nozzle.rotation.x = -Math.PI / 2;
      nozzle.position.z = -1.6;
      craftGroup.add(nozzle);
    } else if (spacecraft.id === "astra-2") {
      // ASTRA II: Mars Expeditionary Cruiser
      // 1. Elongated Main Hull
      const mainHull = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 4.0, 32), hullMat);
      mainHull.rotation.x = Math.PI / 2;
      craftGroup.add(mainHull);

      // 2. Torus Habitat Ring (Centrifugal Artificial Gravity)
      const torusGeo = new THREE.TorusGeometry(1.8, 0.16, 16, 48);
      const torus = new THREE.Mesh(torusGeo, hullMat);
      torus.position.z = 0.4;
      craftGroup.add(torus);

      // 3. Radiator Fins
      const rad1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.2, 1.2), darkHullMat);
      rad1.position.z = -1.2;
      craftGroup.add(rad1);

      // 4. Cluster Thrusters
      for (let i = 0; i < 3; i++) {
        const eng = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 0.8, 16), darkHullMat);
        eng.rotation.x = Math.PI / 2;
        eng.position.set((i - 1) * 0.4, 0, -2.4);
        craftGroup.add(eng);
      }
    } else {
      // ASTRA III: Deep Space Probe Carrier
      // 1. Sleek Central Core
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 5.0, 32), darkHullMat);
      core.rotation.x = Math.PI / 2;
      craftGroup.add(core);

      // 2. Giant Magnetic Deflector Dish / Ring at bow
      const deflector = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.08, 16, 64), glowMat);
      deflector.position.z = 2.4;
      craftGroup.add(deflector);

      // 3. Spoke struts to ring
      for (let i = 0; i < 4; i++) {
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8), hullMat);
        spoke.rotation.z = (i * Math.PI) / 4;
        spoke.position.z = 2.4;
        craftGroup.add(spoke);
      }

      // 4. Dual Fusion Exhaust Nozzles
      const nz1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 1.0, 16), hullMat);
      nz1.rotation.x = Math.PI / 2;
      nz1.position.set(0.4, 0, -2.9);
      craftGroup.add(nz1);

      const nz2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 1.0, 16), hullMat);
      nz2.rotation.x = Math.PI / 2;
      nz2.position.set(-0.4, 0, -2.9);
      craftGroup.add(nz2);
    }

    // Engine exhaust ion glow light
    const engineLight = new THREE.PointLight(0x38bdf8, 3, 10);
    engineLight.position.set(0, 0, -3.2);
    craftGroup.add(engineLight);

    // Ambient and Key Lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-4, -2, -2);
    scene.add(fillLight);

    const ambLight = new THREE.AmbientLight(0x0f172a, 0.8);
    scene.add(ambLight);

    // Initial craft pitch
    craftGroup.rotation.y = 0.6;
    craftGroup.rotation.x = 0.2;

    // Mouse Parallax Interaction
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.targetY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    container.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = (performance.now() - startTime) * 0.001;

      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      if (!reducedMotion) {
        // Floating zero-g oscillation
        craftGroup.position.y = Math.sin(time * 0.8) * 0.15;
        craftGroup.position.x = Math.cos(time * 0.5) * 0.08;

        // Subtle yaw rotation & mouse response
        craftGroup.rotation.y = 0.5 + Math.sin(time * 0.3) * 0.1 + mouse.x * 0.3;
        craftGroup.rotation.x = 0.2 + mouse.y * 0.2;
        craftGroup.rotation.z = -mouse.x * 0.1;
      }

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      scene.clear();
    };
  }, [spacecraft.id, reducedMotion]);

  if (webglError) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/60 font-mono text-xs text-sky-400">
          [{spacecraft.name} VECTOR BLUEPRINT ONLINE]
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      aria-label={`3D visualization of spacecraft ${spacecraft.name}`}
    />
  );
}
