import { CaptionCue, CaptionStyleId, CaptionWord, SupportedLanguage } from '../types/video';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'auto', name: 'Auto Detect Language', nativeName: 'Automatic Detection', flag: '🌐' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English (US/UK)', flag: '🇺🇸' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

export interface CaptionStyleConfig {
  id: CaptionStyleId;
  name: string;
  description: string;
  fontClass: string;
  activeWordClass: string;
  inactiveWordClass: string;
  containerBgClass: string;
  previewBg: string;
}

export const CAPTION_STYLES: Record<CaptionStyleId, CaptionStyleConfig> = {
  hormozi: {
    id: 'hormozi',
    name: 'Alex Hormozi Viral',
    description: 'Thick bold uppercase, bright yellow active word, deep black stroke',
    fontClass: 'font-extrabold uppercase tracking-wide text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]',
    activeWordClass: 'text-[#FFE600] scale-110 drop-shadow-[0_0_12px_rgba(255,230,0,0.8)] inline-block transition-transform duration-100',
    inactiveWordClass: 'text-white opacity-90',
    containerBgClass: 'bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10',
    previewBg: 'from-amber-500/20 to-yellow-600/30',
  },
  beast: {
    id: 'beast',
    name: 'MrBeast Dynamic',
    description: 'Vibrant neon green & cyan pop, high contrast creator animation',
    fontClass: 'font-black uppercase tracking-wider text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)]',
    activeWordClass: 'text-[#00FF66] scale-115 drop-shadow-[0_0_16px_rgba(0,255,102,0.9)] inline-block font-extrabold',
    inactiveWordClass: 'text-slate-100',
    containerBgClass: 'bg-black/70 px-4 py-2 rounded-xl border border-emerald-500/30 shadow-2xl',
    previewBg: 'from-emerald-500/20 to-teal-600/30',
  },
  neon: {
    id: 'neon',
    name: 'Cyberpunk Neon',
    description: 'Electrifying magenta and cyan glow for gaming and tech reels',
    fontClass: 'font-bold tracking-normal text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]',
    activeWordClass: 'text-[#FF007A] scale-110 drop-shadow-[0_0_18px_rgba(255,0,122,1)] font-black inline-block',
    inactiveWordClass: 'text-cyan-100/90',
    containerBgClass: 'bg-black/80 px-4 py-2 rounded-xl border border-pink-500/40 shadow-lg shadow-pink-500/20',
    previewBg: 'from-fuchsia-600/20 to-cyan-600/20',
  },
  minimal: {
    id: 'minimal',
    name: 'Clean Minimalist',
    description: 'Elegant Apple-style translucent blur with crisp modern typography',
    fontClass: 'font-semibold tracking-tight text-white drop-shadow-sm',
    activeWordClass: 'text-purple-300 font-bold underline decoration-purple-400 decoration-2 underline-offset-4',
    inactiveWordClass: 'text-slate-200',
    containerBgClass: 'bg-black/45 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15',
    previewBg: 'from-slate-700/30 to-purple-800/30',
  },
  karaoke: {
    id: 'karaoke',
    name: 'Karaoke Wave',
    description: 'Smooth gradient highlighting word by word as sound passes',
    fontClass: 'font-extrabold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]',
    activeWordClass: 'bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent scale-105 inline-block font-black',
    inactiveWordClass: 'text-white/80',
    containerBgClass: 'bg-black/65 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-amber-500/20',
    previewBg: 'from-amber-600/20 to-red-600/20',
  },
};

// Formats timestamp in seconds to SRT time format: 00:01:23,450
export function formatSecondsToSrtTime(totalSec: number): string {
  const safeSec = Math.max(0, totalSec);
  const totalFloor = Math.floor(safeSec);
  const hours = Math.floor(totalFloor / 3600);
  const minutes = Math.floor((totalFloor % 3600) / 60);
  const seconds = totalFloor % 60;
  const ms = Math.round((safeSec - totalFloor) * 1000);

  const pad = (n: number, z = 2) => String(n).padStart(z, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(ms, 3)}`;
}

// Convert cues array to a standard .SRT subtitle string
export function exportToSrt(cues: CaptionCue[], offsetStart: number = 0): string {
  if (!cues || cues.length === 0) return '';

  return cues
    .map((cue, index) => {
      const start = Math.max(0, cue.start - offsetStart);
      const end = Math.max(start + 0.1, cue.end - offsetStart);
      const text = cue.translation ? `${cue.text}\n${cue.translation}` : cue.text;

      return `${index + 1}\n${formatSecondsToSrtTime(start)} --> ${formatSecondsToSrtTime(end)}\n${text}\n`;
    })
    .join('\n');
}

// Finds current active cue and current active word given video playback time
export function getActiveCueAndWord(
  cues: CaptionCue[],
  currentTime: number
): {
  currentCue: CaptionCue | null;
  activeWordIndex: number;
} {
  if (!cues || cues.length === 0) {
    return { currentCue: null, activeWordIndex: -1 };
  }

  const currentCue = cues.find(c => currentTime >= c.start && currentTime <= c.end) || null;
  if (!currentCue || !currentCue.words || currentCue.words.length === 0) {
    return { currentCue, activeWordIndex: -1 };
  }

  const activeWordIndex = currentCue.words.findIndex(
    w => currentTime >= w.start && currentTime <= w.end
  );

  return {
    currentCue,
    activeWordIndex: activeWordIndex !== -1 ? activeWordIndex : 0,
  };
}
