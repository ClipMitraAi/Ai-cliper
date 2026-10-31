import React from 'react';
import {
  Clock,
  Sparkles,
  Subtitles,
  Smartphone,
  Crop,
  Layers,
  Wand2,
  Volume2,
  Check,
} from 'lucide-react';
import {
  AspectRatio,
  CaptionStyleId,
  ClipConfig,
  SupportedLanguage,
} from '../types/video';
import { CAPTION_STYLES, SUPPORTED_LANGUAGES } from '../utils/caption-generator';

interface ClipSettingsSectionProps {
  config: ClipConfig;
  onChange: (updated: Partial<ClipConfig>) => void;
  onGenerate: () => void;
  isProcessing: boolean;
  hasVideoSelected: boolean;
}

const DURATION_PRESETS = [15, 30, 45, 60, 90, 120];
const QUANTITY_PRESETS: { label: string; value: number | 'all' }[] = [
  { label: '1 Clip', value: 1 },
  { label: '5 Clips (Best)', value: 5 },
  { label: '10 Clips', value: 10 },
  { label: 'All Suitable', value: 'all' },
];

const ASPECT_RATIOS: { id: AspectRatio; label: string; sub: string }[] = [
  { id: '9:16', label: '9:16 Vertical', sub: 'Shorts / Reels / TikTok' },
  { id: '1:1', label: '1:1 Square', sub: 'Instagram Feed' },
  { id: '4:5', label: '4:5 Portrait', sub: 'Social Media' },
  { id: '16:9', label: '16:9 Landscape', sub: 'Standard YouTube' },
];

export const ClipSettingsSection: React.FC<ClipSettingsSectionProps> = ({
  config,
  onChange,
  onGenerate,
  isProcessing,
  hasVideoSelected,
}) => {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0c0e17] border border-purple-900/30 p-4 sm:p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              AI Clipping & Subtitle Configuration
            </h2>
            <p className="text-xs text-slate-400">
              Customize duration, caption style, spoken language, and 9:16 smart framing
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Duration & Clips Count */}
        <div className="space-y-5">
          {/* Duration Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-400" />
              Target Clip Duration
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {DURATION_PRESETS.map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => onChange({ targetDuration: dur })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    config.targetDuration === dur
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30 scale-102'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  {dur}s
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              How Many Clips To Generate
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {QUANTITY_PRESETS.map((q) => (
                <button
                  key={String(q.value)}
                  type="button"
                  onClick={() => onChange({ clipCount: q.value })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    config.clipCount === q.value
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/30'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              Export Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.id}
                  type="button"
                  onClick={() => onChange({ targetAspectRatio: ratio.id })}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    config.targetAspectRatio === ratio.id
                      ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-sm'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{ratio.label}</span>
                    {config.targetAspectRatio === ratio.id && (
                      <Check className="w-3.5 h-3.5 text-indigo-400" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{ratio.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Smart Crop & Silence Removal */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crop className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Smart Active Speaker Centering</span>
                  <span className="text-[11px] text-slate-400">Keep faces and active talker centered in 9:16 frame</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.smartCrop === 'speaker_track'}
                onChange={(e) =>
                  onChange({ smartCrop: e.target.checked ? 'speaker_track' : 'center' })
                }
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-800 border-slate-700 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Silence Removal & Fast Pace Cuts</span>
                  <span className="text-[11px] text-slate-400">Trim pauses & breath gaps for 40% higher retention</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.removeSilence}
                onChange={(e) => onChange({ removeSilence: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 bg-slate-800 border-slate-700 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Captions & Language */}
        <div className="space-y-5">
          {/* Subtitle Language Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Subtitles className="w-4 h-4 text-purple-400" />
                Spoken & Subtitle Language
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">16+ Languages</span>
            </label>
            <div className="relative">
              <select
                value={config.captionLanguage}
                onChange={(e) => onChange({ captionLanguage: e.target.value as SupportedLanguage })}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-800/90 text-white border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs font-semibold appearance-none outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.flag} {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dual-Language Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-200 block">Dual-Language Subtitles</span>
              <span className="text-[11px] text-slate-400">Display original audio + English/Hindi translation below</span>
            </div>
            <input
              type="checkbox"
              checked={config.dualLanguage}
              onChange={(e) => onChange({ dualLanguage: e.target.checked })}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-800 border-slate-700 cursor-pointer"
            />
          </div>

          {/* Caption Style Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Creator Caption Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.values(CAPTION_STYLES).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onChange({ captionStyle: st.id })}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    config.captionStyle === st.id
                      ? 'bg-purple-900/30 border-purple-400 shadow-md shadow-purple-900/30'
                      : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{st.name}</span>
                    {config.captionStyle === st.id && (
                      <Check className="w-3.5 h-3.5 text-purple-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{st.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Resolution */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Export Quality Resolution
            </label>
            <div className="flex flex-wrap gap-2">
              {(['480p', '720p', '1080p', '2k', '4k'] as const).map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => onChange({ exportResolution: res })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    config.exportResolution === res
                      ? 'bg-purple-600 text-white border-purple-400'
                      : 'bg-slate-800/70 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {res.toUpperCase()} {res === '1080p' ? '(Full HD)' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          onClick={onGenerate}
          disabled={isProcessing || !hasVideoSelected}
          className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 transition-all shadow-xl active:scale-[0.99] ${
            isProcessing || !hasVideoSelected
              ? 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-400 text-white shadow-purple-600/30 hover:shadow-purple-600/50 cursor-pointer animate-pulse-subtle'
          }`}
          aria-label="Generate AI Viral Clips"
        >
          <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300" />
          <span>
            {isProcessing
              ? 'Analyzing Dialogue & Generating Clips...'
              : !hasVideoSelected
              ? 'Select or Upload a Video Above to Begin'
              : `Generate ${config.clipCount === 'all' ? 'All Suitable' : config.clipCount} Viral Clips (${config.targetDuration}s)`}
          </span>
        </button>
      </div>
    </div>
  );
};
