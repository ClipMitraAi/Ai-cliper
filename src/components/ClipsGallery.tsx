import React, { useState } from 'react';
import {
  Download,
  Archive,
  Edit3,
  Copy,
  Check,
  Sparkles,
  Share2,
  Clock,
  Film,
  Subtitles,
  Hash,
  Flame,
  FileText,
} from 'lucide-react';
import { CaptionStyleId, GeneratedClip } from '../types/video';
import { ClipPlayer } from './ClipPlayer';
import {
  downloadClipMetadata,
  downloadClipSrt,
  downloadAllClipsZip,
  downloadFile,
} from '../utils/export-video';

interface ClipsGalleryProps {
  clips: GeneratedClip[];
  videoSrc: string;
  captionStyleId: CaptionStyleId;
  dualLanguage: boolean;
  onEditClip: (clip: GeneratedClip) => void;
  onRegenerateClip: (clip: GeneratedClip) => void;
}

export const ClipsGallery: React.FC<ClipsGalleryProps> = ({
  clips,
  videoSrc,
  captionStyleId,
  dualLanguage,
  onEditClip,
  onRegenerateClip,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string>('all');
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState<{ percent: number; status: string } | null>(null);
  const [downloadingClipId, setDownloadingClipId] = useState<string | null>(null);

  const filteredClips = filterTag === 'all'
    ? clips
    : clips.filter(c => c.viralTag.toLowerCase().includes(filterTag.toLowerCase()));

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadAllZip = async () => {
    try {
      setIsZipping(true);
      await downloadAllClipsZip(clips, (percent, status) => {
        setZipProgress({ percent, status });
      });
    } catch (err) {
      console.error('ZIP generation failed:', err);
    } finally {
      setIsZipping(false);
      setZipProgress(null);
    }
  };

  const handleDownloadSingleClip = (clip: GeneratedClip) => {
    setDownloadingClipId(clip.id);
    // If direct videoSrc is available, trigger immediate download
    const cleanTitle = clip.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    if (clip.videoBlobUrl || videoSrc) {
      downloadFile(clip.videoBlobUrl || videoSrc, `ClipMitra_${cleanTitle}.mp4`);
      // Also download associated SRT
      downloadClipSrt(clip);
    } else {
      downloadClipMetadata(clip);
    }
    setTimeout(() => setDownloadingClipId(null), 1500);
  };

  if (!clips || clips.length === 0) {
    return null;
  }

  // Calculate average viral potential
  const avgViralScore = Math.round(
    clips.reduce((acc, c) => acc + c.viralScore, 0) / clips.length
  );

  return (
    <section className="w-full space-y-6 pt-4 animate-in fade-in duration-500">
      {/* Gallery Header & Stats */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-900/30 via-indigo-950/40 to-slate-900/80 border border-purple-800/40 p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-white">
              Generated Viral Clips Gallery
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono">
              {clips.length} Clips
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2">
            <span>Average AI Engagement Potential:</span>
            <span className="font-extrabold text-yellow-400 font-mono text-sm">
              {avgViralScore}%
            </span>
            <span className="text-slate-500 text-xs">(Estimated)</span>
          </p>
        </div>

        {/* Global Download All ZIP Button */}
        <div className="w-full sm:w-auto">
          <button
            onClick={handleDownloadAllZip}
            disabled={isZipping}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-xl transition-all active:scale-95 ${
              isZipping
                ? 'bg-purple-800/60 text-purple-300 border border-purple-600/40 cursor-wait'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-700/30 hover:shadow-emerald-700/50 cursor-pointer'
            }`}
            aria-label="Download All Clips as ZIP Archive"
          >
            <Archive className="w-4 h-4" />
            <span>
              {isZipping
                ? zipProgress?.status || 'Creating ZIP...'
                : `Download All ${clips.length} Clips (ZIP)`}
            </span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { id: 'all', label: 'All Clips' },
          { id: 'viral hook', label: '🔥 Viral Hooks' },
          { id: 'retention', label: '📈 High Retention' },
          { id: 'fast', label: '⚡ Fast Paced' },
          { id: 'educational', label: '💡 Educational Gold' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterTag(f.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
              filterTag === f.id
                ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Responsive Clips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClips.map((clip, index) => {
          return (
            <div
              key={clip.id}
              className="rounded-2xl bg-gradient-to-b from-[#10121d] to-[#0a0b12] border border-purple-900/30 hover:border-purple-500/40 p-4 shadow-xl flex flex-col justify-between space-y-4 transition-all hover:shadow-2xl hover:shadow-purple-950/40 group"
            >
              {/* Clip Video Player Preview */}
              <div className="w-full flex justify-center">
                <ClipPlayer
                  clip={clip}
                  videoSrc={videoSrc}
                  captionStyleId={captionStyleId}
                  dualLanguage={dualLanguage}
                  aspectRatio={clip.aspectRatio}
                />
              </div>

              {/* Clip Details & Metadata */}
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      {clip.startTime.toFixed(1)}s - {clip.endTime.toFixed(1)}s ({clip.duration}s)
                    </span>
                    <span className="text-[11px] font-extrabold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                      Score: {clip.viralScore}%
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                    {clip.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {clip.viralReason}
                  </p>
                </div>

                {/* Viral Hook / Thumbnail Text Preview */}
                <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-purple-300 font-bold uppercase">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" />
                      Thumbnail Hook Text
                    </span>
                    <button
                      onClick={() => handleCopyText(clip.metadata.thumbnailText, `hook-${clip.id}`)}
                      className="text-purple-400 hover:text-white flex items-center gap-1"
                      aria-label="Copy Thumbnail Text"
                    >
                      {copiedId === `hook-${clip.id}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <p className="font-extrabold text-amber-300 text-xs">
                    "{clip.metadata.thumbnailText}"
                  </p>
                </div>

                {/* Social Caption & Hashtags One-Click Copy */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyText(clip.metadata.socialCaption, `caption-${clip.id}`)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedId === `caption-${clip.id}` ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-purple-400" />
                    )}
                    <span>{copiedId === `caption-${clip.id}` ? 'Copied!' : 'Copy Social Caption'}</span>
                  </button>

                  <button
                    onClick={() => downloadClipSrt(clip)}
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-semibold"
                    title="Download .SRT Subtitles"
                    aria-label="Download SRT subtitles"
                  >
                    <Subtitles className="w-4 h-4 text-purple-400" />
                  </button>

                  <button
                    onClick={() => downloadClipMetadata(clip)}
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-semibold"
                    title="Download Metadata .TXT"
                    aria-label="Download metadata txt"
                  >
                    <FileText className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>

                {/* Primary Card Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => onEditClip(clip)}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    aria-label={`Edit Clip ${clip.title}`}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Edit Clip</span>
                  </button>

                  <button
                    onClick={() => handleDownloadSingleClip(clip)}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 transition-all active:scale-95 cursor-pointer"
                    aria-label={`Download MP4 for ${clip.title}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>
                      {downloadingClipId === clip.id ? 'Saving...' : 'Download MP4'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
