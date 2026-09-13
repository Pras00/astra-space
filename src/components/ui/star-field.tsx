"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  layer: number; // 1, 2, or 3 for parallax
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Adapt star count based on screen width for optimal performance
    const count = width < 768 ? 120 : 260;
    const stars: Star[] = [];

    for (let i = 0; i < count; i++) {
      const layer = Math.random() < 0.6 ? 1 : Math.random() < 0.85 ? 2 : 3;
      const baseAlpha =
        layer === 1
          ? Math.random() * 0.35 + 0.15
          : layer === 2
          ? Math.random() * 0.5 + 0.3
          : Math.random() * 0.7 + 0.4;

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: layer === 1 ? Math.random() * 0.8 + 0.4 : layer === 2 ? Math.random() * 1.2 + 0.6 : Math.random() * 1.8 + 0.8,
        baseAlpha,
        alpha: baseAlpha,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        layer,
      });
    }

    let shootingStars: ShootingStar[] = [];
    let lastShootingStarTime = Date.now();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalized between -1 and 1
      mouseRef.current.targetX = (e.clientX / width) * 2 - 1;
      mouseRef.current.targetY = (e.clientY / height) * 2 - 1;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.016;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Twinkle effect
        if (!reducedMotion) {
          star.alpha =
            star.baseAlpha + Math.sin(time * star.twinkleSpeed * 60 + i) * 0.2;
        }

        // Parallax offset based on layer
        const parallaxFactor = star.layer * (reducedMotion ? 0 : 15);
        const offsetX = -mouseRef.current.x * parallaxFactor;
        const offsetY = -mouseRef.current.y * parallaxFactor;

        let renderX = star.x + offsetX;
        let renderY = star.y + offsetY;

        // Wrap around boundaries
        if (renderX < 0) renderX += width;
        if (renderX > width) renderX -= width;
        if (renderY < 0) renderY += height;
        if (renderY > height) renderY -= height;

        ctx.fillStyle = `rgba(${star.layer === 3 ? "210, 235, 255" : "255, 255, 255"}, ${Math.max(
          0.05,
          Math.min(1, star.alpha)
        )})`;

        ctx.beginPath();
        ctx.arc(renderX, renderY, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Occasional shooting star (disabled if reduced motion)
      const now = Date.now();
      if (!reducedMotion && now - lastShootingStarTime > 7000 && Math.random() < 0.02) {
        lastShootingStarTime = now;
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.4,
          length: Math.random() * 80 + 50,
          speed: Math.random() * 12 + 10,
          angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
          alpha: 1,
          life: 0,
          maxLife: 45,
        });
      }

      // Update and draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.life++;
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.alpha = 1 - ss.life / ss.maxLife;

        if (ss.life >= ss.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        gradient.addColorStop(0, "rgba(56, 189, 248, 0)");
        gradient.addColorStop(0.8, `rgba(186, 230, 253, ${ss.alpha * 0.7})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [reducedMotion]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Deep Space Gradients & Nebulae */}
      <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-sky-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] -left-[10%] w-[600px] h-[500px] bg-indigo-950/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[10%] -right-[10%] w-[700px] h-[600px] bg-blue-950/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Cosmic Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-90"
      />

      {/* Subtle HUD Grid Overlay */}
      <div className="absolute inset-0 space-grid opacity-30 pointer-events-none" />
    </div>
  );
}
