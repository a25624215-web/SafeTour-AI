import React, { useEffect, useRef } from 'react';
import { playIntroTimeline } from '../animations/gsapAnimations';

interface IntroAnimationProps {
  onFinish: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onFinish }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const mountainLeftRef = useRef<HTMLDivElement>(null);
  const mountainRightRef = useRef<HTMLDivElement>(null);
  const backlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = playIntroTimeline(
      logoRef.current,
      taglineRef.current,
      containerRef.current,
      mountainLeftRef.current,
      mountainRightRef.current,
      backlightRef.current,
      onFinish
    );

    return () => {
      tl?.kill();
    };
  }, [onFinish]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070e0a] overflow-hidden select-none"
    >
      {/* 1. Deep Forest Background with Atmospheric Dawn Mist */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050a07] via-[#09150e] to-[#070e0a] -z-30" />

      {/* 2. Soft Golden/Emerald Backlight Emerging from Behind Text */}
      <div
        ref={backlightRef}
        className="absolute w-[500px] h-[300px] bg-gradient-to-t from-[#dfb15b]/25 via-[#34d399]/18 to-transparent rounded-full blur-[90px] pointer-events-none -z-10"
      />

      {/* 3. Mountain Silhouette Layers (Folding / Parting SVG Landscape) */}
      <div
        ref={mountainLeftRef}
        className="absolute inset-x-0 bottom-0 h-72 sm:h-96 pointer-events-none -z-20 opacity-70"
      >
        <svg
          className="w-full h-full text-[#0a1811]"
          viewBox="0 0 1440 400"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Distant Mountain Peak Layer */}
          <path
            d="M0 400 L0 260 L240 180 L480 280 L720 140 L960 250 L1200 160 L1440 240 L1440 400 Z"
            fill="currentColor"
            opacity="0.5"
          />
          {/* Golden Contour Ridge Line */}
          <path
            d="M0 260 L240 180 L480 280 L720 140 L960 250 L1200 160 L1440 240"
            stroke="#dfb15b"
            strokeWidth="1.2"
            strokeOpacity="0.25"
            fill="none"
          />
        </svg>
      </div>

      <div
        ref={mountainRightRef}
        className="absolute inset-x-0 bottom-0 h-60 sm:h-80 pointer-events-none -z-10 opacity-80"
      >
        <svg
          className="w-full h-full text-[#0d2217]"
          viewBox="0 0 1440 350"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Foreground Alpine Fold Layer */}
          <path
            d="M0 350 L0 220 L320 120 L640 230 L900 100 L1200 210 L1440 130 L1440 350 Z"
            fill="currentColor"
          />
          {/* Subtle Pine Ridge Stroke */}
          <path
            d="M0 220 L320 120 L640 230 L900 100 L1200 210 L1440 130"
            stroke="#34d399"
            strokeWidth="1.5"
            strokeOpacity="0.3"
            fill="none"
          />
        </svg>
      </div>

      {/* 4. "Safe-Yatra AI" 3D Text Reveal with Warm Gold & Sandstone Luxury Serif/Sans Balance */}
      <div
        ref={logoRef}
        className="flex flex-col items-center text-center px-4 relative z-10"
      >
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-serif font-medium tracking-tight text-[#fffdfa] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
          <span className="gold-gradient-text">Safe-Yatra AI</span>
        </h1>
      </div>

      {/* 5. Subtitle with Smooth Cinematic Reveal */}
      <div
        ref={taglineRef}
        className="mt-6 text-center px-6 relative z-10"
      >
        <p className="text-base sm:text-xl md:text-2xl font-light text-[#f5f1e8] tracking-widest leading-relaxed">
          Travel Beyond Boundaries
        </p>
        <p className="text-xs sm:text-sm md:text-base text-emerald-400/90 font-mono tracking-widest uppercase mt-1">
          Stay Protected Everywhere
        </p>
      </div>
    </div>
  );
};
