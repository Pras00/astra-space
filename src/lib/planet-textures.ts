import * as THREE from "three";

// Fast, continuous 3D Gradient Noise with FBM & Ridged Multifractal octaves
class FastNoise3D {
  private readonly perm: Uint8Array;

  constructor(seed = 42) {
    this.perm = new Uint8Array(512);
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let s = seed;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = Math.floor((s / 2147483647) * (i + 1));
      const temp = p[i];
      p[i] = p[j];
      p[j] = temp;
    }
    for (let i = 0; i < 256; i++) {
      this.perm[i] = p[i];
      this.perm[i + 256] = p[i];
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number, z: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise(x: number, y: number, z: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);

    const A = this.perm[X] + Y;
    const AA = this.perm[A] + Z;
    const AB = this.perm[A + 1] + Z;
    const B = this.perm[X + 1] + Y;
    const BA = this.perm[B] + Z;
    const BB = this.perm[B + 1] + Z;

    return this.lerp(
      w,
      this.lerp(
        v,
        this.lerp(
          u,
          this.grad(this.perm[AA], x, y, z),
          this.grad(this.perm[BA], x - 1, y, z)
        ),
        this.lerp(
          u,
          this.grad(this.perm[AB], x, y - 1, z),
          this.grad(this.perm[BB], x - 1, y - 1, z)
        )
      ),
      this.lerp(
        v,
        this.lerp(
          u,
          this.grad(this.perm[AA + 1], x, y, z - 1),
          this.grad(this.perm[BA + 1], x - 1, y, z - 1)
        ),
        this.lerp(
          u,
          this.grad(this.perm[AB + 1], x, y - 1, z - 1),
          this.grad(this.perm[BB + 1], x - 1, y - 1, z - 1)
        )
      )
    );
  }

