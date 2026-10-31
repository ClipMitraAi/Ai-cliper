import React, { useState } from 'react';
import {
  X,
  Sliders,
  Type,
  Subtitles,
  Smartphone,
  Save,
  Download,
  RotateCcw,
  Sparkles,
  AlignVerticalJustifyCenter,
  MoveVertical,
} from 'lucide-react';
import { AspectRatio, CaptionCue, CaptionStyleId, GeneratedClip } from '../types/video';
import { ClipPlayer } from './ClipPlayer';
import { CAPTION_STYLES } from '../utils/caption-generator';
import { downloadClipMetadata, downloadClipSrt } from '../utils/export-video';

interface ClipEditorModalProps {
  clip: GeneratedClip;
  videoSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedClip: GeneratedClip) => void;
}

export const ClipEditorModal: React.FC<ClipEditorModalProps> = ({
  clip,
  videoSrc,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [startTime, setStartTime] = useState(clip.startTime);
  const [endTime, setEndTime] = useState(clip.endTime);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(clip.aspectRatio || '9:16');
  const [captionStyle, setCaptionStyle] = useState<CaptionStyleId>('hormozi');
  const [captionPosition, setCaptionPosition] = useState<number>(75); // 75% down screen
  const [fontSize, setFontSize] = useState<number>(20);
  const [cues, setCues] = useState<CaptionCue[]>(clip.cues || []);
  const [activeTab, setActiveTab] = useState<'timing' | 'subtitles' | 'styling'>('timing');

  const currentDuration = Math.max(1, Number((endTime - startTime).toFixed(1)));

  // Update cue text
  const handleUpdateCueText = (cueId: string, newText: string) => {
    setCues(prev =>
      prev.map(c => {
        if (c.id !== cueId) return c;
        const words = newText.trim().split(/\s+/).map((w, idx) => {
          const wDur = (c.end - c.start) / Math.max(1, newText.split(/\s+/).length);
          return {
            word: w,
            start: Number((c.start + idx * wDur).toFixed(2)),
            end: Number((c.start + (idx + 1) * wDur).toFixed(2)),
          };
        });
        return { ...c, text: newText, words };
      })
    );
  };

  const handleApply = () => {
    onSave({
      ...clip,
      startTime: Number(startTime),
      endTime: Number(endTime),
      duration: currentDuration,
      aspectRatio,
      cues,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#131522] to-[#0a0b12] rounded-2xl border border-purple-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-900/40 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-600/20 text-purple-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Clip Studio & Subtitle Editor</span>
                <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-normal">
                  {currentDuration}s
                </span>
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1">{clip.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Close Editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Real-time 9:16 Video Player Preview */}
          <div className="md:col-span-5 flex flex-col items-center justify-start space-y-3">
            <div className="w-full max-w-[280px]">
              <ClipPlayer
                clip={{
                  ...clip,
                  startTime,
                  endTime,
                  duration: currentDuration,
                  aspectRatio,
                  cues,
                }}
                videoSrc={videoSrc}
                captionStyleId={captionStyle}
                captionPosition={captionPosition}
                captionFontSize={fontSize}
                aspectRatio={aspectRatio}
              />
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Real-time synchronized 9:16 vertical preview with active caption rendering
            </p>
          </div>

          {/* Right Column: Controls & Tabs */}
          <div className="md:col-span-7 space-y-5">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('timing')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'timing'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1. Trim & Ratio
              </button>
              <button
                onClick={() => setActiveTab('subtitles')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'subtitles'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2. Edit Subtitles ({cues.length})
              </button>
              <button
                onClick={() => setActiveTab('styling')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'styling'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                3. Font & Style
              </button>
            </div>

            {/* Tab 1: Timing & Aspect Ratio */}
            {activeTab === 'timing' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase">Trim Timestamps</span>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      Duration: {currentDuration}s
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Start Time (sec)</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max={endTime - 1}
                        value={startTime}
                        onChange={(e) => setStartTime(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">End Time (sec)</label>
                      <input
                        type="number"
                        step="0.5"
                        min={startTime + 1}
                        value={endTime}
                        onChange={(e) => setEndTime(Math.max(startTime + 1, parseFloat(e.target.value) || startTime + 1))}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Aspect Ratio Switcher */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">Aspect Ratio Format</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['9:16', '1:1', '4:5', '16:9'] as AspectRatio[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setAspectRatio(r)}
                        className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all ${
                          aspectRatio === r
                            ? 'bg-purple-600 text-white border-purple-400'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Subtitle dialogue editor */}
            {activeTab === 'subtitles' && (
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {cues.length === 0 ? (
                  <p className="text-xs text-slate-400 p-4 text-center">No dialogue subtitles found.</p>
                ) : (
                  cues.map((cue, idx) => (
                    <div
                      key={cue.id}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>Line #{idx + 1}</span>
                        <span>
                          {cue.start.toFixed(1)}s - {cue.end.toFixed(1)}s
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={cue.text}
                        onChange={(e) => handleUpdateCueText(cue.id, e.target.value)}
                        className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-purple-500 text-xs font-medium outline-none"
                      />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: Font, Style & Position */}
            {activeTab === 'styling' && (
              <div className="space-y-4">
                {/* Caption Style selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">Preset Styles</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(CAPTION_STYLES).map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setCaptionStyle(st.id)}
                        className={`p-2 rounded-xl text-left border transition-all ${
                          captionStyle === st.id
                            ? 'bg-purple-900/40 border-purple-400 text-white'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300'
                        }`}
                      >
                        <span className="text-xs font-bold block">{st.name}</span>
                        <span className="text-[10px] text-slate-400 line-clamp-1">{st.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vertical Position Slider */}
                <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <MoveVertical className="w-4 h-4 text-purple-400" />
                      Subtitle Vertical Position ({captionPosition}%)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {captionPosition < 40 ? 'Top' : captionPosition > 65 ? 'Lower Third' : 'Center'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="85"
                    value={captionPosition}
                    onChange={(e) => setCaptionPosition(parseInt(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                {/* Font Size Slider */}
                <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Type className="w-4 h-4 text-cyan-400" />
                      Caption Font Size ({fontSize}px)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="32"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Quick Export SRT / Metadata */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => downloadClipSrt(clip)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Subtitles className="w-3.5 h-3.5 text-purple-400" />
                <span>Export .SRT</span>
              </button>
              <button
                onClick={() => downloadClipMetadata(clip)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export Metadata .TXT</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-purple-900/40 bg-slate-900/80">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Apply Changes to Clip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
