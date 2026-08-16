import React from 'react';
import { SpecularButton } from './SpecularButton';
import { ShieldCheck, MapPin, Trees, Mountain, Eye, Navigation2 } from 'lucide-react';

interface HeroProps {
  onStartJourney: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartJourney }) => {
  return (
    <section className="relative min-h-[96vh] flex flex-col items-center justify-center pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* 1. Realistic Mountain Landscape Environment (Slightly Transparent & Naturally Blended) */}
      <div className="absolute inset-0 -z-30 overflow-hidden pointer-events-none">
        <img
          src="/images/himalayan_mountains.jpg"
          alt="Mountain Environment"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.45] contrast-[1.08] saturate-[0.82] transition-transform duration-1000"
        />

        {/* Ambient Mountain Gradients & Soft Sunrise Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070e0a]/85 via-[#0b1a12]/60 to-[#070e0a] -z-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_20%,rgba(223,177,91,0.09),transparent_70%)] -z-20 pointer-events-none" />

        {/* Natural Mountain Fog Drift */}
        <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-[#070e0a] via-[#070e0a]/90 to-transparent pointer-events-none -z-10" />
        <div className="fog-layer absolute inset-0 bg-[radial-gradient(ellipse_120%_40%_at_50%_65%,rgba(245,241,232,0.05),transparent_60%)] pointer-events-none -z-10" />
      </div>

      {/* 2. Realistic Airplane SVG Flight Animation Across Mountain Sky with Auto-Tangent Rotation */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 600"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Smooth curved climb trajectory across the mountain sky */}
            <path
              id="airplaneFlightPath"
              d="M -120,380 C 250,330 650,220 1100,140 C 1300,105 1520,70 1620,50"
            />
            {/* Contrail Vapor Gradient */}
            <linearGradient id="contrailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f5f1e8" stopOpacity="0" />
              <stop offset="60%" stopColor="#f5f1e8" stopOpacity="0.18" />
              <stop offset="95%" stopColor="#ffffff" stopOpacity="0.45" />
            </linearGradient>
          </defs>

          {/* Airplane Group with Native Path Following and Tangent Alignment */}
          <g>
            <animateMotion
              dur="24s"
              repeatCount="indefinite"
              rotate="auto"
              keyPoints="0;0.08;0.85;0.96;1"
              keyTimes="0;0.08;0.85;0.96;1"
              calcMode="linear"
            >
              <mpath href="#airplaneFlightPath" />
            </animateMotion>

            {/* Fade In on takeoff, smooth flight, fade out into mountain mist */}
            <animate
              attributeName="opacity"
              values="0;0.95;0.95;0.2;0"
              keyTimes="0;0.08;0.85;0.96;1"
              dur="24s"
              repeatCount="indefinite"
            />

            {/* Contrail Vapor Trail (Extending behind the aircraft) */}
            <line
              x1="-90"
              y1="0"
              x2="-10"
              y2="0"
              stroke="url(#contrailGradient)"
              strokeWidth="2.2"
              strokeLinecap="round"
              filter="blur(1px)"
            />

            {/* Realistic Passenger Aircraft Silhouette (Centered at origin, pointing rightward along flight tangent) */}
            <g transform="translate(0, 0) scale(0.9)">
              {/* Aircraft Fuselage & Wings (Right-facing standard 0-deg orientation) */}
              <path
                d="M 18,0 L 4,-3 L -4,-18 L -9,-18 L -4,-3 L -22,-3 L -27,-9 L -31,-9 L -28,0 L -31,9 L -27,9 L -22,3 L -4,3 L -9,18 L -4,18 L 4,3 Z"
                fill="#ffffff"
                opacity="0.95"
                filter="drop-shadow(0 2px 8px rgba(0,0,0,0.8))"
              />

              {/* Jet Engine Pods */}
              <rect x="-8" y="-9" width="6" height="2" rx="1" fill="#dfb15b" opacity="0.9" />
              <rect x="-8" y="7" width="6" height="2" rx="1" fill="#dfb15b" opacity="0.9" />

              {/* Strobe Navigation Beacons */}
              <circle cx="-6" cy="-18" r="1.8" fill="#34d399" className="strobe-light" />
              <circle cx="-6" cy="18" r="1.8" fill="#dfb15b" className="strobe-light" />
              <circle cx="-30" cy="0" r="1.5" fill="#f87171" className="strobe-light" />
            </g>
          </g>
        </svg>
      </div>

      {/* 3. Hero Main Title */}
      <div className="max-w-4xl mx-auto text-center relative z-10 pt-4 sm:pt-6">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-semibold tracking-tight text-[#fffdfa] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
          <span className="gold-gradient-text">Safe-Yatra AI</span>
        </h1>

        {/* 4. Subtitle positioned lower with generous sky breathing room */}
        <div className="mt-14 sm:mt-20 max-w-2xl mx-auto">
          <p className="text-xl sm:text-3xl md:text-4xl font-light text-[#f5f1e8] tracking-wide leading-relaxed drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)]">
            Travel Beyond Boundaries, <br className="hidden sm:inline" />
            <span className="text-emerald-300 font-normal">
              Stay Protected Everywhere
            </span>
          </p>
          <p className="mt-5 text-xs sm:text-sm md:text-base text-sandstone-muted font-normal leading-relaxed max-w-xl mx-auto">
            AI-powered nature travel safety platform connecting travelers with real-time OpenStreetMap emergency radar, geofenced perimeter monitoring, and proactive risk intelligence.
          </p>
        </div>

        {/* 5. Nature Specular CTA Button & Actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <SpecularButton onClick={onStartJourney} text="Start Your Journey" />

          <a
            href="#safety-demo"
            className="px-7 py-4 rounded-2xl glass-forest-card text-sm font-semibold text-[#f5f1e8] hover:text-white hover:border-[#dfb15b]/45 transition-all duration-300 flex items-center gap-2.5 shadow-lg active:scale-95"
          >
            <Eye className="w-4 h-4 text-[#dfb15b]" />
            <span>Simulate AI Risk Scan</span>
          </a>
        </div>
      </div>

      {/* 6. Nature Travel Safety Pillars */}
      <div className="mt-24 w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <div className="glass-forest-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#14261c] border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner">
            <Mountain className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-sandstone-light">Mountain Threat AI</h4>
            <p className="text-xs text-sandstone-dark mt-0.5">Terrain & crowd telemetry</p>
          </div>
        </div>

        <div className="glass-forest-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#1d3023] border border-[#dfb15b]/30 flex items-center justify-center shrink-0 shadow-inner">
            <MapPin className="w-5 h-5 text-[#dfb15b]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-sandstone-light">Overpass OSM Radar</h4>
            <p className="text-xs text-sandstone-dark mt-0.5">3km emergency anchor grid</p>
          </div>
        </div>

        <div className="glass-forest-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#172b1e] border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner">
            <Trees className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-sandstone-light">Geofence Sentinel</h4>
            <p className="text-xs text-sandstone-dark mt-0.5">Haversine caution perimeter</p>
          </div>
        </div>

        <div className="glass-forest-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#361a15] border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-sandstone-light">Instant SOS Dispatch</h4>
            <p className="text-xs text-sandstone-dark mt-0.5">Live emergency beacon</p>
          </div>
        </div>
      </div>
    </section>
  );
};
