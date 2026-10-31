import test from 'node:test';
import assert from 'node:assert/strict';
import {
  detectVideoPlatform,
  calculateEngagementScore,
  generateAutomaticClips,
} from './video-analysis';
import {
  formatSecondsToSrtTime,
  exportToSrt,
  getActiveCueAndWord,
} from './caption-generator';
import { CaptionCue, VideoMetadata, ClipConfig } from '../types/video';

test('detectVideoPlatform correctly categorizes URLs', () => {
  assert.equal(detectVideoPlatform('https://www.youtube.com/watch?v=dQw4w9WgXcQ').platform, 'youtube');
  assert.equal(detectVideoPlatform('https://youtu.be/xyz123').platform, 'youtube');
  assert.equal(detectVideoPlatform('https://www.instagram.com/reel/C3abc123/').platform, 'instagram');
  assert.equal(detectVideoPlatform('https://www.tiktok.com/@user/video/123456789').platform, 'tiktok');
  assert.equal(detectVideoPlatform('https://vimeo.com/76979871').platform, 'vimeo');
  assert.equal(detectVideoPlatform('https://mycdn.com/videos/clip.mp4').platform, 'direct');
  assert.equal(detectVideoPlatform('blob:http://localhost:3000/some-guid').platform, 'direct');
});

test('calculateEngagementScore assigns high scores to provocative hooks', () => {
  const result = calculateEngagementScore(
    'The biggest mistake creators make today is treating artificial intelligence as a replacement for raw taste!',
    10,
    18
  );

  assert.ok(result.viralScore >= 80, `Expected viralScore >= 80, got ${result.viralScore}`);
  assert.ok(result.breakdown.hookStrength >= 75);
  assert.ok(result.breakdown.emotionScore >= 75);
  assert.equal(typeof result.viralTag, 'string');
  assert.equal(typeof result.reason, 'string');
});

test('formatSecondsToSrtTime converts seconds to standard 00:00:00,000 format', () => {
  assert.equal(formatSecondsToSrtTime(0), '00:00:00,000');
  assert.equal(formatSecondsToSrtTime(65.5), '00:01:05,500');
  assert.equal(formatSecondsToSrtTime(3661.125), '01:01:01,125');
});

test('exportToSrt outputs correctly structured subtitle blocks', () => {
  const sampleCues: CaptionCue[] = [
    {
      id: 'c1',
      start: 1.0,
      end: 4.5,
      text: 'Stop making this viral editing mistake.',
      words: [],
    },
    {
      id: 'c2',
      start: 5.0,
      end: 8.2,
      text: 'Here is the exact formula for retention.',
      words: [],
    },
  ];

  const srt = exportToSrt(sampleCues, 0);
  assert.ok(srt.includes('1\n00:00:01,000 --> 00:00:04,500\nStop making this viral editing mistake.'));
  assert.ok(srt.includes('2\n00:00:05,000 --> 00:00:08,200\nHere is the exact formula for retention.'));
});

test('getActiveCueAndWord tracks current word index during playback', () => {
  const cues: CaptionCue[] = [
    {
      id: 'c1',
      start: 1.0,
      end: 5.0,
      text: 'Master the hook',
      words: [
        { word: 'Master', start: 1.0, end: 2.2 },
        { word: 'the', start: 2.3, end: 3.1 },
        { word: 'hook', start: 3.2, end: 5.0 },
      ],
    },
  ];

  // At 1.5s, active word should be 'Master' (index 0)
  const at1_5 = getActiveCueAndWord(cues, 1.5);
  assert.equal(at1_5.currentCue?.id, 'c1');
  assert.equal(at1_5.activeWordIndex, 0);

  // At 2.5s, active word should be 'the' (index 1)
  const at2_5 = getActiveCueAndWord(cues, 2.5);
  assert.equal(at2_5.activeWordIndex, 1);

  // At 4.0s, active word should be 'hook' (index 2)
  const at4_0 = getActiveCueAndWord(cues, 4.0);
  assert.equal(at4_0.activeWordIndex, 2);

  // Out of range (0.5s)
  const outOfRange = getActiveCueAndWord(cues, 0.5);
  assert.equal(outOfRange.currentCue, null);
});

test('generateAutomaticClips creates clips without crashing', () => {
  const testVideo: VideoMetadata = {
    id: 'test-1',
    title: 'Test Video',
    duration: 60,
    detectedLanguage: 'en',
    aspectRatio: '16:9',
    thumbnailUrl: '',
    speakers: ['Host'],
    cues: [
      {
        id: '1',
        start: 0,
        end: 8,
        text: 'First opening hook sentence that is complete.',
        words: [],
      },
      {
        id: '2',
        start: 8.5,
        end: 18,
        text: 'Second supporting argument delivering massive value.',
        words: [],
      },
      {
        id: '3',
        start: 18.5,
        end: 32,
        text: 'Third concluding tip for creators to take action now.',
        words: [],
      },
    ],
  };

  const config: ClipConfig = {
    targetDuration: 30,
    clipCount: 5,
    captionLanguage: 'en',
    dualLanguage: false,
    captionStyle: 'hormozi',
    captionPosition: 'bottom',
    captionFontSize: 24,
    captionColor: '#ffffff',
    captionHighlightColor: '#ffe600',
    smartCrop: 'center',
    removeSilence: true,
    exportResolution: '1080p',
    targetAspectRatio: '9:16',
  };

  const clips = generateAutomaticClips(testVideo, config);
  assert.ok(clips.length >= 1, 'Should generate at least 1 clip');
  assert.ok(clips[0].viralScore > 0);
  assert.ok(clips[0].metadata.title.length > 0);
  assert.ok(clips[0].metadata.hashtags.length > 0);
});
