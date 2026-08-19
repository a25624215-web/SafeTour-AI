import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Lock, Mail, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Save user info to localStorage so dashboard can show real name
    const username = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_name', username);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#070e0a] text-sandstone-light flex flex-col justify-between selection:bg-[#dfb15b] selection:text-black">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-28 relative">
        {/* Background Ambient Glow */}
        <div className="absolute w-[500px] h-[500px] bg-[#1a3828]/25 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="w-full max-w-md glass-gold-glow rounded-3xl p-8 border border-[#dfb15b]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#dfb15b] via-[#34d399] to-[#c59b27] p-[1.5px] mx-auto mb-4">
              <div className="w-full h-full bg-[#0a150f] rounded-2xl flex items-center justify-center">
                <Compass className="w-7 h-7 text-[#dfb15b]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#fffdfa]">Tourist Sentinel Login</h2>
            <p className="text-xs text-sandstone-dark font-mono mt-1">Access Alpine Safety Telemetry</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-sandstone-light uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#dfb15b]" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="traveler@safe-yatra.ai"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#09150e] border border-[#dfb15b]/25 text-white placeholder-sandstone-dark/60 text-sm focus:outline-none focus:border-[#dfb15b]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-sandstone-light uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#09150e] border border-[#dfb15b]/25 text-white placeholder-sandstone-dark/60 text-sm focus:outline-none focus:border-[#dfb15b]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#173825] via-[#245237] to-[#dfb15b] text-[#fffdfa] font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(223,177,91,0.35)] hover:shadow-[0_0_35px_rgba(223,177,91,0.6)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <span>Access Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-3.5 text-center">
              <a
                href="/SafeTour-AI/authority-login.html"
                className="text-xs text-sandstone-dark/80 hover:text-[#dfb15b] font-mono tracking-wider transition-colors uppercase"
              >
                Login as Authority
              </a>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-sandstone-dark">
            Don't have a Safe-Yatra pass?{' '}
            <Link to="/register" className="text-[#dfb15b] font-semibold hover:underline">
              Register New Traveler
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
