import * as THREE from "three";

// Fast, mathematically continuous 3D Value/Simplex noise for seamless spherical planets
class FastNoise3D {
  private perm: Uint8Array;

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

  private fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(t: number, a: number, b: number) {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number, z: number) {
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
        this.lerp(u, this.grad(this.perm[AA], x, y, z), this.grad(this.perm[BA], x - 1, y, z)),
        this.lerp(u, this.grad(this.perm[AB], x, y - 1, z), this.grad(this.perm[BB], x - 1, y - 1, z))
      ),
      this.lerp(
        v,
        this.lerp(u, this.grad(this.perm[AA + 1], x, y, z - 1), this.grad(this.perm[BA + 1], x - 1, y, z - 1)),
        this.lerp(u, this.grad(this.perm[AB + 1], x, y - 1, z - 1), this.grad(this.perm[BB + 1], x - 1, y - 1, z - 1))
      )
    );
  }

  fbm(x: number, y: number, z: number, octaves = 3): number {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;
    for (let i = 0; i < octaves; i++) {
      total += this.noise(x * frequency, y * frequency, z * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return total / maxValue;
  }
}

// Global cached textures
const textureCache: Record<string, THREE.CanvasTexture> = {};

export function getSeamlessPlanetTexture(type: string): THREE.CanvasTexture {
  if (textureCache[type]) {
    return textureCache[type];
  }

  const width = 512;
  const height = 256;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: false })!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const noise = new FastNoise3D(
    type === "mars" ? 101 : type === "moon" ? 202 : type === "europa" ? 303 : type === "titan" ? 404 : 505
  );

  for (let y = 0; y < height; y++) {
    const lat = (y / height - 0.5) * Math.PI;
    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);

    for (let x = 0; x < width; x++) {
      const lon = (x / width) * Math.PI * 2;
      const nx = cosLat * Math.cos(lon);
      const ny = sinLat;
      const nz = cosLat * Math.sin(lon);

      const idx = (y * width + x) * 4;

      if (type === "earth") {
        const elevation = noise.fbm(nx * 2.2, ny * 2.2, nz * 2.2, 4);
        if (elevation < 0.05) {
          // Deep Ocean
          const depth = Math.max(0, Math.min(1, (elevation + 0.5) / 0.55));
          data[idx] = Math.floor(10 + depth * 15);
          data[idx + 1] = Math.floor(28 + depth * 55);
          data[idx + 2] = Math.floor(70 + depth * 80);
        } else if (elevation < 0.09) {
          // Coastal Shelf
          data[idx] = 28;
          data[idx + 1] = 95;
          data[idx + 2] = 120;
        } else if (elevation < 0.28) {
          // Landmass
          const veg = (elevation - 0.09) / 0.19;
          data[idx] = Math.floor(34 + veg * 24);
          data[idx + 1] = Math.floor(88 + veg * 40);
          data[idx + 2] = Math.floor(45 + veg * 20);
        } else {
          // Mountains
          data[idx] = 120;
          data[idx + 1] = 110;
          data[idx + 2] = 95;
        }

        // Polar ice caps
        if (Math.abs(ny) > 0.82) {
          const ice = (Math.abs(ny) - 0.82) / 0.18;
          data[idx] = Math.floor(data[idx] * (1 - ice) + 240 * ice);
          data[idx + 1] = Math.floor(data[idx + 1] * (1 - ice) + 248 * ice);
          data[idx + 2] = Math.floor(data[idx + 2] * (1 - ice) + 255 * ice);
        }
      } else if (type === "mars") {
        const terrain = noise.fbm(nx * 3.0, ny * 3.0, nz * 3.0, 4);
        const t = (terrain + 1) * 0.5;

        data[idx] = Math.floor(140 + t * 70);
        data[idx + 1] = Math.floor(40 + t * 45);
        data[idx + 2] = Math.floor(20 + t * 25);

        if (terrain < -0.15) {
          data[idx] = Math.floor(data[idx] * 0.65);
          data[idx + 1] = Math.floor(data[idx + 1] * 0.55);
          data[idx + 2] = Math.floor(data[idx + 2] * 0.6);
        }

        // Ice caps
        if (Math.abs(ny) > 0.84) {
          const cap = (Math.abs(ny) - 0.84) / 0.16;
          data[idx] = Math.floor(data[idx] * (1 - cap) + 245 * cap);
          data[idx + 1] = Math.floor(data[idx + 1] * (1 - cap) + 240 * cap);
          data[idx + 2] = Math.floor(data[idx + 2] * (1 - cap) + 240 * cap);
        }
      } else if (type === "moon") {
        const maria = noise.fbm(nx * 1.8, ny * 1.8, nz * 1.8, 3);
        const craters = noise.fbm(nx * 6.0, ny * 6.0, nz * 6.0, 3);
        const gray = Math.floor(95 + maria * 40 + craters * 25);
        const clamped = Math.max(35, Math.min(215, gray));

        data[idx] = clamped;
        data[idx + 1] = clamped + 2;
        data[idx + 2] = clamped + 6;
      } else if (type === "europa") {
        const ice = noise.fbm(nx * 3.5, ny * 3.5, nz * 3.5, 3);
        const cracks = Math.abs(noise.fbm(nx * 7.0, ny * 7.0, nz * 7.0, 3));

        if (cracks < 0.12) {
          data[idx] = 165;
          data[idx + 1] = 65;
          data[idx + 2] = 35;
        } else {
          const b = Math.floor(215 + ice * 35);
          data[idx] = b - 15;
          data[idx + 1] = b - 5;
          data[idx + 2] = b;
        }
      } else if (type === "titan") {
        const band = Math.sin(lat * 8 + noise.fbm(nx * 2, ny * 2, nz * 2, 3) * 2);
        const gold = (band + 1) * 0.5;

        data[idx] = Math.floor(185 + gold * 50);
        data[idx + 1] = Math.floor(100 + gold * 45);
        data[idx + 2] = Math.floor(20 + gold * 25);

        if (ny > 0.78 && noise.fbm(nx * 4, ny * 4, nz * 4, 3) < -0.15) {
          data[idx] = 30;
          data[idx + 1] = 45;
          data[idx + 2] = 55;
        }
      }

      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache[type] = texture;
  return texture;
}

// Generate clouds texture for Earth with alpha transparency
export function getEarthCloudsTexture(): THREE.CanvasTexture {
  if (textureCache["earth_clouds"]) {
    return textureCache["earth_clouds"];
  }

  const width = 512;
  const height = 256;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: false })!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const noise = new FastNoise3D(999);

  for (let y = 0; y < height; y++) {
    const lat = (y / height - 0.5) * Math.PI;
    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);

    for (let x = 0; x < width; x++) {
      const lon = (x / width) * Math.PI * 2;
      const nx = cosLat * Math.cos(lon);
      const ny = sinLat;
      const nz = cosLat * Math.sin(lon);

      const cloudDensity = noise.fbm(nx * 3.0, ny * 3.0, nz * 3.0, 3);
      const idx = (y * width + x) * 4;

      if (cloudDensity > 0.08) {
        const alpha = Math.min(240, Math.floor((cloudDensity - 0.08) * 400));
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = alpha;
      } else {
        data[idx + 3] = 0;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache["earth_clouds"] = texture;
  return texture;
}
