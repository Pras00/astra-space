"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { FallbackCanvas } from "./fallback-canvas";
import { getSeamlessPlanetTexture, getEarthCloudsTexture } from "@/lib/planet-textures";
import { RotateCw } from "lucide-react";

export function EarthScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webglError, setWebglError] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number = 0;

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

    if (!renderer || !renderer.domElement) {
      queueMicrotask(() => setWebglError(true));
      return;
    }

    const scene = new THREE.Scene();

    let width = container.clientWidth || 500;
    let height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // Handle WebGL context loss safely
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(animationFrameId);
      setWebglError(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost, false);

    container.appendChild(renderer.domElement);

    // Planet Root Group for Rotation
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // 1. Photorealistic Seamless Earth Sphere
    const earthTexture = getSeamlessPlanetTexture("earth");
    const earthGeometry = new THREE.SphereGeometry(1.9, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.55,
      metalness: 0.15,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    planetGroup.add(earthMesh);

    // 2. Swirling Cloud Layer Mesh
    const cloudsTexture = getEarthCloudsTexture();
    const cloudsGeometry = new THREE.SphereGeometry(1.93, 64, 64);
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.NormalBlending,
      roughness: 0.9,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    planetGroup.add(cloudsMesh);

    // 3. Atmospheric Rayleigh Glow Shader
    const atmosphereGeometry = new THREE.SphereGeometry(2.06, 48, 48);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.6);
          gl_FragColor = vec4(0.22, 0.74, 0.97, 1.0) * intensity * 1.9;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // 4. Orbital Trajectory Path (Ring) - Scaled to fit 100% within the viewport
    const orbitRadiusX = 2.85;
    const orbitRadiusY = 2.45;
    const curvePoints: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      curvePoints.push(
        new THREE.Vector3(
          Math.cos(theta) * orbitRadiusX,
          Math.sin(theta) * 0.3,
          Math.sin(theta) * orbitRadiusY
        )
      );
    }
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitLine.rotation.x = 0.35;
    orbitLine.rotation.z = -0.22;
    scene.add(orbitLine);

    // 5. Orbiting Spacecraft Satellite
    const satGroup = new THREE.Group();
    const satBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.06, 0.14),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    const solarWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.01, 0.07),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    satGroup.add(satBody);
    satGroup.add(solarWing);
    scene.add(satGroup);

    // 6. Distant Moon
    const moonTexture = getSeamlessPlanetTexture("moon");
    const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 32, 32),
      new THREE.MeshStandardMaterial({
        map: moonTexture,
        roughness: 0.9,
      })
    );
    moonMesh.position.set(4.9, 2.2, -3.2);
    scene.add(moonMesh);

    // 7. Lighting
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.8);
    sunLight.position.set(6, 3.5, 4.5);
    scene.add(sunLight);

    const spaceLight = new THREE.AmbientLight(0x0c1a30, 0.85);
    scene.add(spaceLight);

    const blueRimLight = new THREE.DirectionalLight(0x0284c7, 1.4);
    blueRimLight.position.set(-6, -2, -3);
    scene.add(blueRimLight);

    // --- FULL 360° DRAG & ROTATE WITH INERTIA ---
    let isDragging = false;
    let previousPosition = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousPosition = { x: e.clientX, y: e.clientY };
      velocity.x = 0;
      velocity.y = 0;
      setHasInteracted(true);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousPosition.x;
      const deltaY = e.clientY - previousPosition.y;

      velocity.x = deltaX * 0.005;
      velocity.y = deltaY * 0.005;

      planetGroup.rotation.y += velocity.x;
      planetGroup.rotation.x += velocity.y;

      previousPosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // Resize handling
    const handleResize = () => {
      if (!container || !renderer) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop using performance.now()
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      if (!reducedMotion) {
        if (!isDragging) {
          planetGroup.rotation.y += velocity.x;
          planetGroup.rotation.x += velocity.y;
          velocity.x *= 0.94;
          velocity.y *= 0.94;
          planetGroup.rotation.y += 0.003;
        }

        cloudsMesh.rotation.y = elapsedTime * 0.035;

        const satAngle = elapsedTime * 0.25;
        const rawX = Math.cos(satAngle) * orbitRadiusX;
        const rawY = Math.sin(satAngle) * 0.3;
        const rawZ = Math.sin(satAngle) * orbitRadiusY;

        const satPos = new THREE.Vector3(rawX, rawY, rawZ)
          .applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.35)
          .applyAxisAngle(new THREE.Vector3(0, 0, 1), -0.22);
        satGroup.position.copy(satPos);
        satGroup.rotation.y = satAngle + Math.PI / 2;
      }

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener("pointerdown", onPointerDown);
      dom.removeEventListener("webglcontextlost", handleContextLost);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", handleResize);

      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }

      earthGeometry.dispose();
      earthMaterial.dispose();
      cloudsGeometry.dispose();
      cloudsMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      orbitGeometry.dispose();
      orbitMaterial.dispose();
    };
  }, [reducedMotion]);

  if (webglError) {
    return <FallbackCanvas planetName="Earth" />;
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
      <div
        ref={containerRef}
        className="w-full h-[380px] sm:h-[480px] md:h-[560px] lg:h-[620px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
        aria-label="Interactive 3D Earth visualization. Click and drag to spin."
      />

      {/* Interactive Drag Instruction Hint Badge */}
      <div
        className={`absolute bottom-2 sm:bottom-4 px-3 py-1.5 rounded-full bg-slate-950/80 border border-sky-500/30 backdrop-blur-md flex items-center gap-2 text-[11px] font-mono text-sky-300 pointer-events-none transition-opacity duration-700 ${
          hasInteracted ? "opacity-30 hover:opacity-100" : "opacity-90 animate-pulse"
        }`}
      >
        <RotateCw className="w-3.5 h-3.5 text-sky-400" />
        <span>CLICK & DRAG TO ROTATE 360°</span>
      </div>
    </div>
  );
}
