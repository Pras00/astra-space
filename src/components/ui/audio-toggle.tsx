"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface WebkitWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

export function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const oscSubRef = useRef<OscillatorNode | null>(null);

  const toggleSound = () => {
    if (isPlaying) {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.exponentialRampToValueAtTime(
          0.0001,
          audioCtxRef.current.currentTime + 0.4
        );
        setTimeout(() => {
          oscRef.current?.stop();
          oscSubRef.current?.stop();
          audioCtxRef.current?.close();
          audioCtxRef.current = null;
          setIsPlaying(false);
        }, 420);
      }
      return;
    }

    try {
      const AudioContextClass =
        window.AudioContext || (window as WebkitWindow).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 1.8);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(55, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(135, ctx.currentTime);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(82.41, ctx.currentTime);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.35, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(subGain);
      subGain.connect(filter);
      filter.connect(masterGain);

      osc1.start();
      osc2.start();
      oscRef.current = osc1;
      oscSubRef.current = osc2;

      setIsPlaying(true);
    } catch {
      // Silently ignore unsupported audio contexts
    }
  };

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      type="button"
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 flex items-center gap-2.5 p-2.5 sm:px-3.5 sm:py-2.5 rounded-none border border-hairline-strong bg-carbon/95 text-3xs font-mono uppercase tracking-widest text-titanium hover:text-bone hover:border-signal transition-colors cursor-pointer"
      aria-label={isPlaying ? "Mute cabin acoustic feed" : "Enable cabin acoustic feed"}
      aria-pressed={isPlaying}
    >
      <div className="flex items-end gap-0.5 h-3 w-3" aria-hidden="true">
        {isPlaying ? (
          <>
            <span className="w-0.5 bg-signal animate-pulse h-full" />
            <span className="w-0.5 bg-signal animate-pulse h-2/3" />
            <span className="w-0.5 bg-signal animate-pulse h-4/5" />
          </>
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-ash" />
        )}
      </div>
      <span className="hidden sm:inline">
        {isPlaying ? "ACOUSTIC // ON" : "ACOUSTIC // MUTED"}
      </span>
      {isPlaying && <Volume2 className="w-3.5 h-3.5 text-signal" aria-hidden="true" />}
    </button>
  );
}
