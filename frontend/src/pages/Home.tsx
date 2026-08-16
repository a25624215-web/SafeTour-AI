import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { IntroAnimation } from '../components/IntroAnimation';
import { TunnelTransition } from '../components/TunnelTransition';
import { SafetyCard } from '../components/SafetyCard';
import { SpecularButton } from '../components/SpecularButton';
import { Compass, Trees, Mountain, Navigation2, ShieldAlert, ShieldCheck, Eye } from 'lucide-react';

export const Home: React.FC = () => {
  const [introFinished, setIntroFinished] = useState(false);
  const [tunnelActive, setTunnelActive] = useState(false);
  const navigate = useNavigate();

  const handleStartJourney = () => {
    setTunnelActive(true);
  };

  const handleTunnelComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#070e0a] text-sandstone-light relative selection:bg-[#dfb15b] selection:text-black">
      {/* 1. Cinematic Alpine Intro Animation */}
      {!introFinished && (
        <IntroAnimation onFinish={() => setIntroFinished(true)} />
      )}

      {/* 2. Light Tunnel Warp Transition */}
      <TunnelTransition
        active={tunnelActive}
        onComplete={handleTunnelComplete}
      />

      {/* Navbar */}
      <Navbar />

      <main>
        {/* 3. Himalayan Hero Section */}
        <Hero onStartJourney={handleStartJourney} />

        {/* 4. Protection Grid Feature Section */}
        <section id="features" className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            {/* Tag Removed as requested */}
            <h2 className="text-4xl sm:text-6xl font-black text-[#fffdfa] tracking-tight leading-[1.12]">
              Autonomous Tourist <br />
              <span className="gold-gradient-text">Protection Grid</span>
            </h2>
            <p className="text-[#9fb2a6] text-base sm:text-lg md:text-xl mt-6 leading-relaxed font-normal">
              Fusing spatial terrain telemetry, machine risk assessment, and OpenStreetMap emergency query nodes to safeguard travelers across remote mountain passes and vibrant tourist corridors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Threat Assessment */}
            <div className="glass-forest rounded-3xl p-8 border border-emerald-500/25 hover:border-[#dfb15b]/45 transition-all duration-300 group shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-[#14291d] border border-emerald-500/35 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-inner">
                <Eye className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-[#fffdfa] mb-3">Predictive Threat Assessment</h3>
              <p className="text-sm text-[#9fb2a6] leading-relaxed">
                Calculates environmental risk scores based on time of day, crowd density patterns, terrain vulnerability, and active distress flags.
              </p>
            </div>

            {/* Card 2: OSM Spatial Radar */}
            <div className="glass-forest rounded-3xl p-8 border border-[#dfb15b]/25 hover:border-[#dfb15b]/50 transition-all duration-300 group shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-[#1d3023] border border-[#dfb15b]/35 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-inner">
                <Navigation2 className="w-7 h-7 text-[#dfb15b]" />
              </div>
              <h3 className="text-xl font-bold text-[#fffdfa] mb-3">Overpass OSM Spatial Radar</h3>
              <p className="text-sm text-[#9fb2a6] leading-relaxed">
                Autonomous real-time node queries locating emergency anchors within a 3,000-meter radius (Police, Hospitals, Fire, 24/7 Pharmacies).
              </p>
            </div>

            {/* Card 3: Geofence Sentinel & SOS Beacon */}
            <div className="glass-forest rounded-3xl p-8 border border-emerald-500/25 hover:border-emerald-500/50 transition-all duration-300 group shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-[#172f22] border border-emerald-500/35 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-inner">
                <ShieldCheck className="w-7 h-7 text-emerald-300" />
              </div>
              <h3 className="text-xl font-bold text-[#fffdfa] mb-3">Geofence Sentinel & SOS</h3>
              <p className="text-sm text-[#9fb2a6] leading-relaxed">
                Instant proximity alerts when approaching configured caution zones, with one-click emergency broadcast to alpine rescue stations.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Live Interactive Safety Demo Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fffdfa]">
              Test the AI Safety Engine
            </h2>
            <p className="text-xs sm:text-sm text-sandstone-dark mt-2 font-mono">
              Live FastAPI `/analyze-safety` endpoint integration
            </p>
          </div>

          <SafetyCard />
        </section>

        {/* 6. Protocol / How it Works */}
        <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#dfb15b]/15">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#dfb15b]">Response Protocol</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#fffdfa] mt-2">
              Instant 3-Step Protection Loop
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="glass-forest-card p-7 rounded-2xl border border-emerald-500/20 text-center">
              <div className="w-10 h-10 rounded-full bg-[#193324] text-emerald-300 font-mono font-bold flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                1
              </div>
              <h4 className="text-base font-bold text-[#fffdfa] mb-2">Spatial Sensing</h4>
              <p className="text-xs text-[#9fb2a6] leading-relaxed">
                Continuous GPS telemetry monitors position relative to alpine terrain and high-risk caution zones.
              </p>
            </div>

            <div className="glass-forest-card p-7 rounded-2xl border border-[#dfb15b]/20 text-center">
              <div className="w-10 h-10 rounded-full bg-[#292214] text-[#dfb15b] font-mono font-bold flex items-center justify-center mx-auto mb-4 border border-[#dfb15b]/40">
                2
              </div>
              <h4 className="text-base font-bold text-[#fffdfa] mb-2">Contextual AI Threat Scoring</h4>
              <p className="text-xs text-[#9fb2a6] leading-relaxed">
                Crowd analysis and temporal metrics compute dynamic risk scores and proactive traveler safety guidance.
              </p>
            </div>

            <div className="glass-forest-card p-7 rounded-2xl border border-amber-500/20 text-center">
              <div className="w-10 h-10 rounded-full bg-[#381a14] text-amber-300 font-mono font-bold flex items-center justify-center mx-auto mb-4 border border-amber-500/40">
                3
              </div>
              <h4 className="text-base font-bold text-[#fffdfa] mb-2">1-Click Emergency SOS</h4>
              <p className="text-xs text-[#9fb2a6] leading-relaxed">
                Instant emergency alert dispatch routing to nearest law enforcement and medical response teams.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <SpecularButton onClick={handleStartJourney} text="Launch Tourist Dashboard" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-14 border-t border-[#dfb15b]/20 glass-forest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#dfb15b] to-emerald-400 p-[1.5px]">
              <div className="w-full h-full bg-[#08120b] rounded-lg flex items-center justify-center">
                <Compass className="w-4 h-4 text-[#dfb15b]" />
              </div>
            </div>
            <span className="font-bold text-[#fffdfa] tracking-wide">Safe-Yatra AI</span>
          </div>

          <p className="text-xs text-[#9fb2a6] font-mono text-center">
            Smart Tourist Safety Monitoring & Incident Response System — SIH Hackathon
          </p>

          <p className="text-xs text-[#dfb15b] font-mono">
            © 2026 Safe-Yatra AI. Powered by FastAPI & React 19.
          </p>
        </div>
      </footer>
    </div>
  );
};
