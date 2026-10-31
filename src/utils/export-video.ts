import JSZip from 'jszip';
import { GeneratedClip } from '../types/video';
import { exportToSrt } from './caption-generator';

// Helper to trigger browser download of a Blob or URL
export function downloadFile(blob: Blob | string, filename: string) {
  const url = typeof blob === 'string' ? blob : URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  if (typeof blob !== 'string') {
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
}

// Download single clip SRT file
export function downloadClipSrt(clip: GeneratedClip) {
  const srtContent = exportToSrt(clip.cues, clip.startTime);
  const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
  const cleanTitle = clip.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
  downloadFile(blob, `${cleanTitle}_subtitles.srt`);
}

// Download single clip metadata & captions bundle
export function downloadClipMetadata(clip: GeneratedClip) {
  const content = `================================================
CLIPMITRA AI - VIRAL CLIP METADATA & SCRIPT
================================================
Title: ${clip.title}
Estimated Viral Score: ${clip.viralScore}% (${clip.viralTag})
Start: ${clip.startTime}s | End: ${clip.endTime}s | Duration: ${clip.duration}s
Aspect Ratio: ${clip.aspectRatio}

---------------- VIRAL HOOK & REASON ----------------
Reason: ${clip.viralReason}
Suggested Hook / Thumbnail: ${clip.metadata.thumbnailText}

---------------- SOCIAL MEDIA CAPTION ----------------
${clip.metadata.socialCaption}

---------------- KEYWORDS & HASHTAGS ----------------
Hashtags: ${clip.metadata.hashtags.join(' ')}
Keywords: ${clip.metadata.keywords.join(', ')}

---------------- FULL SCRIPT TRANSCRIPTION ----------------
${clip.cues.map(c => `[${c.start.toFixed(1)}s - ${c.end.toFixed(1)}s] ${c.text}`).join('\n')}
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const cleanTitle = clip.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
  downloadFile(blob, `${cleanTitle}_viral_info.txt`);
}

// Bundles all clips, metadata, and SRT subtitles into a ZIP archive
export async function downloadAllClipsZip(
  clips: GeneratedClip[],
  onProgress?: (percent: number, status: string) => void
): Promise<void> {
  const zip = new JSZip();

  onProgress?.(10, 'Initializing ZIP package...');

  // Folder for transcripts & metadata
  const metaFolder = zip.folder('viral_metadata_and_captions');
  const srtFolder = zip.folder('srt_subtitles');

  // Summary Readme
  let summary = `ClipMitra AI - Generated Viral Short Clips Pack
Generated: ${new Date().toLocaleString()}
Total Clips: ${clips.length}

CLIPS OVERVIEW:
`;

  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    const indexStr = String(i + 1).padStart(2, '0');
    const safeTitle = clip.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 24);
    const baseName = `Clip_${indexStr}_${safeTitle}`;

    summary += `\n[${indexStr}] ${clip.title}\n   Viral Score: ${clip.viralScore}% (${clip.viralTag})\n   Time: ${clip.startTime}s - ${clip.endTime}s (${clip.duration}s)\n   Hook: ${clip.metadata.thumbnailText}\n`;

    // Metadata file
    const metaText = `Title: ${clip.title}
Duration: ${clip.duration}s
Viral Score: ${clip.viralScore}% (${clip.viralTag})
Start Time: ${clip.startTime}s
End Time: ${clip.endTime}s
Suggested Thumbnail Hook: ${clip.metadata.thumbnailText}

Social Post Caption:
${clip.metadata.socialCaption}

Hashtags:
${clip.metadata.hashtags.join(' ')}

Transcript:
${clip.cues.map(c => `(${c.start.toFixed(1)}s - ${c.end.toFixed(1)}s): ${c.text}`).join('\n')}
`;
    metaFolder?.file(`${baseName}_info.txt`, metaText);

    // SRT file
    const srtContent = exportToSrt(clip.cues, clip.startTime);
    srtFolder?.file(`${baseName}.srt`, srtContent);

    onProgress?.(10 + Math.round(((i + 1) / clips.length) * 50), `Bundling clip ${i + 1} of ${clips.length}...`);
  }

  zip.file('README_VIRAL_PLAYBOOK.txt', summary);

  onProgress?.(75, 'Compressing archive...');

  const content = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      onProgress?.(75 + Math.round((metadata.percent / 100) * 20), `Finalizing ZIP: ${Math.round(metadata.percent)}%`);
    }
  );

  onProgress?.(100, 'Download starting!');
  downloadFile(content, `ClipMitra_AI_Viral_Clips_${Date.now()}.zip`);
}

// Client-side video recorder: Crops and records video canvas with synchronized captions
export async function renderAndDownloadClipVideo(
  videoElement: HTMLVideoElement,
  clip: GeneratedClip,
  onProgress?: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const targetWidth = 720;
      const targetHeight = 1280; // 9:16 vertical

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }

      // Check MediaRecorder support
      const mimeTypes = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
      const supportedType = mimeTypes.find(t => MediaRecorder.isTypeSupported(t)) || 'video/webm';

      const canvasStream = canvas.captureStream(30);

      // Try capturing audio from video element if possible
      try {
        const audioStream = (videoElement as any).captureStream?.() || (videoElement as any).mozCaptureStream?.();
        if (audioStream) {
          audioStream.getAudioTracks().forEach((track: MediaStreamTrack) => canvasStream.addTrack(track));
        }
      } catch (err) {
        console.warn('Audio capture stream fallback:', err);
      }

      const recorder = new MediaRecorder(canvasStream, {
        mimeType: supportedType,
        videoBitsPerSecond: 2500000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: supportedType });
        const ext = supportedType.includes('mp4') ? 'mp4' : 'webm';
        const cleanTitle = clip.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
        downloadFile(videoBlob, `ClipMitra_${cleanTitle}.${ext}`);
        resolve();
      };

      // Set playback to clip start
      videoElement.currentTime = clip.startTime;
      videoElement.muted = false;

      let animationFrameId: number;
      const startTimeMs = performance.now();
      const clipDurationSec = clip.duration;

      recorder.start(100);

      const renderFrame = () => {
        const elapsedSec = (performance.now() - startTimeMs) / 1000;
        const currentProgress = Math.min(100, Math.round((elapsedSec / clipDurationSec) * 100));
        onProgress?.(currentProgress);

        // Draw background blurred padding
        ctx.fillStyle = '#090A0F';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Draw video centered & cropped to 9:16
        const vWidth = videoElement.videoWidth || 1280;
        const vHeight = videoElement.videoHeight || 720;

        // Calculate 9:16 crop from source video
        // Center crop with speaker offset
        const speakerOffset = (clip.activeSpeakerOffset || 0) / 100; // -0.5 to 0.5
        const cropWidth = Math.min(vWidth, vHeight * (9 / 16));
        const cropHeight = vHeight;
        const maxSourceX = vWidth - cropWidth;
        const rawSourceX = (vWidth - cropWidth) / 2 + speakerOffset * (vWidth - cropWidth);
        const sourceX = Math.max(0, Math.min(maxSourceX, rawSourceX));

        ctx.drawImage(
          videoElement,
          sourceX, 0, cropWidth, cropHeight,
          0, 0, targetWidth, targetHeight
        );

        // Render current captions
        const currentVideoTime = videoElement.currentTime;
        const currentCue = clip.cues.find(c => currentVideoTime >= c.start && currentVideoTime <= c.end);

        if (currentCue) {
          const captionY = targetHeight * 0.78; // 78% down screen
          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Background pill
          ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
          const textMetrics = ctx.measureText(currentCue.text);
          const boxPadding = 24;
          const boxWidth = Math.min(targetWidth - 40, textMetrics.width + boxPadding * 2);

          ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
          ctx.roundRect
            ? ctx.roundRect(targetWidth / 2 - boxWidth / 2, captionY - 32, boxWidth, 64, 16)
            : ctx.fillRect(targetWidth / 2 - boxWidth / 2, captionY - 32, boxWidth, 64);
          ctx.fill();

          // Text with stroke & fill
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 6;
          ctx.strokeText(currentCue.text, targetWidth / 2, captionY, targetWidth - 60);

          ctx.fillStyle = '#FFE600'; // Viral yellow
          ctx.fillText(currentCue.text, targetWidth / 2, captionY, targetWidth - 60);

          ctx.restore();
        }

        if (videoElement.currentTime < clip.endTime && !videoElement.paused && !videoElement.ended) {
          animationFrameId = requestAnimationFrame(renderFrame);
        } else {
          recorder.stop();
          cancelAnimationFrame(animationFrameId);
        }
      };

      videoElement.play().then(() => {
        animationFrameId = requestAnimationFrame(renderFrame);
      }).catch(reject);

    } catch (error) {
      reject(error);
    }
  });
}
