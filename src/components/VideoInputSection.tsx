import React, { useState, useRef } from 'react';
import {
  Link2,
  UploadCloud,
  FileVideo,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Film,
} from 'lucide-react';
import { detectVideoPlatform, PlatformInfo } from '../utils/video-analysis';
import { SAMPLE_VIDEOS } from '../utils/sampleVideos';
import { VideoMetadata } from '../types/video';

interface VideoInputSectionProps {
  currentVideo: VideoMetadata | null;
  videoUrlInput: string;
  onUrlChange: (url: string) => void;
  onSelectSample: (sample: typeof SAMPLE_VIDEOS[0]) => void;
  onFileUpload: (file: File) => void;
  onResetVideo: () => void;
}

export const VideoInputSection: React.FC<VideoInputSectionProps> = ({
  currentVideo,
  videoUrlInput,
  onUrlChange,
  onSelectSample,
  onFileUpload,
  onResetVideo,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>(() => detectVideoPlatform(videoUrlInput));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlInput = (val: string) => {
    onUrlChange(val);
    setPlatformInfo(detectVideoPlatform(val));
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleUrlInput(text);
      }
    } catch {
      // Clipboard permissions may be restricted
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/') || file.name.match(/\.(mp4|mov|mkv|webm)$/i)) {
        onFileUpload(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <section className="w-full space-y-6">
      {/* Hero Headline */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Turn Long Videos Into Viral 9:16 Shorts In 1-Click</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Auto Video Clipper with{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">
            AI Captions
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Paste any authorized video link or upload your footage. ClipMitra extracts viral moments,
          centers speakers in 9:16, generates synced subtitles, and writes viral SEO titles.
        </p>
      </div>

      {/* Main Input Card */}
      <div className="relative rounded-2xl bg-gradient-to-b from-purple-900/20 via-slate-900/80 to-[#0c0e17] border border-purple-800/30 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
        
        {/* Selected Video Active Banner */}
        {currentVideo ? (
          <div className="rounded-xl bg-purple-950/40 border border-purple-500/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 border border-purple-500/40">
                {currentVideo.thumbnailUrl ? (
                  <img
                    src={currentVideo.thumbnailUrl}
                    alt={currentVideo.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-900/40">
                    <Film className="w-6 h-6 text-purple-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Ready For Clipping
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {Math.floor(currentVideo.duration / 60)}m {Math.floor(currentVideo.duration % 60)}s
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                  {currentVideo.title}
                </h3>
                <p className="text-xs text-purple-300 font-medium">
                  Spoken Language: <span className="uppercase font-bold">{currentVideo.detectedLanguage}</span> • {currentVideo.cues.length} dialogue sentences parsed
                </p>
              </div>
            </div>

            <button
              onClick={onResetVideo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors self-end sm:self-center"
              aria-label="Change Video Source"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Change Video</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* URL Input Box */}
            <div className="space-y-2">
              <label htmlFor="video-url-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Paste Video Link (YouTube, Instagram, Facebook, TikTok, Vimeo, Direct URL)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400">
                  <Link2 className="w-5 h-5 text-purple-400" />
                </div>
                <input
                  id="video-url-input"
                  type="text"
                  value={videoUrlInput}
                  onChange={(e) => handleUrlInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://instagram.com/reel/..."
                  className="w-full pl-11 pr-24 py-3.5 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm font-medium transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={handlePaste}
                  className="absolute right-2 px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 text-xs font-semibold border border-purple-500/30 transition-all"
                  aria-label="Paste video URL from clipboard"
                >
                  Paste
                </button>
              </div>

              {/* Detected Platform Pill & Safety Notice */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                {videoUrlInput && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Detected Source:</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold border text-[11px] ${platformInfo.badgeColor}`}>
                      {platformInfo.label}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] ml-auto">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>Authorized sources & direct streams supported. No DRM bypass.</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                OR UPLOAD VIDEO FILE
              </span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-purple-400 bg-purple-950/30 scale-[0.99]'
                  : 'border-slate-700/80 hover:border-purple-500/60 bg-slate-900/40 hover:bg-slate-900/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/x-matroska,video/webm,.mp4,.mov,.mkv,.webm"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload video file input"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    <span className="text-purple-400 hover:underline">Click to browse</span> or drag & drop video
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Supports MP4, MOV, MKV, and WEBM • Up to 500MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Sample Presets */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Quick Test: High-Engagement Creator Samples
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Instant 1-click test with real synchronized speech
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_VIDEOS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => onSelectSample(sample)}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all group ${
                  currentVideo?.id === sample.id
                    ? 'bg-purple-900/30 border-purple-500 shadow-md shadow-purple-900/20'
                    : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700'
                }`}
                aria-label={`Select sample video: ${sample.title}`}
              >
                <div className="relative w-14 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700/60">
                  <img
                    src={sample.thumbnailUrl}
                    alt={sample.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 text-white fill-white" />
                  </div>
                </div>
                <div className="min-w-0 space-y-0.5">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                    {sample.badge}
                  </span>
                  <h4 className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-purple-300 transition-colors">
                    {sample.title}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {sample.duration}s • {sample.category}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
