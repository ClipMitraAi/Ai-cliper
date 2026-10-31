import {
  CaptionCue,
  ClipConfig,
  GeneratedClip,
  ScoreBreakdown,
  SupportedLanguage,
  VideoMetadata,
  ViralMetadata,
} from '../types/video';

export interface PlatformInfo {
  platform: 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'vimeo' | 'direct' | 'unknown';
  label: string;
  badgeColor: string;
  isDirectPlayable: boolean;
  normalizedId?: string;
}

export function detectVideoPlatform(url: string): PlatformInfo {
  if (!url || typeof url !== 'string') {
    return { platform: 'unknown', label: 'Unknown Source', badgeColor: 'bg-zinc-700', isDirectPlayable: false };
  }

  const clean = url.trim().toLowerCase();

  if (clean.includes('youtube.com') || clean.includes('youtu.be')) {
    return { platform: 'youtube', label: 'YouTube Video', badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30', isDirectPlayable: false };
  }
  if (clean.includes('instagram.com/reel') || clean.includes('instagram.com/p/')) {
    return { platform: 'instagram', label: 'Instagram Reel', badgeColor: 'bg-pink-500/20 text-pink-400 border-pink-500/30', isDirectPlayable: false };
  }
  if (clean.includes('tiktok.com')) {
    return { platform: 'tiktok', label: 'TikTok Video', badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', isDirectPlayable: false };
  }
  if (clean.includes('facebook.com') || clean.includes('fb.watch')) {
    return { platform: 'facebook', label: 'Facebook Video', badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30', isDirectPlayable: false };
  }
  if (clean.includes('vimeo.com')) {
    return { platform: 'vimeo', label: 'Vimeo Video', badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30', isDirectPlayable: false };
  }
  if (clean.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i) || clean.startsWith('blob:') || clean.startsWith('http')) {
    return { platform: 'direct', label: 'Direct Media Stream', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', isDirectPlayable: true };
  }

  return { platform: 'unknown', label: 'Web Video Link', badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30', isDirectPlayable: false };
}

const HOOK_WORDS = [
  'mistake', 'secret', 'never', 'always', 'stop', 'hidden', 'why', 'how', 'truth', 'warning',
  'nobody', 'ruined', 'worst', 'best', 'shocking', 'unbelievable', 'million', 'formula',
  'राज़', 'गलती', 'सफलता', 'सच', 'नियम', 'सावधान', 'तरीका', 'करोड़', 'बदलाव'
];

export function calculateEngagementScore(text: string, duration: number, wordsCount: number): {
  viralScore: number;
  breakdown: ScoreBreakdown;
  viralTag: string;
  reason: string;
} {
  const lower = text.toLowerCase();
  
  // 1. Hook score based on trigger words and strong opener
  let hookStrength = 75;
  const matchedHooks = HOOK_WORDS.filter(w => lower.includes(w));
  hookStrength += Math.min(24, matchedHooks.length * 10);

  // 2. Speech pace (ideal for shorts is 120-200 words per minute)
  const safeDuration = Math.max(duration, 3);
  const wpm = (wordsCount / safeDuration) * 60;
  let speechPace = 76;
  if (wpm >= 110 && wpm <= 210) {
    speechPace = 92;
  } else if (wpm > 210) {
    speechPace = 84;
  } else {
    speechPace = 74;
  }

  // 3. Emotional energy
  const hasExclamation = text.includes('!') || text.includes('?');
  const emotionScore = Math.min(99, 78 + (hasExclamation ? 12 : 4) + (matchedHooks.length > 0 ? 8 : 0));

  // 4. Retention estimate
  const retentionRate = Math.min(98, Math.round((hookStrength * 0.4) + (speechPace * 0.3) + (emotionScore * 0.3)));

  const viralScore = Math.min(99, Math.max(70, Math.round((hookStrength * 0.35) + (speechPace * 0.25) + (retentionRate * 0.4))));

  let viralTag = 'High Retention';
  let reason = 'Solid narrative arc with consistent speaking cadence';
  if (viralScore >= 90) {
    viralTag = 'Viral Hook';
    reason = 'Provocative opening statement triggers instant curiosity and prevents swipe-away';
  } else if (emotionScore >= 88) {
    viralTag = 'High Energy';
    reason = 'Strong motivational inflection and punchy message delivery';
  } else if (speechPace >= 88) {
    viralTag = 'Fast Paced';
    reason = 'Rapid-fire information density designed for modern short-form feeds';
  } else if (retentionRate >= 85) {
    viralTag = 'Educational Gold';
    reason = 'Actionable takeaways delivered without fluff or wasted seconds';
  }

  return {
    viralScore,
    breakdown: {
      hookStrength,
      speechPace,
      emotionScore,
      retentionRate,
    },
    viralTag,
    reason,
  };
}

export function generateViralMetadata(
  clipTitle: string,
  fullText: string,
  language: SupportedLanguage
): ViralMetadata {
  const isHindi = language === 'hi';
  const cleanSnippet = fullText.slice(0, 80).replace(/[.!?,।]/g, '').trim();

  let title = `${cleanSnippet}... 🚀`;
  if (cleanSnippet.length < 15) {
    title = isHindi ? `यह सच जानकर हैरान रह जाएंगे! 🔥` : `The Hard Truth Nobody Talks About 🔥`;
  }

  const shortDescription = isHindi
    ? `इस वीडियो में जानें सबसे महत्वपूर्ण सबक जो आपकी सोच और काम करने के तरीके को हमेशा के लिए बदल देगा। पूरा क्लिप देखें!`
    : `In this clip, discover the game-changing insight on high-performance execution, viral reach, and eliminating common mistakes.`;

  const baseTags = ['#shorts', '#viral', '#clipmitra', '#trending', '#reels', '#growth'];
  const specificTags = isHindi
    ? ['#hindimotivation', '#safalta', '#lifeadvice', '#mindset']
    : ['#entrepreneur', '#creator', '#productivity', '#tech'];

  const hashtags = [...baseTags, ...specificTags];
  const keywords = isHindi
    ? ['सफलता', 'मोटिवेशन', 'अनुशासन', 'शॉर्ट्स', 'वायरल वीडियो']
    : ['viral hook', 'growth strategy', 'creator economy', 'retention editing', 'ai clipper'];

  const thumbnailText = isHindi
    ? 'गलती मत करना! ⚠️'
    : 'DO NOT MAKE THIS MISTAKE! 🛑';

  const socialCaption = isHindi
    ? `${title}\n\n👉 क्या आप इस बात से सहमत हैं? नीचे कमेंट करें और शेयर करें!\n\n${hashtags.join(' ')}`
    : `${title}\n\n👉 Do you agree with this approach? Drop your thoughts below!\n\n${hashtags.join(' ')}`;

  return {
    title,
    shortDescription,
    hashtags,
    keywords,
    thumbnailText,
    socialCaption,
  };
}

export function generateAutomaticClips(
  video: VideoMetadata,
  config: ClipConfig,
  videoMediaUrl?: string
): GeneratedClip[] {
  const cues = video.cues || [];
  const targetDuration = config.targetDuration || 30;
  const desiredCount = config.clipCount === 'all' ? 10 : config.clipCount;

  const generated: GeneratedClip[] = [];

  if (cues.length === 0) {
    // If no transcript cues exist, divide duration into clean targetDuration chunks
    const totalDuration = video.duration || 60;
    const count = Math.min(desiredCount, Math.max(1, Math.floor(totalDuration / targetDuration)));

    for (let i = 0; i < count; i++) {
      const start = Math.min(totalDuration - targetDuration, i * targetDuration);
      const end = Math.min(totalDuration, start + targetDuration);
      const dummyTitle = `Key Moment #${i + 1}`;
      const scoreData = calculateEngagementScore(dummyTitle, end - start, 40);
      const meta = generateViralMetadata(dummyTitle, dummyTitle, video.detectedLanguage);

      generated.push({
        id: `clip-${video.id}-${i + 1}`,
        originalVideoId: video.id,
        originalVideoUrl: videoMediaUrl || video.sourceUrl || '',
        title: `${video.title} - Clip #${i + 1}`,
        startTime: Number(start.toFixed(1)),
        endTime: Number(end.toFixed(1)),
        duration: Number((end - start).toFixed(1)),
        viralScore: scoreData.viralScore,
        scoreBreakdown: scoreData.breakdown,
        viralTag: scoreData.viralTag,
        viralReason: scoreData.reason,
        cues: [],
        metadata: meta,
        aspectRatio: config.targetAspectRatio || '9:16',
        videoBlobUrl: videoMediaUrl,
      });
    }
    return generated;
  }

  // Smart natural sentence clustering:
  // We scan through cues and group them into natural narrative segments close to targetDuration,
  // making sure not to cut in the middle of sentences.
  let currentGroup: CaptionCue[] = [];
  let groupStartTime = cues[0].start;

  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];
    currentGroup.push(cue);
    const currentDuration = cue.end - groupStartTime;

    const isSentenceEnd =
      cue.text.trim().endsWith('.') ||
      cue.text.trim().endsWith('!') ||
      cue.text.trim().endsWith('?') ||
      cue.text.trim().endsWith('।') ||
      cue.text.trim().endsWith(';');

    // Check if we hit or exceeded targetDuration with a natural sentence break, or reached the last cue
    const isDurationReached = currentDuration >= targetDuration * 0.75;
    const isOverLimit = currentDuration >= targetDuration * 1.3;
    const isLastCue = i === cues.length - 1;

    if ((isDurationReached && isSentenceEnd) || isOverLimit || isLastCue) {
      if (currentGroup.length > 0) {
        const segStart = currentGroup[0].start;
        const segEnd = currentGroup[currentGroup.length - 1].end;
        const fullText = currentGroup.map(c => c.text).join(' ');
        const totalWords = currentGroup.reduce((acc, c) => acc + (c.words?.length || c.text.split(' ').length), 0);
        const segDuration = segEnd - segStart;

        const scoreData = calculateEngagementScore(fullText, segDuration, totalWords);
        const meta = generateViralMetadata(currentGroup[0].text, fullText, video.detectedLanguage);

        // Adjust cues so their timestamps are relative or aligned with this clip
        const clipCues: CaptionCue[] = currentGroup.map(c => ({
          ...c,
          words: c.words.map(w => ({ ...w })),
        }));

        generated.push({
          id: `clip-${video.id}-${generated.length + 1}`,
          originalVideoId: video.id,
          originalVideoUrl: videoMediaUrl || video.sourceUrl || '',
          title: meta.title,
          startTime: Number(segStart.toFixed(1)),
          endTime: Number(segEnd.toFixed(1)),
          duration: Number(segDuration.toFixed(1)),
          viralScore: scoreData.viralScore,
          scoreBreakdown: scoreData.breakdown,
          viralTag: scoreData.viralTag,
          viralReason: scoreData.reason,
          cues: clipCues,
          metadata: meta,
          aspectRatio: config.targetAspectRatio || '9:16',
          videoBlobUrl: videoMediaUrl,
          activeSpeakerOffset: (generated.length % 2 === 0 ? 0 : 5),
        });

        if (generated.length >= desiredCount && config.clipCount !== 'all') {
          break;
        }

        // Reset for next cluster
        currentGroup = [];
        if (i + 1 < cues.length) {
          groupStartTime = cues[i + 1].start;
        }
      }
    }
  }

  // Sort by highest viral score first
  generated.sort((a, b) => b.viralScore - a.viralScore);

  return generated;
}
