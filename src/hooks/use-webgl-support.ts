"use client";

import { useEffect, useState } from "react";

export function useWebGLSupport(): { supported: boolean; checking: boolean } {
  const [supported, setSupported] = useState(true);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      setSupported(Boolean(gl));
    } catch {
      setSupported(false);
    } finally {
      setChecking(false);
    }
  }, []);

  return { supported, checking };
}
