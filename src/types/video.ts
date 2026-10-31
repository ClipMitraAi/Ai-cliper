export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';

export type CaptionStyleId = 'hormozi' | 'beast' | 'neon' | 'minimal' | 'karaoke';

export type SupportedLanguage =
  | 'auto'
  | 'hi'
  | 'en'
  | 'ur'
  | 'ar'
  | 'bn'
  | 'ta'
  | 'te'
  | 'mr'
  | 'gu'
  | 'pa'
  | 'es'
  | 'fr'
  | 'de'
  | 'ja'
  | 'ko'
  | 'zh';

export interface CaptionWord {
  word: string;
  start: number;
  end: number;
  highlightColor?: string;
}

export interface CaptionCue {
  id: string;
  start: number;
  end: number;
  text: string;
  words: CaptionWord[];
  speaker?: string;
  translation?: string;
}

export interface VideoMetadata {
  id: string;
  title: string;
  sourceUrl?: string;
  fileName?: string;
  fileBlob?: Blob;
  duration: number; // in seconds
  detectedLanguage: SupportedLanguage;
  aspectRatio: string;
  fps?: number;
  thumbnailUrl: string;
  cues: CaptionCue[];
  speakers: string[];
}

export interface ClipConfig {
  targetDuration: number; // in seconds, e.g. 15, 30, 45, 60, 90, 120
  clipCount: number | 'all';
  captionLanguage: SupportedLanguage;
  dualLanguage: boolean;
  secondLanguage?: SupportedLanguage;
  captionStyle: CaptionStyleId;
  captionPosition: 'top' | 'middle' | 'bottom' | number; // percentage from top (e.g. 75)
  captionFontSize: number; // px
  captionColor: string;
  captionHighlightColor: string;
  smartCrop: 'center' | 'speaker_track' | 'split' | 'blur_padding';
  removeSilence: boolean;
  exportResolution: '480p' | '720p' | '1080p' | '2k' | '4k';
  targetAspectRatio: AspectRatio;
}

export interface ViralMetadata {
  title: string;
  shortDescription: string;
  hashtags: string[];
  keywords: string[];
  thumbnailText: string;
  socialCaption: string;
}

export interface ScoreBreakdown {
  hookStrength: number; // 0-100
  speechPace: number; // 0-100
  emotionScore: number; // 0-100
  retentionRate: number; // 0-100
}

export interface GeneratedClip {
  id: string;
  originalVideoId: string;
  originalVideoUrl: string;
  title: string;
  startTime: number; // seconds
  endTime: number; // seconds
  duration: number; // seconds
  viralScore: number; // 0-100
  scoreBreakdown: ScoreBreakdown;
  viralTag: string; // e.g. 'Viral Hook', 'High Retention', 'High Emotion'
  viralReason: string;
  cues: CaptionCue[];
  metadata: ViralMetadata;
  aspectRatio: AspectRatio;
  videoBlobUrl?: string;
  activeSpeakerOffset?: number; // -50 to 50% for smart pan
}

export interface PipelineStep {
  id: string;
  title: string;
  detail: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
}
