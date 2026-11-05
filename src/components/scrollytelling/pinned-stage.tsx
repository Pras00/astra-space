"use client";

import { ReactNode, RefObject, useCallback, useRef, useState } from "react";
import { useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface StageDescriptor {
  readonly id: string;
  readonly code: string;
  readonly label: string;
}

export interface UsePinnedStageResult {
  readonly containerRef: RefObject<HTMLElement | null>;
  readonly activeIndex: number;
  readonly stageProgress: number;
  readonly overallProgress: number;
  readonly totalRunwayVh: number;
  readonly jumpToStage: (index: number) => void;
}

export function usePinnedStage(
  stages: readonly StageDescriptor[],
  vhPerStage: number = 95
): UsePinnedStageResult {
  const containerRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  const [scrollState, setScrollState] = useState<{
    activeIndex: number;
    stageProgress: number;
    overallProgress: number;
  }>({
    activeIndex: 0,
    stageProgress: 0,
    overallProgress: 0,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 26,
    mass: 0.35,
    restDelta: 0.0005,
  });

  const trackedValue = reducedMotion ? scrollYProgress : smoothProgress;

  useMotionValueEvent(trackedValue, "change", (latest) => {
    const clamped = Math.max(0, Math.min(0.9999, latest));
    const count = stages.length;
    const scaled = clamped * count;
    const nextIndex = Math.min(count - 1, Math.floor(scaled));
    const nextStageProgress = scaled - nextIndex;

    setScrollState((prev) => {
      if (
        prev.activeIndex === nextIndex &&
        Math.abs(prev.stageProgress - nextStageProgress) < 0.004 &&
        Math.abs(prev.overallProgress - clamped) < 0.002
      ) {
        return prev;
      }
      return {
        activeIndex: nextIndex,
        stageProgress: nextStageProgress,
        overallProgress: clamped,
      };
    });
  });

  const jumpToStage = useCallback(
    (targetIndex: number) => {
      const container = containerRef.current;
      const safeIndex = Math.max(0, Math.min(stages.length - 1, targetIndex));

      if (!container || typeof window === "undefined") {
        setScrollState({
          activeIndex: safeIndex,
          stageProgress: 0.5,
          overallProgress: safeIndex / Math.max(1, stages.length - 1),
        });
        return;
      }

      const rect = container.getBoundingClientRect();
      const containerTop = window.scrollY + rect.top;
      const scrollableDistance = Math.max(
        0,
        container.offsetHeight - window.innerHeight
      );

      if (scrollableDistance <= 0) {
        setScrollState({
          activeIndex: safeIndex,
          stageProgress: 0.5,
          overallProgress: safeIndex / Math.max(1, stages.length - 1),
        });
        return;
      }

      const targetRatio = (safeIndex + 0.35) / stages.length;
      const targetScrollY = containerTop + scrollableDistance * targetRatio;

      window.scrollTo({
        top: targetScrollY,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [stages.length, reducedMotion]
  );

  const totalRunwayVh = Math.max(160, stages.length * vhPerStage);

  return {
    containerRef,
    activeIndex: scrollState.activeIndex,
    stageProgress: scrollState.stageProgress,
    overallProgress: scrollState.overallProgress,
    totalRunwayVh,
    jumpToStage,
  };
}

interface PinnedStageShellProps {
  readonly id?: string;
  readonly containerRef: RefObject<HTMLElement | null>;
  readonly totalRunwayVh: number;
  readonly className?: string;
  readonly children: ReactNode;
}

export function PinnedStageShell({
  id,
  containerRef,
  totalRunwayVh,
  className,
  children,
}: PinnedStageShellProps) {
  return (
    <section
      id={id}
      ref={containerRef}
      style={{ minHeight: `${totalRunwayVh}vh` }}
      className={cn("relative border-b border-hairline", className)}
    >
      <div className="sticky top-0 min-h-svh w-full flex flex-col justify-center overflow-x-clip pt-20 pb-8 sm:pt-22 sm:pb-8">
        {children}
      </div>
    </section>
  );
}
