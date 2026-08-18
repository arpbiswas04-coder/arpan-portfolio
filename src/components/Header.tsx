import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenDrawer: (tab?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDrawer }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-12 py-6 bg-gradient-to-b from-[#030014]/90 via-[#030014]/40 to-transparent backdrop-blur-[2px]">
      {/* Brand Logo with Interactive Badge */}
      <div 
        onClick={() => onOpenDrawer('ABOUT')}
        className="group flex items-center gap-3 cursor-pointer select-none"
      >
        <span className="font-display text-2xl md:text-3xl tracking-widest text-white transition-colors group-hover:text-[#CCFF00]">
          ARPAN
        </span>
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#CCFF00] text-black flex items-center justify-center font-bold text-base shadow-[0_0_15px_rgba(204,255,0,0.4)] transition-transform duration-500 ease-out group-hover:rotate-180 group-hover:scale-110">
          ✦
        </div>
      </div>

      {/* Center Navigation Links (Hidden on Mobile) */}
      <nav className="hidden md:flex items-center gap-8 font-mono text-xs tracking-widest text-white/70">
        <button
          onClick={() => onOpenDrawer('PROJECTS')}
          className="hover:text-[#CCFF00] transition-colors flex items-center gap-1 uppercase relative group py-1"
        >
          <span>ARCHIVE</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#CCFF00] transition-all duration-300 group-hover:w-full" />
        </button>
        <button
          onClick={() => onOpenDrawer('ABOUT')}
          className="hover:text-[#CCFF00] transition-colors flex items-center gap-1 uppercase relative group py-1"
        >
          <span>PROCESS</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#CCFF00] transition-all duration-300 group-hover:w-full" />
        </button>
        <button
          onClick={() => onOpenDrawer('EXPERIENCE')}
          className="hover:text-[#CCFF00] transition-colors flex items-center gap-1 uppercase relative group py-1"
        >
          <span>LABS</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#CCFF00] transition-all duration-300 group-hover:w-full" />
        </button>
      </nav>

      {/* Action Button: COMMISSION */}
      <button
        onClick={() => onOpenDrawer("LET'S BUILD")}
        className="group relative inline-flex items-center gap-2 font-mono text-xs px-5 py-2.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white hover:border-[#CCFF00] hover:bg-[#CCFF00] hover:text-black font-semibold transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(204,255,0,0.5)] active:scale-95"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#CCFF00] group-hover:text-black transition-colors" />
        <span className="tracking-widest uppercase">COMMISSION</span>
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
    </header>
  );
};
