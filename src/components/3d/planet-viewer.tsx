"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Destination, OutpostPoint } from "@/data/destinations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useWebGLSupport } from "@/hooks/use-webgl-support";
import { FallbackCanvas } from "./fallback-canvas";
import {
  getPlanetMaterialMaps,
  getEarthCloudsTexture,
} from "@/lib/planet-textures";
import { RotateCw, ZoomIn, ZoomOut, Play, Pause, MapPin } from "lucide-react";

interface PlanetViewerProps {
  readonly destination: Destination;
  readonly stageProgress?: number;
}

export function PlanetViewer({
  destination,
  stageProgress = 0,
}: PlanetViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageProgressRef = useRef<number>(stageProgress);
  const [webglError, setWebglError] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedOutpost, setSelectedOutpost] = useState<{
    planetId: string;
    outpost: OutpostPoint;
  } | null>(null);
  const reducedMotion = useReducedMotion();
  const { supported: webglSupported, checking: webglChecking } =
    useWebGLSupport();

  const activeOutpost =
    selectedOutpost?.planetId === destination.id
      ? selectedOutpost.outpost
      : null;

  useEffect(() => {
    stageProgressRef.current = stageProgress;
  }, [stageProgress]);

  const controlsRef = useRef<{
    zoomIn: () => void;
    zoomOut: () => void;
    resetRotation: () => void;
  } | null>(null);

  useEffect(() => {
    if (webglChecking || !webglSupported) return;
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId = 0;

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
    let width = container.clientWidth || 420;
    let height = container.clientHeight || 384;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    const getAspectScale = (aspect: number) =>
      Math.max(1, 1.06 / Math.max(0.55, aspect));
    let userZoomOffset = 0;
    camera.position.set(0, 0, 7.9 * getAspectScale(width / height));

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(animationFrameId);
      setWebglError(true);
    };
    renderer.domElement.addEventListener(
      "webglcontextlost",
      handleContextLost,
      false
    );
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

    const sunDirection = new THREE.Vector3(5.5, 3.2, 4.5).normalize();

    const assemblyGroup = new THREE.Group();
    assemblyGroup.position.y = 0.08;
    scene.add(assemblyGroup);

    const planetGroup = new THREE.Group();
    assemblyGroup.add(planetGroup);

    // 1. High-Resolution PBR Planet Surface
    const maps = getPlanetMaterialMaps(destination.id);
    const planetRadius = 1.62;
    const bumpScaleByPlanet: Record<string, number> = {
      earth: 0.042,
      moon: 0.062,
      mars: 0.052,
      europa: 0.032,
      titan: 0.018,
    };

    const planetGeometry = trackGeo(
      new THREE.SphereGeometry(planetRadius, 72, 72)
    );
    const planetMaterial = trackMat(
      new THREE.MeshStandardMaterial({
        map: maps.map,
        bumpMap: maps.bumpMap,
        bumpScale: bumpScaleByPlanet[destination.id] ?? 0.04,
        roughnessMap: maps.roughnessMap,
        roughness: destination.id === "europa" ? 0.58 : 0.9,
        metalness: destination.id === "earth" ? 0.08 : 0.04,
      })
    );
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetGroup.add(planetMesh);

    // Earth Night-Side Orbital & City Lights
    if (destination.id === "earth" && maps.nightMap) {
      const nightGeo = trackGeo(new THREE.SphereGeometry(1.624, 64, 64));
      const nightMat = trackMat(
        new THREE.ShaderMaterial({
          uniforms: {
            nightTex: { value: maps.nightMap },
            sunDir: { value: sunDirection },
          },
          vertexShader: `
            varying vec2 vUv;
            varying vec3 vWorldNormal;
            void main() {
              vUv = uv;
              vWorldNormal = normalize(mat3(modelMatrix) * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D nightTex;
            uniform vec3 sunDir;
            varying vec2 vUv;
            varying vec3 vWorldNormal;
            void main() {
              float sunDot = dot(normalize(vWorldNormal), normalize(sunDir));
              float nightMask = smoothstep(0.12, -0.28, sunDot);
              vec3 lights = texture2D(nightTex, vUv).rgb * nightMask * 1.45;
              gl_FragColor = vec4(lights, nightMask);
            }
          `,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        })
      );
      planetGroup.add(new THREE.Mesh(nightGeo, nightMat));
    }

    // Dynamic Cloud / Photochemical Haze Layer
    let cloudsMesh: THREE.Mesh | null = null;
    if (destination.id === "earth") {
      const cloudsTexture = getEarthCloudsTexture();
      const cloudsGeo = trackGeo(new THREE.SphereGeometry(1.644, 64, 64));
      const cloudsMat = trackMat(
        new THREE.MeshStandardMaterial({
          map: cloudsTexture,
          transparent: true,
          opacity: 0.84,
          roughness: 0.88,
          depthWrite: false,
        })
      );
      cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
      planetGroup.add(cloudsMesh);
    } else if (destination.id === "titan") {
      const hazeGeo = trackGeo(new THREE.SphereGeometry(1.646, 64, 64));
      const hazeMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0xe69532,
          transparent: true,
          opacity: 0.28,
          roughness: 0.72,
          depthWrite: false,
        })
      );
      cloudsMesh = new THREE.Mesh(hazeGeo, hazeMat);
      planetGroup.add(cloudsMesh);
    }

    // 2. 3D Radial Surface Outpost Telemetry Pins
    const outpostPulseRings: THREE.Mesh[] = [];
    const pinLineMat = trackMat(
      new THREE.LineBasicMaterial({
        color: 0xff3b1d,
        transparent: true,
        opacity: 0.85,
      })
    );
    const tipMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xf4f4f0 }));
    const ringMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xff3b1d,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.92,
      })
    );

    destination.outposts.forEach((outpost) => {
      const markerGroup = new THREE.Group();
      const phi = (90 - outpost.lat) * (Math.PI / 180);
      const theta = (outpost.lon + 180) * (Math.PI / 180);

      const normalVec = new THREE.Vector3(
        -(Math.sin(phi) * Math.cos(theta)),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      ).normalize();

      const surfacePos = normalVec.clone().multiplyScalar(planetRadius + 0.012);
      const tipPos = normalVec.clone().multiplyScalar(planetRadius + 0.14);

      // Radial telemetry laser stem
      const stemGeo = trackGeo(
        new THREE.BufferGeometry().setFromPoints([surfacePos, tipPos])
      );
      planetGroup.add(new THREE.Line(stemGeo, pinLineMat));

      // Tip beacon node
      const tipMesh = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.024, 12, 12)),
        tipMat
      );
      tipMesh.position.copy(tipPos);
      planetGroup.add(tipMesh);

      // Surface target reticle
      markerGroup.position.copy(surfacePos);
      markerGroup.lookAt(0, 0, 0);

      const ring = new THREE.Mesh(
        trackGeo(new THREE.RingGeometry(0.04, 0.066, 24)),
        ringMat
      );
      ring.rotation.y = Math.PI;
      markerGroup.add(ring);
      outpostPulseRings.push(ring);

      planetGroup.add(markerGroup);
    });

    // 3. Seamless Dual-Layer Atmospheric Scattering (airless Moon uses subtle albedo rim)
    const isAirless = destination.id === "moon";
    const glowColor = new THREE.Color(destination.accentColor || "#f4f4f0");

    const innerRimGeo = trackGeo(new THREE.SphereGeometry(1.652, 64, 64));
    const innerRimMat = trackMat(
      new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: glowColor },
          sunDir: { value: sunDirection },
          strength: { value: isAirless ? 0.22 : 0.92 },
        },
        vertexShader: `
          varying vec3 vViewNormal;
          varying vec3 vWorldNormal;
          void main() {
            vViewNormal = normalize(normalMatrix * normal);
            vWorldNormal = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          uniform vec3 sunDir;
          uniform float strength;
          varying vec3 vViewNormal;
          varying vec3 vWorldNormal;
          void main() {
            float fresnel = pow(1.0 - max(dot(vViewNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.4);
            float sunMask = smoothstep(-0.35, 0.65, dot(vWorldNormal, sunDir));
            gl_FragColor = vec4(glowColor * fresnel * (0.18 + sunMask * 0.85) * strength, 1.0);
          }
        `,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      })
    );
    assemblyGroup.add(new THREE.Mesh(innerRimGeo, innerRimMat));

    if (!isAirless) {
      const outerHaloGeo = trackGeo(new THREE.SphereGeometry(1.76, 64, 64));
      const outerHaloMat = trackMat(
        new THREE.ShaderMaterial({
          uniforms: {
            glowColor: { value: glowColor },
            sunDir: { value: sunDirection },
          },
          vertexShader: `
            varying vec3 vViewNormal;
            varying vec3 vWorldNormal;
            void main() {
              vViewNormal = normalize(normalMatrix * normal);
              vWorldNormal = normalize(mat3(modelMatrix) * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 glowColor;
            uniform vec3 sunDir;
            varying vec3 vViewNormal;
            varying vec3 vWorldNormal;
            void main() {
              float limb = clamp(-vViewNormal.z * 2.2, 0.0, 1.0);
              float falloff = pow(limb, 3.0);
              float sunMask = smoothstep(-0.4, 0.6, dot(vWorldNormal, sunDir));
              gl_FragColor = vec4(glowColor * falloff * (0.15 + sunMask * 0.75), 1.0);
            }
          `,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
          transparent: true,
          depthWrite: false,
        })
      );
      assemblyGroup.add(new THREE.Mesh(outerHaloGeo, outerHaloMat));
    }

    // 4. Orbital Survey Telemetry Rings & Autonomous Reconnaissance Probe
    const datumTicks: THREE.Vector3[] = [];
    const datumR = 1.9;
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      const rIn = i % 6 === 0 ? datumR - 0.035 : datumR - 0.014;
      const rOut = i % 6 === 0 ? datumR + 0.035 : datumR + 0.014;
      datumTicks.push(
        new THREE.Vector3(Math.cos(a) * rIn, 0, Math.sin(a) * rIn),
        new THREE.Vector3(Math.cos(a) * rOut, 0, Math.sin(a) * rOut)
      );
    }
    const datumRing = new THREE.LineSegments(
      trackGeo(new THREE.BufferGeometry().setFromPoints(datumTicks)),
      trackMat(
        new THREE.LineBasicMaterial({
          color: 0xc8ccd6,
          transparent: true,
          opacity: 0.22,
        })
      )
    );
    datumRing.rotation.x = 0.24;
    datumRing.rotation.z = -0.18;
    assemblyGroup.add(datumRing);

    // Inclined Polar Survey Trajectory + Scanning Satellite
    const surveyOrbitR = 2.02;
    const surveyPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      surveyPts.push(
        new THREE.Vector3(
          Math.cos(a) * surveyOrbitR,
          Math.sin(a) * (surveyOrbitR * 0.38),
          Math.sin(a) * (surveyOrbitR * 0.92)
        )
      );
    }
    const surveyLine = new THREE.Line(
      trackGeo(new THREE.BufferGeometry().setFromPoints(surveyPts)),
      trackMat(
        new THREE.LineBasicMaterial({
          color: 0xff3b1d,
          transparent: true,
          opacity: 0.42,
        })
      )
    );
    surveyLine.rotation.z = 0.52;
    assemblyGroup.add(surveyLine);

    const probeGroup = new THREE.Group();
    const probeBody = new THREE.Mesh(
      trackGeo(new THREE.OctahedronGeometry(0.038, 0)),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: 0xf4f4f0,
          metalness: 0.8,
          roughness: 0.2,
        })
      )
    );
    const probeWings = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.24, 0.008, 0.04)),
      trackMat(new THREE.MeshBasicMaterial({ color: 0xff3b1d }))
    );
    probeGroup.add(probeBody);
    probeGroup.add(probeWings);
    assemblyGroup.add(probeGroup);

    // 5. Studio Aerospace Sun & Rim Lighting
    const keySun = new THREE.DirectionalLight(0xfffdf8, 2.95);
    keySun.position.set(5.5, 3.2, 4.5);
    scene.add(keySun);

    const spaceAmb = new THREE.AmbientLight(0x121520, 0.56);
    scene.add(spaceAmb);

    const rim = new THREE.DirectionalLight(glowColor, 0.85);
    rim.position.set(-5, -2, -3.5);
    scene.add(rim);

    let isDragging = false;
    let previousPosition = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };
    let baseYaw = 0.4;

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

      baseYaw += velocity.x;
      planetGroup.rotation.x = Math.max(
        -0.85,
        Math.min(0.85, planetGroup.rotation.x + velocity.y)
      );

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
        userZoomOffset = Math.max(-1.25, userZoomOffset - 0.55);
      },
      zoomOut: () => {
        userZoomOffset = Math.min(2.2, userZoomOffset + 0.55);
      },
      resetRotation: () => {
        baseYaw = 0.4;
        planetGroup.rotation.set(0, 0, 0);
        userZoomOffset = 0;
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
      const scrub = stageProgressRef.current;

      const aspectScale = getAspectScale(camera.aspect);
      const stageZoom =
        (7.9 - Math.sin(scrub * Math.PI) * 0.52 + userZoomOffset) * aspectScale;
      camera.position.z += (stageZoom - camera.position.z) * 0.1;

      if (!reducedMotion) {
        if (!isDragging) {
          baseYaw += velocity.x;
          planetGroup.rotation.x += velocity.y;
          velocity.x *= 0.94;
          velocity.y *= 0.94;

          if (autoRotate) {
            baseYaw += 0.0022;
          }
        }

        planetGroup.rotation.y = baseYaw + scrub * 1.9;
        datumRing.rotation.y = -elapsedTime * 0.04;

        if (cloudsMesh) {
          cloudsMesh.rotation.y = baseYaw * 1.08 + elapsedTime * 0.018 + scrub * 0.5;
        }

        const pAngle = elapsedTime * 0.45 + scrub * 2.2;
        const pVec = new THREE.Vector3(
          Math.cos(pAngle) * surveyOrbitR,
          Math.sin(pAngle) * (surveyOrbitR * 0.38),
          Math.sin(pAngle) * (surveyOrbitR * 0.92)
        ).applyAxisAngle(new THREE.Vector3(0, 0, 1), 0.52);
        probeGroup.position.copy(pVec);
        probeGroup.rotation.y = -pAngle;

        outpostPulseRings.forEach((ring, i) => {
          const s = 1 + Math.sin(elapsedTime * 3.2 + i) * 0.16;
          ring.scale.set(s, s, 1);
        });
      }

      renderer?.render(scene, camera);
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

      disposableGeometries.forEach((g) => g.dispose());
      disposableMaterials.forEach((m) => m.dispose());
    };
  }, [destination, autoRotate, reducedMotion, webglChecking, webglSupported]);

  if (!webglSupported || webglError) {
    return (
      <FallbackCanvas
        planetName={destination.name}
        accentColor={destination.accentColor}
      />
    );
  }

  return (
    <div className="relative w-full h-76 sm:h-88 lg:h-96 flex flex-col items-center justify-center select-none">
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
        aria-label={`Interactive 3D ${destination.name} model. Drag to rotate.`}
      />

      {/* Industrial Optical Controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col border border-hairline-strong bg-carbon/90 divide-y divide-hairline">
        <button
          type="button"
          onClick={() => controlsRef.current?.zoomIn()}
          className="p-2 text-titanium hover:text-bone hover:bg-graphite transition-colors cursor-pointer"
          aria-label="Zoom In"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => controlsRef.current?.zoomOut()}
          className="p-2 text-titanium hover:text-bone hover:bg-graphite transition-colors cursor-pointer"
          aria-label="Zoom Out"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 transition-colors cursor-pointer ${
            autoRotate
              ? "text-signal bg-signal-muted"
              : "text-titanium hover:text-bone hover:bg-graphite"
          }`}
          aria-label={autoRotate ? "Pause Orbital Spin" : "Resume Orbital Spin"}
          aria-pressed={autoRotate}
          title={autoRotate ? "Pause Orbital Spin" : "Resume Orbital Spin"}
        >
          {autoRotate ? (
            <Pause className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <Play className="w-3.5 h-3.5" aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          onClick={() => controlsRef.current?.resetRotation()}
          className="p-2 text-titanium hover:text-bone hover:bg-graphite transition-colors cursor-pointer"
          aria-label="Reset Datum Axis"
          title="Reset Datum Axis"
        >
          <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Surface Outpost Beacons Selector */}
      {destination.outposts.length > 0 && (
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex flex-wrap items-center justify-between gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 bg-carbon/90 border border-hairline text-3xs font-mono text-ash uppercase tracking-widest">
            SURFACE SITES ({destination.outposts.length})
          </span>

          <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
            {destination.outposts.map((outpost) => {
              const isSelected = activeOutpost?.name === outpost.name;
              return (
                <button
                  key={outpost.name}
                  type="button"
                  onClick={() =>
                    setSelectedOutpost(
                      isSelected
                        ? null
                        : { planetId: destination.id, outpost }
                    )
                  }
                  className={`px-2 py-0.5 rounded-none text-3xs font-mono uppercase tracking-wider flex items-center gap-1.5 border transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-signal text-bone border-signal font-semibold"
                      : "bg-carbon/90 border-hairline-strong text-titanium hover:border-bone hover:text-bone"
                  }`}
                >
                  <MapPin
                    className={`w-2.5 h-2.5 ${
                      isSelected ? "text-bone" : "text-signal"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="truncate max-w-32">{outpost.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Outpost Telemetry Callout */}
      {activeOutpost && (
        <div className="absolute top-3 left-3 z-20 p-3 bg-carbon/95 border border-signal max-w-xs">
          <div className="flex items-center justify-between gap-3 border-b border-hairline pb-1.5 mb-1.5">
            <span className="font-display font-bold text-xs text-bone uppercase">
              {activeOutpost.name}
            </span>
            <span className="font-mono text-3xs text-signal font-semibold uppercase">
              {activeOutpost.status}
            </span>
          </div>
          <p className="text-xs text-titanium">{activeOutpost.type}</p>
          <div className="mt-1 text-3xs font-mono text-ash tabular-nums">
            LAT {activeOutpost.lat}° — LON {activeOutpost.lon}°
          </div>
        </div>
      )}
    </div>
  );
}
