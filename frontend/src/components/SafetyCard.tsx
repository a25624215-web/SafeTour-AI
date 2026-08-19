import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, CheckCircle2, Clock, Users, MapPin, Sparkles, Compass } from 'lucide-react';
import { analyzeSafety, SafetyAnalysisResponse } from '../services/api';

export const SafetyCard: React.FC = () => {
  const [location, setLocation] = useState<string>('Varanasi Ghats');
  const [time, setTime] = useState<string>('night');
  const [crowdLevel, setCrowdLevel] = useState<string>('medium');
  const [emergency, setEmergency] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SafetyAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await analyzeSafety({
        location,
        time,
        crowd_level: crowdLevel,
        emergency,
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Unable to evaluate safety metrics. Verify backend connection on :8000.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'HIGH':
        return {
          color: 'bg-[#3b1212]/70 text-rose-300 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.3)]',
          icon: <AlertCircle className="w-4 h-4 text-rose-400" />,
        };
      case 'MEDIUM':
        return {
          color: 'bg-[#3b2710]/70 text-amber-300 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
        };
      default:
        return {
          color: 'bg-[#0e2a1b]/70 text-emerald-300 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        };
    }
  };

  return (
    <div
      id="safety-demo"
      className="glass-forest rounded-3xl p-6 md:p-8 border border-[#dfb15b]/25 shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#dfb15b]/20">
        <div>
          <h3 className="text-xl font-bold text-[#fffdfa] flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#dfb15b]" />
            <span>AI Travel Threat Perception Engine</span>
          </h3>
          <p className="text-xs text-sandstone-dark font-mono mt-1">
            FastAPI Rule-Engine Inference Matrix
          </p>
        </div>
      </div>

      <form onSubmit={handleAnalyze} className="space-y-4">
        {/* Location Input */}
        <div>
          <label className="block text-xs font-semibold text-sandstone-light uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#dfb15b]" />
            <span>Destination / Current Location</span>
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="e.g. Rohtang Pass, Manali or Dashashwamedh Ghat, Varanasi"
            className="w-full px-4 py-3 rounded-xl bg-[#09150e] border border-[#dfb15b]/25 text-white placeholder-sandstone-dark/60 text-sm focus:outline-none focus:border-[#dfb15b] focus:ring-1 focus:ring-[#dfb15b] transition-all"
          />
        </div>

        {/* Travel Time & Crowd Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-sandstone-light uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Travel Time</span>
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#09150e] border border-[#dfb15b]/25 text-white text-sm focus:outline-none focus:border-[#dfb15b] transition-all"
            >
              <option value="day">Day (Normal Visibility)</option>
              <option value="night">Night (Dim Lighting)</option>
              <option value="late night">Late Night (Vulnerable)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-sandstone-light uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#dfb15b]" />
              <span>Crowd Density</span>
            </label>
            <select
              value={crowdLevel}
              onChange={(e) => setCrowdLevel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#09150e] border border-[#dfb15b]/25 text-white text-sm focus:outline-none focus:border-[#dfb15b] transition-all"
            >
              <option value="high">High (Bustling / Public)</option>
              <option value="medium">Medium (Moderate Activity)</option>
              <option value="low">Low (Isolated / Quiet)</option>
            </select>
          </div>
        </div>

        {/* Emergency Flag Toggle */}
        <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[#361313]/30 border border-rose-500/30 cursor-pointer transition-all hover:bg-[#361313]/45">
          <input
            type="checkbox"
            checked={emergency}
            onChange={(e) => setEmergency(e.target.checked)}
            className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
          />
          <span className="text-xs sm:text-sm text-rose-200 font-medium">
            I am currently in an active urgent / distressed situation
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#173825] via-[#245237] to-[#dfb15b] border border-[#dfb15b]/40 text-[#fffdfa] font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(223,177,91,0.35)] hover:shadow-[0_0_35px_rgba(223,177,91,0.6)] transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Evaluating Alpine Safety Neural Graph...' : '⚡ Analyze Safety Protocol'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="mt-6 p-5 rounded-2xl glass-forest-card border border-[#dfb15b]/30 animate-in fade-in zoom-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="text-xs font-mono text-sandstone-muted">
              Location: <strong className="text-white">{result.location}</strong>
            </span>

            {/* Risk Badge */}
            <div
              className={`px-3 py-1 rounded-full border text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 ${
                getRiskBadge(result.risk_level).color
              }`}
            >
              {getRiskBadge(result.risk_level).icon}
              <span>RISK: {result.risk_level}</span>
              <span className="text-[11px] opacity-75">({result.risk_score} pts)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#09150e] border border-[#dfb15b]/20 text-sandstone-light text-xs sm:text-sm leading-relaxed">
            <span className="text-[#dfb15b] font-semibold block mb-1">
              AI Safety Recommendation:
            </span>
            {result.recommendation}
          </div>
        </div>
      )}
    </div>
  );
};
