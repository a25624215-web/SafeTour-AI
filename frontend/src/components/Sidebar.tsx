import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Sparkles, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  path: string;
}

const navItems: NavItem[] = [
  { name: '— Home', path: '/' },
  { name: '— Safe-Yatra AI', path: '/#features' },
  { name: '— How It Works', path: '/#how-it-works' },
  { name: '— Safety Map', path: '/dashboard#map' },
  { name: '— Smart Tourism', path: '/dashboard' },
  { name: '— Profile', path: '/dashboard#profile' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (item: NavItem) => {
    onClose();
    if (item.path.startsWith('/#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.querySelector(item.path.replace('/', ''));
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.querySelector(item.path.replace('/', ''));
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (item.path.includes('#')) {
      const [basePath, hash] = item.path.split('#');
      navigate(basePath);
      setTimeout(() => {
        const el = document.getElementById(hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      navigate(item.path);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Glass Forest Sidebar Panel */}
      <div className="fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] glass-gold-glow border-l border-[#dfb15b]/25 p-6 flex flex-col justify-between shadow-[0_0_60px_rgba(0,0,0,0.9)] animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#dfb15b]/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#dfb15b] to-[#34d399] p-[1.5px]">
                <div className="w-full h-full bg-[#0a150f] rounded-lg flex items-center justify-center">
                  <Compass className="w-4 h-4 text-[#dfb15b]" />
                </div>
              </div>
              <span className="font-bold text-base tracking-wide text-[#fdfaf5]">
                Safe-Yatra <span className="text-[#dfb15b]">AI</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-sandstone-dark hover:text-white hover:bg-[#15291e] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Minimal Line Navigation Items */}
          <nav className="mt-8 flex flex-col space-y-4">
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname === item.path ||
                    (item.path.startsWith('/dashboard') && location.pathname === '/dashboard');

              return (
                <button
                  key={item.name}
                  onClick={() => handleNav(item)}
                  className={`group relative flex items-center text-left py-2 px-3 rounded-lg text-sm md:text-base font-medium tracking-wide transition-all duration-300 ${
                    isActive
                      ? 'text-[#fffdfa] bg-[#1a3325]/80 border-l-2 border-emerald-400 pl-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : 'text-sandstone-muted hover:text-emerald-300 hover:pl-4 border-l-2 border-transparent hover:border-emerald-500/50'
                  }`}
                >
                  <span className="relative z-10 transition-colors">
                    {item.name}
                  </span>
                  {isActive && (
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 ml-auto" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Status */}
        <div className="pt-6 border-t border-[#dfb15b]/20">
          <div className="p-3.5 rounded-xl bg-[#09150e] border border-[#dfb15b]/20 flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <p className="text-xs font-semibold text-[#f5f1e8]">Alpine Sentinel Active</p>
              <p className="text-[11px] text-emerald-400 font-mono">Spatial Telemetry: LIVE</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
