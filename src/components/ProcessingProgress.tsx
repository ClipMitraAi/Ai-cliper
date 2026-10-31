import React from 'react';
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  Cpu,
  Subtitles,
  Smartphone,
  Video,
  FileCheck,
} from 'lucide-react';
import { PipelineStep } from '../types/video';

interface ProcessingProgressProps {
  steps: PipelineStep[];
  currentStepIndex: number;
  overallProgress: number;
  statusMessage: string;
}

export const ProcessingProgress: React.FC<ProcessingProgressProps> = ({
  steps,
  currentStepIndex,
  overallProgress,
  statusMessage,
}) => {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-purple-950/40 via-slate-900/90 to-[#0c0e17] border border-purple-500/40 p-4 sm:p-6 shadow-2xl space-y-6 animate-in fade-in duration-300">
      {/* Header with real-time percentage */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-purple-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                ClipMitra Processing Pipeline
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Live Engine
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{statusMessage}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="text-right">
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-mono">
              {Math.min(100, Math.round(overallProgress))}%
            </div>
            <span className="text-[10px] text-slate-400">Estimated ~15s left</span>
          </div>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-purple-900/40">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 rounded-full transition-all duration-300 shadow-md shadow-purple-500/50"
            style={{ width: `${Math.max(4, overallProgress)}%` }}
          />
        </div>
      </div>

      {/* 8 Granular Pipeline Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {steps.map((step, idx) => {
          const isDone = step.status === 'completed';
          const isCurrent = step.status === 'running';
          const isPending = step.status === 'pending';

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-purple-950/40 border-purple-400 shadow-lg shadow-purple-950/50 scale-[1.02]'
                  : isDone
                  ? 'bg-slate-900/70 border-emerald-500/30'
                  : 'bg-slate-900/30 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  Step 0{idx + 1}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                )}
              </div>
              <h4
                className={`text-xs font-bold ${
                  isCurrent ? 'text-white' : isDone ? 'text-emerald-300' : 'text-slate-400'
                }`}
              >
                {step.title}
              </h4>
              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{step.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
