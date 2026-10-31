import { VideoMetadata, CaptionCue } from '../types/video';

// Helper to generate word-level timings for sentences
function makeCues(
  entries: { start: number; end: number; text: string; speaker?: string; translation?: string }[]
): CaptionCue[] {
  return entries.map((entry, idx) => {
    const rawWords = entry.text.trim().split(/\s+/);
    const totalDuration = Math.max(0.2, entry.end - entry.start);
    const wordDuration = totalDuration / rawWords.length;

    const words = rawWords.map((word, wIdx) => ({
      word,
      start: Number((entry.start + wIdx * wordDuration).toFixed(2)),
      end: Number((entry.start + (wIdx + 1) * wordDuration).toFixed(2)),
    }));

    return {
      id: `cue-${idx + 1}`,
      start: entry.start,
      end: entry.end,
      text: entry.text,
      words,
      speaker: entry.speaker || 'Speaker 1',
      translation: entry.translation,
    };
  });
}

export const SAMPLE_VIDEOS: (VideoMetadata & {
  category: string;
  badge: string;
  videoSrc: string;
  description: string;
})[] = [
  {
    id: 'sample-ai-tech',
    title: 'The AI Revolution: What Happens Next?',
    category: 'Technology & AI',
    badge: 'Popular • English',
    description: 'High-energy keynote breaking down how artificial intelligence reshapes work, automation, and content creation.',
    detectedLanguage: 'en',
    duration: 124, // 2 mins 4s
    aspectRatio: '16:9',
    speakers: ['Alex Rivers (AI Researcher)'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    cues: makeCues([
      {
        start: 0.5,
        end: 4.8,
        text: 'The biggest mistake creators make today is treating artificial intelligence as a replacement for raw human taste.',
        translation: 'आज सबसे बड़ी गलती यह है कि लोग AI को मानवीय रचनात्मक समझ का विकल्प मान रहे हैं।',
      },
      {
        start: 5.2,
        end: 9.8,
        text: 'AI does not replace ambition; it acts as an exponential multiplier for the relentless!',
        translation: 'AI महत्वाकांक्षा की जगह नहीं लेता, बल्कि लगनशील लोगों की ताक़त को कई गुना बढ़ा देता है!',
      },
      {
        start: 10.4,
        end: 15.6,
        text: 'If you produce ten videos a month right now, automated intelligence gives you the leverage to test a hundred variations.',
        translation: 'अगर आप महीने में 10 वीडियो बनाते हैं, तो स्वचालन आपको 100 रूपांतर आजमाने की शक्ति देता है।',
      },
      {
        start: 16.2,
        end: 21.0,
        text: 'Notice that the first three seconds decide your entire retention graph on mobile platforms.',
        translation: 'ध्यान रखें कि मोबाइल पर पहले 3 सेकंड ही आपकी पूरी व्यूअरशिप तय करते हैं।',
      },
      {
        start: 21.5,
        end: 27.2,
        text: 'If the hook does not spark urgent curiosity, ninety-two percent of viewers swipe away before you even deliver value.',
        translation: 'अगर शुरुआती हुक में उत्सुकता नहीं जगाई, तो 92% लोग आपकी बात सुने बिना ही स्वाइप कर जाते हैं।',
      },
      {
        start: 28.0,
        end: 34.1,
        text: 'Here is the master blueprint: state the conflict instantly, eliminate every useless filler word, and let visual pace drive retention.',
        translation: 'यहाँ असली फॉर्मूला है: तुरंत समस्या सामने रखें, फालतू शब्द हटाएं और स्क्रीन पेसिंग से दर्शक को बांधें।',
      },
      {
        start: 35.0,
        end: 41.5,
        text: 'When you cut the fat and leave only the golden insight, your short video goes from ordinary to truly viral.',
        translation: 'जब आप सिर्फ मुख्य और असरदार बात रखते हैं, तो आपका वीडियो साधारण से एकदम वायरल बन जाता है।',
      },
      {
        start: 42.0,
        end: 48.0,
        text: 'Vertical framing is not just a format; it is the default posture of how two billion people consume knowledge today.',
        translation: 'वर्टिकल वीडियो सिर्फ एक फॉर्मेट नहीं है; यह ज्ञान ग्रहण करने का दुनिया का सबसे बड़ा माध्यम बन चुका है।',
      },
      {
        start: 49.0,
        end: 55.4,
        text: 'Master the hook, master the cut, and let the algorithm do the heavy lifting for you.',
        translation: 'हुक में माहिर बनिए, कटिंग सटीक रखिए और फिर एल्गोरिदम को अपना काम करने दीजिए।',
      },
    ]),
  },
  {
    id: 'sample-hindi-motivation',
    title: 'सफलता का असली राज़ - Mindset & Action',
    category: 'Motivation & Mindset',
    badge: 'Trending • Hindi / Hinglish',
    description: 'Powerful speech in Hindi about discipline, consistency, and defeating self-doubt with real action.',
    detectedLanguage: 'hi',
    duration: 98,
    aspectRatio: '16:9',
    speakers: ['रोहन शर्मा (Mentor)'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    cues: makeCues([
      {
        start: 0.8,
        end: 4.9,
        text: 'अगर आप आज भी सही वक्त का इंतज़ार कर रहे हैं, तो समझ लीजिए कि वक्त कभी सही नहीं होगा।',
        translation: 'If you are still waiting for the perfect time, understand that the time will never be perfect.',
      },
      {
        start: 5.4,
        end: 10.2,
        text: 'इंतज़ार करने वालों को सिर्फ उतना ही मिलता है, जितना कोशिश करने वाले छोड़ देते हैं!',
        translation: 'Those who wait only get what is left behind by those who take relentless action!',
      },
      {
        start: 11.0,
        end: 16.5,
        text: 'लोग आपकी शुरुआत पर हँसेंगे, आपके संघर्ष पर शक करेंगे, लेकिन आपकी कामयाबी पर ताली बजाएंगे।',
        translation: 'People will laugh at your beginning, doubt your struggle, but clap for your eventual triumph.',
      },
      {
        start: 17.2,
        end: 22.8,
        text: 'हर रोज़ सिर्फ एक प्रतिशत बेहतर बनिए। साल के अंत में आप सैंतीस गुना आगे होंगे!',
        translation: 'Just improve by one percent every single day. By year-end you will be 37 times ahead!',
      },
      {
        start: 23.5,
        end: 29.0,
        text: 'असली ताक़त आपके हुनर में नहीं, आपके लगातार डटे रहने के अनुशासन में छिपी है।',
        translation: 'Real power does not lie in raw talent alone, but in your daily relentless discipline.',
      },
      {
        start: 29.8,
        end: 35.6,
        text: 'मुश्किलों से डरिए मत, उन्हें अपनी जीत की सीढ़ी बनाइए और दुनिया को अपना दम दिखाइए।',
        translation: 'Never fear obstacles; turn them into stepping stones and prove what you are made of.',
      },
    ]),
  },
  {
    id: 'sample-growth-podcast',
    title: 'Zero to $1M: The Viral Distribution Playbook',
    category: 'Business & Growth',
    badge: 'Creator Masterclass • English',
    description: 'Actionable breakdown of how founders leverage short-form clips to drive hundreds of thousands of signups without ads.',
    detectedLanguage: 'en',
    duration: 110,
    aspectRatio: '16:9',
    speakers: ['Maya Lin (Growth Strategist)'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    cues: makeCues([
      {
        start: 0.6,
        end: 5.2,
        text: 'We grew to one million ARR without spending a single dollar on paid advertising.',
        translation: 'हमने विज्ञापनों पर एक भी डॉलर खर्च किए बिना दस लाख डॉलर की वार्षिक आय हासिल की।',
      },
      {
        start: 5.8,
        end: 11.1,
        text: 'Our entire funnel was turning our sixty-minute founder interviews into twenty micro-clips.',
        translation: 'हमारी रणनीति साठ मिनट के इंटरव्यू को बीस छोटे वायरल क्लिप्स में बांटने की थी।',
      },
      {
        start: 11.8,
        end: 17.4,
        text: 'One clip hit four million views on Instagram Reels and drove eighty thousand visits in forty-eight hours.',
        translation: 'एक क्लिप को चालीस लाख व्यूज मिले और अड़तालीस घंटे में अस्सी हज़ार विज़िटर्स आए।',
      },
      {
        start: 18.0,
        end: 23.5,
        text: 'The secret is high-contrast captions and cutting directly to the shocking insight without any preamble.',
        translation: 'इसका राज़ है हाई-कंट्रास्ट सबटाइटल्स और बिना किसी फालतू बातचीत के सीधे चौंकाने वाले विचार पर आना।',
      },
      {
        start: 24.2,
        end: 29.8,
        text: 'If you speak slowly, viewers get bored. Speed up the audio by just eight percent and keep eyes moving.',
        translation: 'अगर आप धीमे बोलेंगे, दर्शक बोर हो जाएंगे। ऑडियो को थोड़ा तेज़ करें और स्क्रीन गति बनाए रखें।',
      },
      {
        start: 30.5,
        end: 36.2,
        text: 'Content is king, but smart clipping and distribution is the whole kingdom.',
        translation: 'कंटेंट राजा है, लेकिन सही क्लिपिंग और वितरण ही असल साम्राज्य है।',
      },
    ]),
  },
];
