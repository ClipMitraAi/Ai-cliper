import React from 'react';
import { Scissors, Sparkles, Shield, Cpu, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onOpenConfig: () => void;
  clipsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenConfig, clipsCount = 0 }) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#090A0F]/85 border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-900/40">
            <div className="w-full h-full bg-[#0E1017] rounded-[10px] flex items-center justify-center">
              <Scissors className="w-5 h-5 text-purple-400 rotate-90" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-cyan-300 bg-clip-text text-transparent">
                ClipMitra
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Auto Video Clipper & Viral Shorts Generator
            </p>
          </div>
        </div>

        {/* Badges and Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Free-First & Local Fast</span>
          </div>

          {clipsCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>{clipsCount} Clips Ready</span>
            </div>
          )}

          <button
            onClick={onOpenConfig}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-slate-700/60 text-xs font-semibold transition-all shadow-sm active:scale-95"
            aria-label="Open AI Model and Privacy Settings"
          >
            <Cpu className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Engine & Privacy</span>
          </button>
        </div>
      </div>
    </header>
  );
};
