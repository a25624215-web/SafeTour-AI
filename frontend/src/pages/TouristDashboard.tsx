import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { SafetyMap } from '../components/SafetyMap';
import { SafetyCard } from '../components/SafetyCard';
import { SOSButton } from '../components/SOSButton';
import { GeofenceAlert } from '../components/GeofenceAlert';
import {
  Compass,
  User,
  Trees,
  Mountain,
  Clock,
  History,
  Radio,
  Activity,
  ShieldCheck,
} from 'lucide-react';

export const TouristDashboard: React.FC = () => {
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lon: number }>({
    lat: 26.4499,
    lon: 80.3319,
  });

  const handleLocationUpdate = (lat: number, lon: number) => {
    setCurrentCoords({ lat, lon });
  };

  return (
    <div className="min-h-screen bg-[#070e0a] text-sandstone-light selection:bg-[#dfb15b] selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Top Header & Emergency Dispatch Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#dfb15b]/20">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#dfb15b] uppercase tracking-widest mb-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Alpine Tourist Command Console</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#fffdfa]">
              Tourist Safety Telemetry
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <SOSButton userLocation={`${currentCoords.lat.toFixed(4)}, ${currentCoords.lon.toFixed(4)}`} />
          </div>
        </div>

        {/* Real-time Geofence Proximity Alert Banner */}
        <div className="mb-8">
          <GeofenceAlert latitude={currentCoords.lat} longitude={currentCoords.lon} />
        </div>

        {/* Top Metric Cards */}
        <div id="profile" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Tourist ID Profile Card */}
          <div className="glass-forest-card rounded-2xl p-5 border border-[#dfb15b]/20">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#14261c] border border-emerald-500/30 flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-sandstone-dark font-mono">Tourist Identity</p>
                <h3 className="text-sm font-bold text-[#fffdfa] truncate">Aarav Sharma</h3>
                <span className="text-[10px] text-[#dfb15b] font-mono">Pass: SY-2026-ALP</span>
              </div>
            </div>
          </div>

          {/* AI Sentinel Status */}
          <div className="glass-forest-card rounded-2xl p-5 border border-[#dfb15b]/20">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#10291d] border border-emerald-500/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-sandstone-dark font-mono">Protection Grid</p>
                <h3 className="text-sm font-bold text-emerald-300">ACTIVE SENTINEL</h3>
                <span className="text-[10px] text-sandstone-dark font-mono">Overpass Radar: ON</span>
              </div>
            </div>
          </div>

          {/* Current GPS Coordinates */}
          <div className="glass-forest-card rounded-2xl p-5 border border-[#dfb15b]/20">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#262013] border border-[#dfb15b]/40 flex items-center justify-center">
                <Compass className="w-5 h-5 text-[#dfb15b]" />
              </div>
              <div>
                <p className="text-xs text-sandstone-dark font-mono">Live Coordinates</p>
                <h3 className="text-xs font-mono font-bold text-[#dfb15b]">
                  {currentCoords.lat.toFixed(4)}° N
                </h3>
                <span className="text-[11px] font-mono text-sandstone-muted">
                  {currentCoords.lon.toFixed(4)}° E
                </span>
              </div>
            </div>
          </div>

          {/* Safety Index Gauge */}
          <div className="glass-forest-card rounded-2xl p-5 border border-[#dfb15b]/20">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#16291e] border border-emerald-500/30 flex items-center justify-center">
                <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <p className="text-xs text-sandstone-dark font-mono">Perceived Threat</p>
                <h3 className="text-sm font-bold text-[#fffdfa]">NOMINAL</h3>
                <span className="text-[10px] text-emerald-400 font-mono">Terrain Status: Clear</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Workspace: Map + Safety AI Analyzer */}
        <div id="map" className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Map Column (7 cols) */}
          <div className="lg:col-span-7">
            <SafetyMap
              initialLat={currentCoords.lat}
              initialLon={currentCoords.lon}
              onLocationUpdate={handleLocationUpdate}
            />
          </div>

          {/* AI Assessment Form Column (5 cols) */}
          <div className="lg:col-span-5">
            <SafetyCard />
          </div>
        </div>

        {/* Travel Itinerary Safety Timeline */}
        <div className="glass-forest rounded-3xl p-6 md:p-8 border border-[#dfb15b]/20">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#dfb15b]/20">
            <div className="flex items-center gap-2.5">
              <History className="w-5 h-5 text-[#dfb15b]" />
              <h3 className="text-lg font-bold text-[#fffdfa]">Recent Safety Telemetry & Travel Log</h3>
            </div>
            <span className="text-xs font-mono text-sandstone-dark">Synced with Sentinel</span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#09150e] border border-[#dfb15b]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-[#fffdfa]">Solang Valley Mountain Trail</h4>
                  <p className="text-xs text-sandstone-dark mt-0.5">Manali, HP • Moderate Activity • Evaluated SAFE</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-sandstone-dark sm:self-center">
                <Clock className="w-3.5 h-3.5 text-[#dfb15b]" />
                <span>Today, 17:45</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#09150e] border border-[#dfb15b]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#dfb15b] mt-1.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-[#fffdfa]">Old Manali Forest Transit</h4>
                  <p className="text-xs text-sandstone-dark mt-0.5">Dim lighting detected • Advisory issued to remain on marked paths</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-sandstone-dark sm:self-center">
                <Clock className="w-3.5 h-3.5 text-[#dfb15b]" />
                <span>Yesterday, 21:30</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#09150e] border border-[#dfb15b]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-[#fffdfa]">Hadimba Temple Sanctuary</h4>
                  <p className="text-xs text-sandstone-dark mt-0.5">Daylight excursion • Police outpost beacon 320m away</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-sandstone-dark sm:self-center">
                <Clock className="w-3.5 h-3.5 text-[#dfb15b]" />
                <span>Aug 14, 11:20</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