  fbm(x: number, y: number, z: number, octaves = 4): number {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;
    for (let i = 0; i < octaves; i++) {
      total +=
        this.noise(x * frequency, y * frequency, z * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2.04;
    }
    return total / maxValue;
  }

  ridged(x: number, y: number, z: number, octaves = 4): number {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;
    for (let i = 0; i < octaves; i++) {
      const n = 1 - Math.abs(this.noise(x * frequency, y * frequency, z * frequency));
      total += n * n * amplitude;
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2.12;
    }
    return total / maxValue;
  }
}

export interface PlanetMapBundle {
  readonly map: THREE.CanvasTexture;
  readonly bumpMap: THREE.CanvasTexture;
  readonly roughnessMap: THREE.CanvasTexture;
  readonly nightMap?: THREE.CanvasTexture;
}

export interface HullMaterialMaps {
  readonly map: THREE.CanvasTexture;
  readonly bumpMap: THREE.CanvasTexture;
  readonly roughnessMap: THREE.CanvasTexture;
}

const planetBundleCache: Record<string, PlanetMapBundle> = {};
const singleTextureCache: Record<string, THREE.CanvasTexture> = {};
let cachedHullMaps: HullMaterialMaps | null = null;
let cachedArrayMaps: HullMaterialMaps | null = null;

function clampByte(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v | 0;
}

function finalizeTexture(
  canvas: HTMLCanvasElement,
  isSrgb: boolean,
  repeat = false
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = repeat ? THREE.RepeatWrapping : THREE.RepeatWrapping;
  tex.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  tex.colorSpace = isSrgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

export function getPlanetMaterialMaps(type: string): PlanetMapBundle {
  if (planetBundleCache[type]) {
    return planetBundleCache[type];
  }

  const width = 1024;
  const height = 512;

  const diffCanvas = document.createElement("canvas");
  diffCanvas.width = width;
  diffCanvas.height = height;
  const diffCtx = diffCanvas.getContext("2d")!;
  const diffImg = diffCtx.createImageData(width, height);
  const diffData = diffImg.data;

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bumpCtx = bumpCanvas.getContext("2d")!;
  const bumpImg = bumpCtx.createImageData(width, height);
  const bumpData = bumpImg.data;

  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = width;
  roughCanvas.height = height;
  const roughCtx = roughCanvas.getContext("2d")!;
  const roughImg = roughCtx.createImageData(width, height);
  const roughData = roughImg.data;

  const isEarth = type === "earth";
  const nightCanvas = isEarth ? document.createElement("canvas") : null;
  if (nightCanvas) {
    nightCanvas.width = width;
    nightCanvas.height = height;
  }
  const nightCtx = nightCanvas ? nightCanvas.getContext("2d")! : null;
  const nightImg = nightCtx ? nightCtx.createImageData(width, height) : null;
  const nightData = nightImg ? nightImg.data : null;

  const seed =
    type === "mars"
      ? 101
      : type === "moon"
      ? 202
      : type === "europa"
      ? 303
      : type === "titan"
      ? 404
      : 505;
  const noise = new FastNoise3D(seed);
  const detailNoise = new FastNoise3D(seed + 77);

  for (let y = 0; y < height; y++) {
    const lat = (y / height - 0.5) * Math.PI;
    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);
    const absLat = Math.abs(sinLat);

    for (let x = 0; x < width; x++) {
      const lon = (x / width) * Math.PI * 2;
      const nx = cosLat * Math.cos(lon);
      const ny = sinLat;
      const nz = cosLat * Math.sin(lon);

      // Tectonic domain warp for realistic coastlines, canyons, and ridges
      const warp = noise.fbm(nx * 1.9, ny * 1.9, nz * 1.9, 2) * 0.32;
      const wx = nx + warp;
      const wy = ny + warp * 0.65;
      const wz = nz - warp;

      const idx = (y * width + x) * 4;
      let r = 128;
      let g = 128;
      let b = 128;
      let bumpVal = 128;
      let roughVal = 190;

      if (type === "earth") {
        const continent = noise.fbm(wx * 2.15, wy * 2.15, wz * 2.15, 5);
        const mountainRidge = detailNoise.ridged(wx * 5.2, wy * 5.2, wz * 5.2, 3);
        const micro = detailNoise.noise(nx * 18, ny * 18, nz * 18) * 0.04;
        const elev = continent + micro;

        if (elev < 0.035) {
          // Abyssal & Pelagic Ocean with bathymetric trench variation
          const depth = Math.max(0, Math.min(1, (elev + 0.48) / 0.515));
          const shelf = Math.pow(depth, 2.4);
          r = 4 + shelf * 18;
          g = 18 + shelf * 58;
          b = 46 + shelf * 88;
          bumpVal = 70 + depth * 22;
          roughVal = 52; // Gleaming solar ocean glint
        } else if (elev < 0.062) {
          // Turquoise Continental Shelf & Reefs
          const t = (elev - 0.035) / 0.027;
          r = 18 + t * 24;
          g = 76 + t * 32;
          b = 124 - t * 28;
          bumpVal = 96;
          roughVal = 78;
        } else {
          // Landmasses: Arid belts, temperate forests, and alpine ranges
          const landH = Math.min(1, (elev - 0.062) / 0.34);
          const aridity = Math.max(
            0,
            Math.min(
              1,
              1 - Math.abs(absLat - 0.36) * 3.4 + detailNoise.noise(wx * 4, wy * 4, wz * 4) * 0.35
            )
          );

          // Forest base vs Desert ochre
          const forestR = 26 + landH * 34;
          const forestG = 62 + landH * 38;
          const forestB = 30 + landH * 20;

          const desertR = 146 + landH * 36;
          const desertG = 116 + landH * 28;
          const desertB = 74 + landH * 20;

          r = forestR * (1 - aridity * 0.72) + desertR * (aridity * 0.72);
          g = forestG * (1 - aridity * 0.72) + desertG * (aridity * 0.72);
          b = forestB * (1 - aridity * 0.72) + desertB * (aridity * 0.72);

          // Tectonic mountain spines
          const alpine = Math.max(0, mountainRidge - 0.52) * 2.1 * (0.4 + landH);
          if (alpine > 0.25) {
            const snow = Math.min(1, (alpine - 0.25) * 1.4);
            r = r * (1 - snow) + 195 * snow;
            g = g * (1 - snow) + 198 * snow;
            b = b * (1 - snow) + 205 * snow;
          }

          bumpVal = 118 + landH * 75 + mountainRidge * 58;
          roughVal = 212;

          // Night-side coastal & mid-latitude orbital launch/city clusters
          if (nightData && absLat < 0.72) {
            const coastalFactor = elev < 0.14 ? 1.35 : 0.75;
            const cluster = detailNoise.ridged(nx * 14, ny * 14, nz * 14, 3);
            const spark = detailNoise.noise(nx * 46, ny * 46, nz * 46);
            const cityIntensity =
              cluster > 0.74 && spark > 0.08
                ? Math.min(1, (cluster - 0.74) * 4.5 * coastalFactor)
                : 0;
            nightData[idx] = clampByte(cityIntensity * 255);
            nightData[idx + 1] = clampByte(cityIntensity * 176);
            nightData[idx + 2] = clampByte(cityIntensity * 92);
            nightData[idx + 3] = 255;
          }
        }

        // Polar Ice Caps with jagged sea-ice edge
        const iceThreshold = 0.8 + detailNoise.noise(nx * 9, ny * 9, nz * 9) * 0.05;
        if (absLat > iceThreshold) {
          const ice = Math.min(1, (absLat - iceThreshold) / 0.12);
          r = r * (1 - ice) + 236 * ice;
          g = g * (1 - ice) + 244 * ice;
          b = b * (1 - ice) + 252 * ice;
          bumpVal = bumpVal * (1 - ice) + 145 * ice;
          roughVal = 110;
          if (nightData) {
            nightData[idx] = 0;
            nightData[idx + 1] = 0;
            nightData[idx + 2] = 0;
            nightData[idx + 3] = 255;
          }
        } else if (nightData && elev < 0.062) {
          nightData[idx + 3] = 255;
        }
      } else if (type === "mars") {
        const highlands = noise.fbm(wx * 2.6, wy * 2.6, wz * 2.6, 5);
        const canyons = detailNoise.ridged(wx * 6.5, wy * 6.5, wz * 6.5, 4);
        const craters = detailNoise.ridged(nx * 15, ny * 15, nz * 15, 2);
        const t = Math.max(0, Math.min(1, (highlands + 0.65) * 0.78));

        // Iron-oxide ochre highlands vs dark basaltic Syrtis plains
        if (highlands < -0.14) {
          const basalt = Math.max(0, (highlands + 0.55) / 0.41);
          r = 68 + basalt * 46;
          g = 32 + basalt * 20;
          b = 22 + basalt * 14;
        } else {
          r = 148 + t * 68;
          g = 56 + t * 44;
          b = 26 + t * 24;
        }

        // Deep Valles-style rift scar
        if (canyons > 0.82 && absLat < 0.35) {
          const rift = (canyons - 0.82) * 4.2;
          r *= 1 - rift * 0.45;
          g *= 1 - rift * 0.5;
          b *= 1 - rift * 0.45;
          bumpVal = 45;
        } else {
          bumpVal = 95 + t * 90 + (craters - 0.5) * 55;
        }

        roughVal = 218;

        const capEdge = 0.85 + detailNoise.noise(nx * 10, ny * 10, nz * 10) * 0.04;
        if (absLat > capEdge) {
          const cap = Math.min(1, (absLat - capEdge) / 0.1);
          r = r * (1 - cap) + 242 * cap;
          g = g * (1 - cap) + 234 * cap;
          b = b * (1 - cap) + 228 * cap;
          roughVal = 128;
        }
      } else if (type === "moon") {
        const maria = noise.fbm(wx * 1.75, wy * 1.75, wz * 1.75, 4);
        const macroCraters = detailNoise.ridged(nx * 7.5, ny * 7.5, nz * 7.5, 3);
        const microCraters = detailNoise.ridged(nx * 22, ny * 22, nz * 22, 2);

        const isMare = maria < -0.08;
        const baseAlbedo = isMare
          ? 58 + (maria + 0.5) * 45
          : 122 + maria * 58 + (macroCraters - 0.5) * 34;

        const craterRim = isMare ? microCraters * 16 : macroCraters * 26 + microCraters * 14;
        const lum = Math.max(28, Math.min(226, baseAlbedo + craterRim - 18));

        r = lum;
        g = lum + 1;
        b = lum + 4;
        bumpVal = isMare
          ? 85 + microCraters * 55
          : 95 + macroCraters * 95 + microCraters * 45;
        roughVal = 232;
      } else if (type === "europa") {
        const iceField = noise.fbm(wx * 3.0, wy * 3.0, wz * 3.0, 4);
        const lineaPrimary = Math.abs(detailNoise.noise(wx * 6.5, wy * 6.5, wz * 6.5));
        const lineaSecondary = Math.abs(
          noise.noise(nx * 11.5 + 3.1, ny * 11.5 - 1.7, nz * 11.5 + 2.4)
        );

        const isPrimaryCrack = lineaPrimary < 0.048;
        const isSecondaryCrack = lineaSecondary < 0.032;

        if (isPrimaryCrack || isSecondaryCrack) {
          const severity = isPrimaryCrack
            ? 1 - lineaPrimary / 0.048
            : (1 - lineaSecondary / 0.032) * 0.75;
          r = 198 - severity * 64;
          g = 185 - severity * 108;
          b = 175 - severity * 126;
          bumpVal = 64 - severity * 42;
          roughVal = 175;
        } else {
          const frost = Math.max(0, Math.min(1, (iceField + 0.6) * 0.8));
          r = 196 + frost * 38;
          g = 212 + frost * 34;
          b = 224 + frost * 28;
          bumpVal = 135 + iceField * 38;
          roughVal = 64; // Glossy cryogenic water-ice sheen
        }
      } else if (type === "titan") {
        // Banded super-rotating golden photochemical haze + polar Kraken Mare hydrocarbon lakes
        const stormSwirl = noise.fbm(wx * 2.4, wy * 3.2, wz * 2.4, 4);
        const jetBand = Math.sin(lat * 9.5 + stormSwirl * 2.2);
        const bandFactor = (jetBand + 1) * 0.5;

        r = 176 + bandFactor * 48 + stormSwirl * 18;
        g = 108 + bandFactor * 42 + stormSwirl * 14;
        b = 32 + bandFactor * 22;
        bumpVal = 118 + bandFactor * 26;
        roughVal = 165;

        // Northern Polar Hydrocarbon Seas (Kraken & Ligeia Mare)
        if (ny > 0.66) {
          const lakeBasin = detailNoise.fbm(nx * 4.2, ny * 4.2, nz * 4.2, 4);
          if (lakeBasin < -0.06) {
            const blend = Math.min(1, (-0.06 - lakeBasin) * 5.5);
            r = r * (1 - blend) + 22 * blend;
            g = g * (1 - blend) + 28 * blend;
            b = b * (1 - blend) + 34 * blend;
            bumpVal = 65;
            roughVal = 36; // Liquid methane specular mirror
          }
        }
      }

      diffData[idx] = clampByte(r);
      diffData[idx + 1] = clampByte(g);
      diffData[idx + 2] = clampByte(b);
      diffData[idx + 3] = 255;

      const bClamp = clampByte(bumpVal);
      bumpData[idx] = bClamp;
      bumpData[idx + 1] = bClamp;
      bumpData[idx + 2] = bClamp;
      bumpData[idx + 3] = 255;

      const rClamp = clampByte(roughVal);
      roughData[idx] = rClamp;
      roughData[idx + 1] = rClamp;
      roughData[idx + 2] = rClamp;
      roughData[idx + 3] = 255;
    }
  }

  diffCtx.putImageData(diffImg, 0, 0);
  bumpCtx.putImageData(bumpImg, 0, 0);
  roughCtx.putImageData(roughImg, 0, 0);

  let nightMap: THREE.CanvasTexture | undefined;
  if (nightCanvas && nightCtx && nightImg) {
    nightCtx.putImageData(nightImg, 0, 0);
    nightMap = finalizeTexture(nightCanvas, true);
  }

  const bundle: PlanetMapBundle = {
    map: finalizeTexture(diffCanvas, true),
    bumpMap: finalizeTexture(bumpCanvas, false),
    roughnessMap: finalizeTexture(roughCanvas, false),
    nightMap,
  };

  planetBundleCache[type] = bundle;
  return bundle;
}

export function getSeamlessPlanetTexture(type: string): THREE.CanvasTexture {
  return getPlanetMaterialMaps(type).map;
}

// High-detail domain-warped cyclone & trade-wind clouds texture (1024x512)
export function getEarthCloudsTexture(): THREE.CanvasTexture {
  if (singleTextureCache["earth_clouds"]) {
    return singleTextureCache["earth_clouds"];
  }

  const width = 1024;
  const height = 512;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const noise = new FastNoise3D(999);
  const swirl = new FastNoise3D(1337);

  for (let y = 0; y < height; y++) {
    const lat = (y / height - 0.5) * Math.PI;
    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);

    for (let x = 0; x < width; x++) {
      const lon = (x / width) * Math.PI * 2;
      const nx = cosLat * Math.cos(lon);
      const ny = sinLat;
      const nz = cosLat * Math.sin(lon);

      // Coriolis shear warp for realistic atmospheric bands & spiral fronts
      const shear = swirl.fbm(nx * 2.6, ny * 2.6, nz * 2.6, 3) * 0.45;
      const density = noise.fbm(
        nx * 3.4 + shear,
        ny * 4.8 - shear * 0.4,
        nz * 3.4 + shear,
        5
      );
      const wisps = swirl.ridged(nx * 9.5, ny * 9.5, nz * 9.5, 2) * 0.16;
      const combined = density + wisps - 0.09;

      const idx = (y * width + x) * 4;
      if (combined > 0.02) {
        const alpha = clampByte(Math.pow(Math.min(1, combined * 2.35), 1.25) * 242);
        data[idx] = 248;
        data[idx + 1] = 250;
        data[idx + 2] = 255;
        data[idx + 3] = alpha;
      } else {
        data[idx + 3] = 0;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = finalizeTexture(canvas, true);
  singleTextureCache["earth_clouds"] = texture;
  return texture;
}

// Procedural Aerospace Machined Hull Plating & Panel Seam PBR Maps
export function getHullPlatingMaps(): HullMaterialMaps {
  if (cachedHullMaps) return cachedHullMaps;

  const size = 512;
  const mapCanvas = document.createElement("canvas");
  mapCanvas.width = size;
  mapCanvas.height = size;
  const mCtx = mapCanvas.getContext("2d")!;

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext("2d")!;

  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext("2d")!;

  // Base metallic plate tone
  mCtx.fillStyle = "#e6e8ee";
  mCtx.fillRect(0, 0, size, size);
  bCtx.fillStyle = "#888888";
  bCtx.fillRect(0, 0, size, size);
  rCtx.fillStyle = "#555555";
  rCtx.fillRect(0, 0, size, size);

  // Interlocking aerospace hull plates with subtle per-panel reflectance shift
  const cols = 8;
  const rows = 12;
  const cellW = size / cols;
  const cellH = size / rows;

  for (let ry = 0; ry < rows; ry++) {
    const offset = (ry % 2) * (cellW * 0.5);
    for (let cx = -1; cx <= cols; cx++) {
      const px = cx * cellW + offset;
      const py = ry * cellH;
      const hash = Math.abs(Math.sin(cx * 12.9898 + ry * 78.233)) % 1;

      const shade = Math.floor(214 + hash * 30);
      mCtx.fillStyle = `rgb(${shade}, ${shade + 1}, ${shade + 4})`;
      mCtx.fillRect(px + 2, py + 2, cellW - 4, cellH - 4);

      const rVal = Math.floor(62 + hash * 48);
      rCtx.fillStyle = `rgb(${rVal}, ${rVal}, ${rVal})`;
      rCtx.fillRect(px + 2, py + 2, cellW - 4, cellH - 4);

      // Recessed seam grooves in bumpMap
      bCtx.strokeStyle = "#262626";
      bCtx.lineWidth = 2;
      bCtx.strokeRect(px + 1, py + 1, cellW - 2, cellH - 2);

      // Raised inner bevel & fastener rivets
      bCtx.strokeStyle = "#b8b8b8";
      bCtx.lineWidth = 1;
      bCtx.strokeRect(px + 3, py + 3, cellW - 6, cellH - 6);

      // Occasional technical access hatch accent
      if (hash > 0.82) {
        mCtx.fillStyle = "#c8ccd6";
        mCtx.fillRect(px + cellW * 0.25, py + cellH * 0.3, cellW * 0.5, cellH * 0.4);
        bCtx.strokeStyle = "#181818";
        bCtx.strokeRect(px + cellW * 0.25, py + cellH * 0.3, cellW * 0.5, cellH * 0.4);
      }
    }
  }

  const map = finalizeTexture(mapCanvas, true, true);
  map.repeat.set(2, 2);
  const bumpMap = finalizeTexture(bumpCanvas, false, true);
  bumpMap.repeat.set(2, 2);
  const roughnessMap = finalizeTexture(roughCanvas, false, true);
  roughnessMap.repeat.set(2, 2);

  cachedHullMaps = { map, bumpMap, roughnessMap };
  return cachedHullMaps;
}

// Procedural Photovoltaic Solar Cell & Micro-Fin Radiator PBR Maps
export function getRadiatorGridMaps(): HullMaterialMaps {
  if (cachedArrayMaps) return cachedArrayMaps;

  const size = 256;
  const mapCanvas = document.createElement("canvas");
  mapCanvas.width = size;
  mapCanvas.height = size;
  const mCtx = mapCanvas.getContext("2d")!;

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext("2d")!;

  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext("2d")!;

  mCtx.fillStyle = "#0e1320";
  mCtx.fillRect(0, 0, size, size);
  bCtx.fillStyle = "#909090";
  bCtx.fillRect(0, 0, size, size);
  rCtx.fillStyle = "#2b2b2b";
  rCtx.fillRect(0, 0, size, size);

  // Fine copper/silver busbar grid & cell subdivisions
  const step = 16;
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      mCtx.fillStyle = (x + y) % 32 === 0 ? "#131b2e" : "#101726";
      mCtx.fillRect(x + 1, y + 1, step - 2, step - 2);

      bCtx.strokeStyle = "#303030";
      bCtx.lineWidth = 1.5;
      bCtx.strokeRect(x, y, step, step);
    }
  }

  // Primary silver collector busbars
  mCtx.fillStyle = "rgba(255, 110, 72, 0.35)";
  for (let x = 0; x < size; x += 64) {
    mCtx.fillRect(x, 0, 2, size);
    rCtx.fillStyle = "#808080";
    rCtx.fillRect(x, 0, 2, size);
  }

  const map = finalizeTexture(mapCanvas, true, true);
  map.repeat.set(3, 1);
  const bumpMap = finalizeTexture(bumpCanvas, false, true);
  bumpMap.repeat.set(3, 1);
  const roughnessMap = finalizeTexture(roughCanvas, false, true);
  roughnessMap.repeat.set(3, 1);

  cachedArrayMaps = { map, bumpMap, roughnessMap };
  return cachedArrayMaps;
}
