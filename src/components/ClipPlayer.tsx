import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { CaptionStyleId, GeneratedClip } from '../types/video';
import { CAPTION_STYLES, getActiveCueAndWord } from '../utils/caption-generator';

interface ClipPlayerProps {
  clip: GeneratedClip;
  videoSrc: string;
  captionStyleId?: CaptionStyleId;
  captionPosition?: 'top' | 'middle' | 'bottom' | number;
  captionFontSize?: number;
  dualLanguage?: boolean;
  onEdit?: () => void;
  aspectRatio?: string;
  autoPlay?: boolean;
}

export const ClipPlayer: React.FC<ClipPlayerProps> = ({
  clip,
  videoSrc,
  captionStyleId = 'hormozi',
  captionPosition = 'bottom',
  captionFontSize = 18,
  dualLanguage = false,
  aspectRatio = '9:16',
  autoPlay = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(clip.startTime);
  const [isMuted, setIsMuted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const styleConfig = CAPTION_STYLES[captionStyleId] || CAPTION_STYLES.hormozi;

  // Sync video time bounds
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = clip.startTime;
      setCurrentTime(clip.startTime);
    }
  }, [clip.startTime, clip.id]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      if (videoRef.current.currentTime >= clip.endTime) {
        videoRef.current.currentTime = clip.startTime;
      }
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    setCurrentTime(cur);

    // Loop clip within its start and end timestamps
    if (cur >= clip.endTime) {
      videoRef.current.currentTime = clip.startTime;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value); // 0 to 1
    const newTime = clip.startTime + newProgress * clip.duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  };

  // Determine current active cue and word
  const { currentCue, activeWordIndex } = getActiveCueAndWord(clip.cues, currentTime);

  // Calculate relative progress (0 to 1)
  const relativeTime = Math.max(0, currentTime - clip.startTime);
  const progressRatio = Math.min(1, Math.max(0, relativeTime / (clip.duration || 1)));

  // Calculate position class/style
  let positionStyle: React.CSSProperties = { bottom: '15%' };
  if (typeof captionPosition === 'number') {
    positionStyle = { top: `${captionPosition}%` };
  } else if (captionPosition === 'top') {
    positionStyle = { top: '14%' };
  } else if (captionPosition === 'middle') {
    positionStyle = { top: '50%', transform: 'translateY(-50%)' };
  }

  // Active speaker pan offset percentage (e.g. -10% or +10%)
  const speakerOffsetPercent = (clip.activeSpeakerOffset || 0) * 1.5;

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[9/16] max-w-[320px] sm:max-w-[340px] mx-auto rounded-2xl overflow-hidden bg-black shadow-2xl border border-purple-500/30 group select-none flex items-center justify-center"
    >
      {/* Background blurred ambiance */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none z-10" />

      {/* Actual HTML5 Video element */}
      <video
        ref={videoRef}
        src={videoSrc || clip.originalVideoUrl}
        playsInline
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={() => setVideoLoaded(true)}
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer"
        style={{
          objectPosition: `${50 + speakerOffsetPercent}% center`,
        }}
      />

      {/* Fallback visualizer if video has no source */}
      {!videoSrc && !clip.originalVideoUrl && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950 z-0">
          <Sparkles className="w-10 h-10 text-purple-400 mb-2 animate-bounce" />
          <p className="text-xs text-slate-300 font-semibold">{clip.title}</p>
        </div>
      )}

      {/* Viral Hook Badge Overlay (Top Left) */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-purple-500/40 text-[11px] font-extrabold text-purple-200">
        <Sparkles className="w-3 h-3 text-yellow-300" />
        <span>{clip.viralTag}</span>
        <span className="text-yellow-400 font-black">{clip.viralScore}%</span>
      </div>

      {/* Aspect Ratio Badge (Top Right) */}
      <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-slate-300">
        {aspectRatio}
      </div>

      {/* Live Synchronized Dynamic Subtitles Overlay */}
      {currentCue && (
        <div
          className="absolute left-3 right-3 z-20 flex flex-col items-center justify-center pointer-events-none text-center transition-all duration-150"
          style={positionStyle}
        >
          <div className={`${styleConfig.containerBgClass} max-w-[92%]`}>
            {/* Word-by-word rendered text */}
            <div
              className={`flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 ${styleConfig.fontClass}`}
              style={{ fontSize: `${captionFontSize}px` }}
            >
              {currentCue.words && currentCue.words.length > 0 ? (
                currentCue.words.map((w, wIdx) => {
                  const isActive = wIdx === activeWordIndex;
                  return (
                    <span
                      key={wIdx}
                      className={isActive ? styleConfig.activeWordClass : styleConfig.inactiveWordClass}
                    >
                      {w.word}
                    </span>
                  );
                })
              ) : (
                <span className={styleConfig.activeWordClass}>{currentCue.text}</span>
              )}
            </div>

            {/* Optional Dual Language Subtitle Translation */}
            {dualLanguage && currentCue.translation && (
              <div className="mt-1 pt-1 border-t border-white/20 text-xs font-medium text-purple-200/90 tracking-normal">
                {currentCue.translation}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Center Play/Pause button when paused */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white flex items-center justify-center z-20 shadow-xl shadow-purple-900/60 transition-transform active:scale-90"
          aria-label="Play Video Clip"
        >
          <Play className="w-6 h-6 fill-white ml-0.5" />
        </button>
      )}

      {/* Bottom Interactive Playback Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent space-y-2 opacity-95 group-hover:opacity-100 transition-opacity">
        {/* Scrub Bar */}
        <div className="relative flex items-center group/scrub">
          <input
            type="range"
            min="0"
            max="1"
            step="0.005"
            value={progressRatio}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-700/80 rounded-full appearance-none cursor-pointer accent-purple-400"
            aria-label="Scrub video timeline"
          />
        </div>

        {/* Action icons & Timecode */}
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-1 hover:text-purple-400 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = clip.startTime;
                }
              }}
              className="p-1 hover:text-purple-400 transition-colors"
              aria-label="Restart Clip"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleMute}
              className="p-1 hover:text-purple-400 transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <span className="font-mono text-[11px] text-slate-300">
              {relativeTime.toFixed(1)}s / {clip.duration.toFixed(1)}s
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFullscreen}
              className="p-1 hover:text-purple-400 transition-colors"
              aria-label="Enter Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
