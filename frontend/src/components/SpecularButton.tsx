import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';

interface SpecularButtonProps {
  onClick?: () => void;
  text?: string;
  className?: string;
  size?: 'md' | 'lg';
}

export const SpecularButton: React.FC<SpecularButtonProps> = ({
  onClick,
  text = 'Start Your Journey',
  className = '',
  size = 'lg',
}) => {
  const sizeClasses =
    size === 'lg'
      ? 'px-8 py-4 text-base md:text-lg'
      : 'px-5 py-2.5 text-sm md:text-base';

  return (
    <button
      onClick={onClick}
      type="button"
      className={`group relative inline-flex items-center justify-center gap-3 font-semibold rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 active:scale-95 ${sizeClasses} ${className}`}
    >
      {/* Outer Dark Green Glass & Warm Golden Border Glow */}
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#dfb15b] via-[#34d399] to-[#c59b27] p-[1.5px] transition-all duration-500 group-hover:shadow-[0_0_35px_rgba(223,177,91,0.55)]">
        <span className="block h-full w-full rounded-2xl bg-[#0c1a13]/90 backdrop-blur-2xl" />
      </span>

      {/* Moving Specular Soft Green / Golden Reflection Sweep */}
      <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-emerald-100/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

      {/* Internal ambient forest green & warm golden highlight on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-[#142e20]/50 via-[#dfb15b]/20 to-[#142e20]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-3 text-[#fdfaf5] tracking-wide font-medium">
        <Compass className="w-5 h-5 text-[#dfb15b] transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110" />
        <span className="font-semibold text-sandstone-light drop-shadow-sm">{text}</span>
        <ArrowRight className="w-4 h-4 text-[#34d399] transition-transform duration-300 group-hover:translate-x-1.5" />
      </span>
    </button>
  );
};
