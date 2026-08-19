import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Menu, User } from 'lucide-react';
import { Sidebar } from './Sidebar';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'glass-forest py-3.5 border-b border-[#dfb15b]/20 shadow-[0_10px_35px_rgba(0,0,0,0.65)]'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Safe-Yatra AI Logo and Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#dfb15b] via-[#34d399] to-[#c59b27] p-[1.5px] shadow-[0_0_20px_rgba(223,177,91,0.3)] group-hover:shadow-[0_0_30px_rgba(223,177,91,0.55)] transition-all">
              <div className="w-full h-full bg-[#0b1711] rounded-xl flex items-center justify-center">
                <Compass className="w-5 h-5 text-[#dfb15b] transition-transform group-hover:rotate-45" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg md:text-xl tracking-tight text-[#fefdfb]">
                Safe-Yatra <span className="text-[#dfb15b]">AI</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-mono tracking-widest text-emerald-400 -mt-0.5">
                Nature Travel Safety
              </span>
            </div>
          </Link>

          {/* Right: Portal Button + Hamburger Menu Button */}
          <div className="flex items-center gap-3.5">
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#f5f1e8] bg-[#12241b]/90 hover:bg-[#1a3327] border border-[#dfb15b]/30 hover:border-[#dfb15b]/60 transition-all duration-300 shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-[#dfb15b]" />
              <span>Portal</span>
            </Link>

            {/* Hamburger Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 rounded-xl glass-forest-card text-sandstone-light hover:text-white hover:border-[#dfb15b]/50 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5 text-[#dfb15b]" />
            </button>
          </div>
        </div>
      </header>

      {/* Slideout Line Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};
