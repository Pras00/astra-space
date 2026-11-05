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
  layer: number;
  warm: boolean;
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

    let animationFrameId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const count = width < 768 ? 90 : 180;
    const stars: Star[] = [];

    for (let i = 0; i < count; i++) {
      const layer = Math.random() < 0.65 ? 1 : Math.random() < 0.9 ? 2 : 3;
      const baseAlpha =
        layer === 1
          ? Math.random() * 0.25 + 0.08
          : layer === 2
          ? Math.random() * 0.35 + 0.18
          : Math.random() * 0.5 + 0.3;

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: layer === 1 ? 0.65 : layer === 2 ? 1.0 : 1.35,
        baseAlpha,
        alpha: baseAlpha,
        twinkleSpeed: Math.random() * 0.015 + 0.004,
        layer,
        warm: Math.random() < 0.06,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / width) * 2 - 1;
      mouseRef.current.targetY = (e.clientY / height) * 2 - 1;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.016;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!reducedMotion) {
          star.alpha =
            star.baseAlpha + Math.sin(time * star.twinkleSpeed * 60 + i) * 0.12;
        }

        const parallaxFactor = star.layer * (reducedMotion ? 0 : 10);
        let renderX = star.x - mouseRef.current.x * parallaxFactor;
        let renderY = star.y - mouseRef.current.y * parallaxFactor;

        if (renderX < 0) renderX += width;
        if (renderX > width) renderX -= width;
        if (renderY < 0) renderY += height;
        if (renderY > height) renderY -= height;

        const clampedAlpha = Math.max(0.04, Math.min(0.85, star.alpha));
        ctx.fillStyle = star.warm
          ? `rgba(255, 160, 130, ${clampedAlpha})`
          : `rgba(244, 244, 240, ${clampedAlpha})`;

        ctx.fillRect(renderX, renderY, star.size, star.size);
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
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Crisp Sub-pixel Starfield */}
      <canvas ref={canvasRef} className="w-full h-full opacity-80" />

      {/* Architectural Hairline Grid */}
      <div className="absolute inset-0 architectural-grid opacity-70" />

      {/* Tactile Film-Grain Surface (13322566869.com finish) */}
      <div className="absolute inset-0 film-grain opacity-90" />
    </div>
  );
}
