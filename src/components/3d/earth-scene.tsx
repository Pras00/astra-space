"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useWebGLSupport } from "@/hooks/use-webgl-support";
import { FallbackCanvas } from "./fallback-canvas";
import {
  getPlanetMaterialMaps,
  getEarthCloudsTexture,
} from "@/lib/planet-textures";
import { Move } from "lucide-react";

interface EarthSceneProps {
  readonly scrollProgress?: number;
}

export function EarthScene({ scrollProgress = 0 }: EarthSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef<number>(scrollProgress);
  const [webglError, setWebglError] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const reducedMotion = useReducedMotion();
  const { supported: webglSupported, checking: webglChecking } =
    useWebGLSupport();

  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

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
    let width = container.clientWidth || 500;
    let height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    const getAspectScale = (aspect: number) =>
      Math.max(1, 1.08 / Math.max(0.55, aspect));
    camera.position.set(0, 0, 8.9 * getAspectScale(width / height));

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

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

    const sunDirection = new THREE.Vector3(6, 3.2, 4.8).normalize();

    // Axial tilt group (23.4 deg obliquity)
    const axialTiltGroup = new THREE.Group();
    axialTiltGroup.rotation.z = -0.22;
    scene.add(axialTiltGroup);

    const planetGroup = new THREE.Group();
    axialTiltGroup.add(planetGroup);

    // 1. High-Detail PBR Earth Sphere (1024x512 diffuse + bump + specular roughness)
    const earthMaps = getPlanetMaterialMaps("earth");
    const earthGeometry = trackGeo(new THREE.SphereGeometry(1.58, 72, 72));
    const earthMaterial = trackMat(
      new THREE.MeshStandardMaterial({
        map: earthMaps.map,
        bumpMap: earthMaps.bumpMap,
        bumpScale: 0.042,
        roughnessMap: earthMaps.roughnessMap,
        roughness: 0.92,
        metalness: 0.08,
      })
    );
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    planetGroup.add(earthMesh);

    // 2. Night-Side Coastal & Spaceport City Lights (strictly on dark hemisphere)
    if (earthMaps.nightMap) {
      const nightGeo = trackGeo(new THREE.SphereGeometry(1.584, 64, 64));
      const nightMat = trackMat(
        new THREE.ShaderMaterial({
          uniforms: {
            nightTex: { value: earthMaps.nightMap },
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

    // 3. Dynamic Coriolis Cloud Layer
    const cloudsTexture = getEarthCloudsTexture();
    const cloudsGeometry = trackGeo(new THREE.SphereGeometry(1.604, 64, 64));
    const cloudsMaterial = trackMat(
      new THREE.MeshStandardMaterial({
        map: cloudsTexture,
        transparent: true,
        opacity: 0.84,
        roughness: 0.88,
        depthWrite: false,
      })
    );
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    planetGroup.add(cloudsMesh);

    // 4A. Inner Surface Rayleigh Scattering Rim (FrontSide, seamless horizon wrap)
    const innerAtmoGeo = trackGeo(new THREE.SphereGeometry(1.616, 64, 64));
    const innerAtmoMat = trackMat(
      new THREE.ShaderMaterial({
        uniforms: {
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
          uniform vec3 sunDir;
          varying vec3 vViewNormal;
          varying vec3 vWorldNormal;
          void main() {
            float fresnel = pow(1.0 - max(dot(vViewNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.4);
            float sunLight = smoothstep(-0.35, 0.65, dot(vWorldNormal, sunDir));
            vec3 dayScatter = vec3(0.28, 0.62, 0.98);
            vec3 duskScatter = vec3(0.95, 0.36, 0.18);
            float twilight = smoothstep(-0.3, 0.05, dot(vWorldNormal, sunDir)) *
                             (1.0 - smoothstep(0.05, 0.45, dot(vWorldNormal, sunDir)));
            vec3 col = mix(dayScatter, duskScatter, twilight * 0.55);
            gl_FragColor = vec4(col * fresnel * (0.2 + sunLight * 0.95), 1.0);
          }
        `,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      })
    );
    scene.add(new THREE.Mesh(innerAtmoGeo, innerAtmoMat));

    // 4B. Outer Exponential Atmospheric Halo (BackSide, strictly zero at outer edge)
    const outerAtmoGeo = trackGeo(new THREE.SphereGeometry(1.72, 64, 64));
    const outerAtmoMat = trackMat(
      new THREE.ShaderMaterial({
        uniforms: {
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
          uniform vec3 sunDir;
          varying vec3 vViewNormal;
          varying vec3 vWorldNormal;
          void main() {
            // On BackSide, vViewNormal.z is 0 at outer silhouette and negative inward
            float limb = clamp(-vViewNormal.z * 2.25, 0.0, 1.0);
            float falloff = pow(limb, 3.0);
            float sunMask = smoothstep(-0.4, 0.6, dot(vWorldNormal, sunDir));
            vec3 haloColor = vec3(0.32, 0.66, 1.0);
            gl_FragColor = vec4(haloColor * falloff * (0.18 + sunMask * 0.82), 1.0);
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      })
    );
    scene.add(new THREE.Mesh(outerAtmoGeo, outerAtmoMat));

    // 5. Equatorial LEO Staging Ring with 72 Precision Degree Ticks
    const leoTickPoints: THREE.Vector3[] = [];
    const leoRadius = 1.82;
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      const inner = i % 6 === 0 ? leoRadius - 0.035 : leoRadius - 0.016;
      const outer = i % 6 === 0 ? leoRadius + 0.035 : leoRadius + 0.016;
      leoTickPoints.push(
        new THREE.Vector3(Math.cos(a) * inner, 0, Math.sin(a) * inner),
        new THREE.Vector3(Math.cos(a) * outer, 0, Math.sin(a) * outer)
      );
    }
    const leoTicksGeo = trackGeo(
      new THREE.BufferGeometry().setFromPoints(leoTickPoints)
    );
    const leoTicksMat = trackMat(
      new THREE.LineBasicMaterial({
        color: 0xc8ccd6,
        transparent: true,
        opacity: 0.26,
      })
    );
    const leoTicks = new THREE.LineSegments(leoTicksGeo, leoTicksMat);
    axialTiltGroup.add(leoTicks);

    // 6. Precision Cislunar Transfer Trajectory Ring (Signal Orange)
    const orbitRadiusX = 2.22;
    const orbitRadiusY = 1.9;
    const curvePoints: THREE.Vector3[] = [];
    const segments = 160;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      curvePoints.push(
        new THREE.Vector3(
          Math.cos(theta) * orbitRadiusX,
          Math.sin(theta) * 0.22,
          Math.sin(theta) * orbitRadiusY
        )
      );
    }
    const orbitGeometry = trackGeo(
      new THREE.BufferGeometry().setFromPoints(curvePoints)
    );
    const orbitMaterial = trackMat(
      new THREE.LineBasicMaterial({
        color: 0xff3b1d,
        transparent: true,
        opacity: 0.72,
      })
    );
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitLine.rotation.x = 0.34;
    orbitLine.rotation.z = -0.22;
    scene.add(orbitLine);

    // Secondary Orbital Harmonics Guide Ring
    const secondaryOrbit = new THREE.Line(
      orbitGeometry,
      trackMat(
        new THREE.LineBasicMaterial({
          color: 0xf4f4f0,
          transparent: true,
          opacity: 0.14,
        })
      )
    );
    secondaryOrbit.rotation.x = -0.28;
    secondaryOrbit.rotation.z = 0.32;
    secondaryOrbit.scale.setScalar(0.92);
    scene.add(secondaryOrbit);

    // 7. Detailed Orbiting Cislunar Transfer Vehicle
    const satGroup = new THREE.Group();
    const satHullMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf4f4f0,
        metalness: 0.75,
        roughness: 0.25,
      })
    );
    const satPanelMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x162238,
        metalness: 0.6,
        roughness: 0.3,
      })
    );
    const satSignalMat = trackMat(
      new THREE.MeshBasicMaterial({ color: 0xff3b1d })
    );

    const satCore = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.036, 0.042, 0.18, 12)),
      satHullMat
    );
    satCore.rotation.x = Math.PI / 2;
    satGroup.add(satCore);

    const satNose = new THREE.Mesh(
      trackGeo(new THREE.ConeGeometry(0.036, 0.065, 12)),
      satHullMat
    );
    satNose.rotation.x = Math.PI / 2;
    satNose.position.z = 0.12;
    satGroup.add(satNose);

    const satSolarLeft = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.22, 0.008, 0.065)),
      satPanelMat
    );
    satSolarLeft.position.x = -0.15;
    satGroup.add(satSolarLeft);

    const satSolarRight = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.22, 0.008, 0.065)),
      satPanelMat
    );
    satSolarRight.position.x = 0.15;
    satGroup.add(satSolarRight);

    const satTrim = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.52, 0.01, 0.01)),
      satSignalMat
    );
    satGroup.add(satTrim);

    const satPlume = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.022, 8, 8)),
      satSignalMat
    );
    satPlume.position.z = -0.1;
    satGroup.add(satPlume);
    scene.add(satGroup);

    // 8. High-Relief Cratered Moon Target
    const moonMaps = getPlanetMaterialMaps("moon");
    const moonGeometry = trackGeo(new THREE.SphereGeometry(0.28, 48, 48));
    const moonMaterial = trackMat(
      new THREE.MeshStandardMaterial({
        map: moonMaps.map,
        bumpMap: moonMaps.bumpMap,
        bumpScale: 0.025,
        roughness: 0.92,
      })
    );
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.set(1.95, 1.52, -2.05);
    scene.add(moonMesh);

    // 9. High-Contrast Orbital Sun & Rim Lighting
    const sunLight = new THREE.DirectionalLight(0xfffdf8, 3.1);
    sunLight.position.set(6, 3.2, 4.8);
    scene.add(sunLight);

    const spaceLight = new THREE.AmbientLight(0x101420, 0.52);
    scene.add(spaceLight);

    const rimLight = new THREE.DirectionalLight(0x4a78b8, 0.65);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);

    let isDragging = false;
    let previousPosition = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };
    let baseYaw = 0.6;

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

      baseYaw += velocity.x;
      planetGroup.rotation.x = Math.max(
        -0.75,
        Math.min(0.75, planetGroup.rotation.x + velocity.y)
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
      const scrub = scrollProgressRef.current;

      const aspectScale = getAspectScale(camera.aspect);
      const targetZ = (8.9 - scrub * 1.05) * aspectScale;
      camera.position.z += (targetZ - camera.position.z) * 0.08;
      camera.position.y += (scrub * 0.2 - camera.position.y) * 0.08;

      if (!reducedMotion) {
        if (!isDragging) {
          baseYaw += velocity.x + 0.0018;
          planetGroup.rotation.x += velocity.y;
          velocity.x *= 0.94;
          velocity.y *= 0.94;
        }

        planetGroup.rotation.y = baseYaw + scrub * 1.35;
        cloudsMesh.rotation.y = elapsedTime * 0.022 + scrub * 0.45;
        leoTicks.rotation.y = -elapsedTime * 0.04;
        moonMesh.rotation.y = elapsedTime * 0.05;

        const satAngle = elapsedTime * 0.26 + scrub * 1.8;
        const rawX = Math.cos(satAngle) * orbitRadiusX;
        const rawY = Math.sin(satAngle) * 0.22;
        const rawZ = Math.sin(satAngle) * orbitRadiusY;

        const satPos = new THREE.Vector3(rawX, rawY, rawZ)
          .applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.34)
          .applyAxisAngle(new THREE.Vector3(0, 0, 1), -0.22);
        satGroup.position.copy(satPos);
        satGroup.rotation.y = -satAngle;
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
  }, [reducedMotion, webglChecking, webglSupported]);

  if (!webglSupported || webglError) {
    return <FallbackCanvas planetName="EARTH" accentColor="#38bdf8" />;
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
      <div
        ref={containerRef}
        className="w-full h-96 sm:h-112 md:h-124 lg:h-136 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
        aria-label="Interactive 3D Earth cislunar orbital model. Drag to rotate."
      />

      <div
        className={`absolute bottom-3 right-3 px-2.5 py-1 border border-hairline-strong bg-carbon/90 flex items-center gap-2 text-3xs font-mono uppercase tracking-widest text-ash pointer-events-none transition-opacity duration-500 ${
          hasInteracted ? "opacity-35" : "opacity-90"
        }`}
      >
        <Move className="w-3 h-3 text-signal" aria-hidden="true" />
        <span>DRAG ORBIT — 360°</span>
      </div>
    </div>
  );
}
