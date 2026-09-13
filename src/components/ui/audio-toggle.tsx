"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

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
          audioCtxRef.current.currentTime + 0.5
        );
        setTimeout(() => {
          oscRef.current?.stop();
          oscSubRef.current?.stop();
          audioCtxRef.current?.close();
          audioCtxRef.current = null;
          setIsPlaying(false);
        }, 500);
      }
    } else {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Master gain
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 2.0); // Gentle, subtle level
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        // Ambient low-frequency drone (55Hz Root A1)
        const osc1 = ctx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(55, ctx.currentTime);

        // Low-pass filter for warm cosmic rumble
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(140, ctx.currentTime);
        filter.Q.setValueAtTime(2.0, ctx.currentTime);

        // Sub-harmonic drone (82.4Hz E2)
        const osc2 = ctx.createOscillator();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(82.41, ctx.currentTime);

        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.4, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(subGain);
        subGain.connect(filter);
        filter.connect(masterGain);

        osc1.start();
        osc2.start();
        oscRef.current = osc1;
        oscSubRef.current = osc2;

        setIsPlaying(true);
      } catch (err) {
        console.warn("Audio synthesis unavailable in current browser", err);
      }
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
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-3 py-2 rounded-full border border-slate-700/60 bg-slate-950/80 backdrop-blur-md text-xs font-mono tracking-wider text-slate-300 hover:text-sky-400 hover:border-sky-500/50 transition-all duration-300 shadow-xl group"
      aria-label={isPlaying ? "Mute ambient audio" : "Enable ambient cosmic audio"}
      title={isPlaying ? "Mute ambient audio" : "Enable ambient cosmic audio"}
    >
      <div className="flex items-end gap-0.5 h-3.5 w-3.5">
        {isPlaying ? (
          <>
            <span className="w-0.5 bg-sky-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-full" />
            <span className="w-0.5 bg-sky-400 rounded-full animate-[pulse_1.2s_ease-in-out_infinite] h-2/3" />
            <span className="w-0.5 bg-sky-400 rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-4/5" />
          </>
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
        )}
      </div>
      <span className="hidden sm:inline">
        {isPlaying ? "AUDIO ONLINE" : "AMBIENT AUDIO"}
      </span>
      {isPlaying && <Volume2 className="w-3.5 h-3.5 text-sky-400" />}
    </button>
  );
}
