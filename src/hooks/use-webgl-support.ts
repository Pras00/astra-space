"use client";

import { useSyncExternalStore } from "react";

let cachedSupport: boolean | null = null;

function checkWebGL(): boolean {
  if (cachedSupport !== null) return cachedSupport;
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    cachedSupport = Boolean(gl);
  } catch {
    cachedSupport = false;
  }
  return cachedSupport;
}

const emptySubscribe = () => () => {};

export function useWebGLSupport(): { supported: boolean; checking: boolean } {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isClient) {
    return { supported: true, checking: true };
  }

  return { supported: checkWebGL(), checking: false };
}

