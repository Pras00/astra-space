"use client";

import { useEffect, useState } from "react";

export interface CountdownTime {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isComplete: boolean;
  mounted: boolean;
}

export function useCountdown(targetDateTimestamp: number): CountdownTime {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    isComplete: boolean;
  }>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isComplete: false,
  });

  useEffect(() => {
    setMounted(true);

    const calculateTime = () => {
      const difference = targetDateTimestamp - Date.now();

      if (difference <= 0) {
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
          isComplete: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days: days.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
        isComplete: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDateTimestamp]);

  return { ...timeLeft, mounted };
}
