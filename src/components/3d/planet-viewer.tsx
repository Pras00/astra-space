"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Destination, OutpostPoint } from "@/data/destinations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { FallbackCanvas } from "./fallback-canvas";
import { getSeamlessPlanetTexture, getEarthCloudsTexture } from "@/lib/planet-textures";
import { RotateCw, ZoomIn, ZoomOut, Play, Pause, MapPin } from "lucide-react";

interface PlanetViewerProps {
  destination: Destination;
}

export function PlanetViewer({ destination }: PlanetViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webglError, setWebglError] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeOutpost, setActiveOutpost] = useState<OutpostPoint | null>(null);
  const reducedMotion = useReducedMotion();

  const controlsRef = useRef<{
    zoomIn: () => void;
    zoomOut: () => void;
    resetRotation: () => void;
  } | null>(null);

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
      setWebglError(true);
      return;
    }

    if (!renderer || !renderer.domElement) {
      setWebglError(true);
      return;
    }

    const scene = new THREE.Scene();
    let width = container.clientWidth || 420;
    let height = container.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    let targetCameraZ = 7.0;
    camera.position.set(0, 0, targetCameraZ);

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

    // Planet Root Group
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // 1. Seamless Spherical Planet Mesh
    const texture = getSeamlessPlanetTexture(destination.id);
    const planetGeometry = new THREE.SphereGeometry(2.1, 64, 64);
    const planetMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: destination.id === "europa" ? 0.4 : 0.7,
      metalness: destination.id === "earth" ? 0.15 : 0.05,
    });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetGroup.add(planetMesh);

    // 2. Earth Clouds layer if viewing Earth
    let cloudsMesh: THREE.Mesh | null = null;
    if (destination.id === "earth") {
      const cloudsTexture = getEarthCloudsTexture();
      const cloudsGeo = new THREE.SphereGeometry(2.13, 64, 64);
      const cloudsMat = new THREE.MeshStandardMaterial({
        map: cloudsTexture,
        transparent: true,
        opacity: 0.85,
        roughness: 0.9,
      });
      cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
      planetGroup.add(cloudsMesh);
    }

    // 3. 3D Surface Outpost Markers
    const outpostMeshes: { mesh: THREE.Group; outpost: OutpostPoint }[] = [];
    if (destination.outposts && destination.outposts.length > 0) {
      destination.outposts.forEach((outpost) => {
        const markerGroup = new THREE.Group();
        const phi = (90 - outpost.lat) * (Math.PI / 180);
        const theta = (outpost.lon + 180) * (Math.PI / 180);
        const radius = 2.13;

        const posX = -(radius * Math.sin(phi) * Math.cos(theta));
        const posZ = radius * Math.sin(phi) * Math.sin(theta);
        const posY = radius * Math.cos(phi);

        markerGroup.position.set(posX, posY, posZ);
        markerGroup.lookAt(0, 0, 0);

        const ringGeo = new THREE.RingGeometry(0.06, 0.09, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(destination.accentColor || "#38bdf8"),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.y = Math.PI;
        markerGroup.add(ring);

        const dotGeo = new THREE.CircleGeometry(0.04, 16);
        const dotMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
        });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.rotation.y = Math.PI;
        markerGroup.add(dot);

        const needleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.15, 8);
        const needleMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(destination.accentColor || "#38bdf8"),
        });
        const needle = new THREE.Mesh(needleGeo, needleMat);
        needle.position.z = 0.08;
        needle.rotation.x = Math.PI / 2;
        markerGroup.add(needle);

        planetGroup.add(markerGroup);
        outpostMeshes.push({ mesh: markerGroup, outpost });
      });
    }

    // 4. Atmospheric Fresnel Glow Shader
    const atmosphereGeometry = new THREE.SphereGeometry(2.26, 48, 48);
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
        uniform vec3 glowColor;
        void main() {
          float intensity = pow(0.66 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
          gl_FragColor = vec4(glowColor, 1.0) * intensity * 1.8;
        }
      `,
      uniforms: {
        glowColor: {
          value: new THREE.Color(destination.accentColor || "#38bdf8"),
        },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // 5. Lighting
    const keySun = new THREE.DirectionalLight(0xffffff, 2.6);
    keySun.position.set(5, 3.5, 4.5);
    scene.add(keySun);

    const spaceAmb = new THREE.AmbientLight(0x0a1020, 0.75);
    scene.add(spaceAmb);

    const rim = new THREE.DirectionalLight(new THREE.Color(destination.accentColor || "#38bdf8"), 1.3);
    rim.position.set(-5, -2, -3);
    scene.add(rim);

    // 360 Drag & Rotate
    let isDragging = false;
    let previousPosition = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousPosition = { x: e.clientX, y: e.clientY };
      velocity.x = 0;
      velocity.y = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousPosition.x;
      const deltaY = e.clientY - previousPosition.y;

      velocity.x = deltaX * 0.006;
      velocity.y = deltaY * 0.006;

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

    controlsRef.current = {
      zoomIn: () => {
        targetCameraZ = Math.max(4.5, targetCameraZ - 1.0);
      },
      zoomOut: () => {
        targetCameraZ = Math.min(10.5, targetCameraZ + 1.0);
      },
      resetRotation: () => {
        planetGroup.rotation.set(0, 0, 0);
        targetCameraZ = 7.0;
        velocity.x = 0;
        velocity.y = 0;
      },
    };

    const handleResize = () => {
      if (!container || !renderer) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      camera.position.z += (targetCameraZ - camera.position.z) * 0.1;

      if (!reducedMotion) {
        if (!isDragging) {
          planetGroup.rotation.y += velocity.x;
          planetGroup.rotation.x += velocity.y;
          velocity.x *= 0.94;
          velocity.y *= 0.94;

          if (autoRotate) {
            planetGroup.rotation.y += 0.0035;
          }
        }

        if (cloudsMesh) {
          cloudsMesh.rotation.y = elapsedTime * 0.03;
        }

        outpostMeshes.forEach(({ mesh }, i) => {
          const s = 1 + Math.sin(elapsedTime * 3 + i) * 0.15;
          mesh.scale.set(s, s, s);
        });
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

      planetGeometry.dispose();
      planetMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      if (cloudsMesh) {
        cloudsMesh.geometry.dispose();
      }
    };
  }, [destination.id, autoRotate, reducedMotion]);

  if (webglError) {
    return (
      <FallbackCanvas
        planetName={destination.name}
        accentColor={destination.accentColor}
        glowColor={destination.glowColor}
      />
    );
  }

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] md:h-[540px] flex flex-col items-center justify-center select-none">
      {/* 3D Canvas Mount */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
        aria-label={`Interactive 3D ${destination.name}. Drag to rotate 360°.`}
      />

      {/* Floating Tactical Controls Bar */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => controlsRef.current?.zoomIn()}
          className="p-2 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-sky-400 backdrop-blur-md transition-colors shadow-lg"
          aria-label="Zoom In"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => controlsRef.current?.zoomOut()}
          className="p-2 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-sky-400 backdrop-blur-md transition-colors shadow-lg"
          aria-label="Zoom Out"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-md border backdrop-blur-md transition-colors shadow-lg ${
            autoRotate
              ? "bg-sky-950/70 border-sky-400 text-sky-300"
              : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white"
          }`}
          aria-label={autoRotate ? "Pause Auto-Rotation" : "Enable Auto-Rotation"}
          title={autoRotate ? "Pause Auto-Rotation" : "Enable Auto-Rotation"}
        >
          {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={() => controlsRef.current?.resetRotation()}
          className="p-2 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-sky-400 backdrop-blur-md transition-colors shadow-lg"
          aria-label="Reset Orientation"
          title="Reset Orientation"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Drag Hint and Outpost Telemetry Ribbon */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="px-3 py-1.5 rounded-full bg-slate-950/85 border border-sky-500/30 backdrop-blur-md flex items-center gap-2 text-[11px] font-mono text-sky-300 shadow-md">
          <RotateCw className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: "10s" }} />
          <span>DRAG 360° TO EXPLORE SURFACE</span>
        </div>

        {destination.outposts && destination.outposts.length > 0 && (
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {destination.outposts.map((outpost) => (
              <button
                key={outpost.name}
                onClick={() => setActiveOutpost(activeOutpost?.name === outpost.name ? null : outpost)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono flex items-center gap-1.5 border transition-all ${
                  activeOutpost?.name === outpost.name
                    ? "bg-sky-500 text-slate-950 font-bold border-white shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                    : "bg-slate-950/85 border-slate-800 text-slate-300 hover:border-sky-400 hover:text-white"
                }`}
              >
                <MapPin className="w-3 h-3 text-sky-400" />
                <span className="truncate max-w-[120px]">{outpost.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {activeOutpost && (
        <div className="absolute top-4 left-4 z-20 p-3 rounded-lg bg-slate-950/95 border border-sky-400/50 shadow-2xl backdrop-blur-xl max-w-xs animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="font-orbitron font-bold text-xs text-white uppercase">
              {activeOutpost.name}
            </span>
            <span className="font-mono text-[9px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/30">
              {activeOutpost.status}
            </span>
          </div>
          <p className="text-[11px] text-sky-300 font-medium">
            {activeOutpost.type}
          </p>
          <div className="mt-1 text-[10px] font-mono text-slate-400">
            LAT: {activeOutpost.lat}° // LON: {activeOutpost.lon}°
          </div>
        </div>
      )}
    </div>
  );
}
