'use client';

import { useState, useEffect } from 'react';

interface SplashScreenProps {
  onLoadComplete: () => void;
  duration?: number; // ms — durée de l'animation avant disparition
}

export default function SplashScreen({
  onLoadComplete,
  duration = 800,
}: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const steps = 20;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setProgress(Math.round((step / steps) * 100));
      if (step >= steps) {
        clearInterval(timer);
        setIsExiting(true);
        setTimeout(onLoadComplete, 500);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [duration, onLoadComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-opacity duration-500 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo avec glow */}
      <div className="relative mb-12 animate-[fadeIn_0.8s_ease-out_forwards]">
        <div className="absolute inset-0 blur-3xl opacity-40 bg-gradient-to-br from-[#7C5CFF] to-[#401a87] rounded-full scale-150" />
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-[#7C5CFF] to-[#401a87] flex items-center justify-center shadow-2xl animate-pulse">
          <span className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            BZ
          </span>
        </div>
      </div>

      {/* Texte */}
      <h1 className="text-white text-xl sm:text-2xl font-semibold mb-8 animate-[fadeIn_0.6s_ease-out_0.3s_forwards] opacity-0">
        BEATMAKERZ
      </h1>

      {/* Barre de progression */}
      <div className="w-48 sm:w-64 h-1 bg-white/10 rounded-full overflow-hidden animate-[fadeIn_0.6s_ease-out_0.3s_forwards] opacity-0">
        <div
          className="h-full bg-gradient-to-r from-[#7C5CFF] to-[#a855f7] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Pourcentage */}
      <p className="mt-4 text-white/50 text-sm font-mono animate-[fadeIn_0.6s_ease-out_0.3s_forwards] opacity-0">
        {progress}%
      </p>
    </div>
  );
}
