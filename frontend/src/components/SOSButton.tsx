import React, { useState } from 'react';
import { AlertOctagon, X, Send, CheckCircle2, Siren } from 'lucide-react';
import { sendEmergencyAlert, EmergencyAlertResponse } from '../services/api';

interface SOSButtonProps {
  userLocation?: string;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ userLocation = 'Current GPS Coords' }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState(userLocation);
  const [emergencyType, setEmergencyType] = useState('Unsafe Situation');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<EmergencyAlertResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await sendEmergencyAlert({
        name: name || 'Anonymous Traveler',
        location: location || 'Live Location',
        emergency_type: emergencyType,
        message: message || 'Urgent assistance requested via Safe-Yatra AI SOS',
      });
      setResponse(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setResponse(null);
  };

  return (
    <>
      {/* High-visibility Pulsing SOS Button */}
      <button
        onClick={() => setModalOpen(true)}
        type="button"
        className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 text-white font-extrabold text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(185,28,28,0.5)] hover:shadow-[0_0_45px_rgba(239,68,68,0.85)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
      >
        <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <Siren className="w-4 h-4 animate-spin text-white" />
        <span>SOS Emergency Beacon</span>
      </button>

      {/* Emergency Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg glass-forest border border-rose-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(239,68,68,0.35)]">
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-sandstone-dark hover:text-white hover:bg-rose-950/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-500/50 flex items-center justify-center">
                <AlertOctagon className="w-6 h-6 text-rose-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Emergency Dispatch Beacon</h3>
                <p className="text-xs text-rose-300 font-mono">Immediate Mountain Rescue & Tourism Helpline</p>
              </div>
            </div>

            {response ? (
              <div className="p-5 rounded-2xl bg-[#0d2a1b] border border-emerald-500/40 text-center animate-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-lg font-bold text-white">Alert Broadcasted!</h4>
                <p className="text-xs text-emerald-200 mt-1 font-mono">{response.message}</p>
                <div className="mt-4 p-3.5 rounded-xl bg-[#07130c] text-left text-xs text-sandstone-light space-y-1 font-mono">
                  <p><strong>Tourist:</strong> {response.name}</p>
                  <p><strong>Location:</strong> {response.location}</p>
                  <p><strong>Category:</strong> {response.emergency_type}</p>
                  <p><strong>Status:</strong> <span className="text-rose-400">{response.alert_status}</span></p>
                </div>
                <button
                  onClick={handleClose}
                  className="mt-5 w-full py-2.5 rounded-xl bg-[#14261c] hover:bg-[#1c3627] text-white font-semibold text-xs border border-emerald-500/30 transition-colors"
                >
                  Close Beacon Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-sandstone-light mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#09150e] border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sandstone-light mb-1">Incident Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Rohtang Pass or GPS Coordinates"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#09150e] border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sandstone-light mb-1">Emergency Category</label>
                  <select
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#09150e] border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                  >
                    <option value="Unsafe Situation">Unsafe Situation / Threat</option>
                    <option value="Medical Emergency">Medical Emergency / Altitude</option>
                    <option value="Lost / Disoriented">Lost / Trail Disoriented</option>
                    <option value="Harassment / Scam">Harassment / Scam</option>
                    <option value="Natural Hazard">Weather / Landslide Hazard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sandstone-light mb-1">Detailed Situation Note</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Describe immediate danger, nearby landmarks, or medical assistance needed..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#09150e] border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Dispatching Signals...' : '🚨 Broadcast Emergency SOS'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
