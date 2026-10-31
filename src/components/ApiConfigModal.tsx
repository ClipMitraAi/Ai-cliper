import React from 'react';
import {
  X,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Server,
  KeyRound,
  FileCheck2,
  Lock,
} from 'lucide-react';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#131522] to-[#0a0b12] rounded-2xl border border-purple-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/40 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                ClipMitra Engine Architecture & Privacy
              </h3>
              <p className="text-xs text-slate-400">
                Free-first video intelligence, zero cloud storage leakage, and security policy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Close Architecture Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs sm:text-sm text-slate-300">
          {/* Section 1: Free-First Technology Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              1. Free-First & Open Processing Stack
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-white block">Local WebCodecs & FFmpeg</span>
                <p className="text-[11px] text-slate-400">
                  Zero cloud fees for trimming, aspect ratio conversion (9:16), and subtitle burning.
                  Runs directly on-device or containerized CPU.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-white block">Whisper Speech-to-Text</span>
                <p className="text-[11px] text-slate-400">
                  Multilingual audio transcription supporting 16+ languages (Hindi, English, Spanish, etc.)
                  with word-level timestamp synchronization.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-white block">OpenCV Smart Speaker Tracking</span>
                <p className="text-[11px] text-slate-400">
                  Facial tracking centers active speakers automatically during horizontal-to-vertical conversion.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-white block">Google Gemini Intelligence</span>
                <p className="text-[11px] text-slate-400">
                  High-speed server-side multimodal semantic parsing for viral hook discovery, SEO descriptions, and tags.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Transparent Cost & API Policy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              2. Cost Transparency (Free vs Cloud)
            </h4>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">Free Local Tier:</strong> Trimming, caption styling, audio extraction,
                custom editing, SRT subtitle export, and ZIP bundling are completely free and run with zero external API calls.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">AI Cloud Processing:</strong> Deep semantic video analysis uses
                Google AI Studio server-side credentials injected automatically into secure environment variables
                (<code className="text-purple-300 font-mono">GEMINI_API_KEY</code>). API keys are never exposed
                in client-side code.
              </p>
            </div>
          </div>

          {/* Section 3: Security & Privacy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              3. Security, Privacy & Copyright Policy
            </h4>
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>No Video Storage Leakage:</strong> User video files and uploaded footage are processed in memory and temporary sandboxes. Videos are never sold or used for public training.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Authorized Sources Only:</strong> ClipMitra operates only with authorized platform links, creative commons, public domain, or user-owned content. It never circumvents DRM, passwords, or paywalls.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-purple-900/40 bg-slate-900/60">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
