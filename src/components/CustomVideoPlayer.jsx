import { useEffect, useRef } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

export default function CustomVideoPlayer({ src, className = '' }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && src) {
      // Initialize Plyr
      playerRef.current = new Plyr(videoRef.current, {
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'captions',
          'settings',
          'pip',
          'airplay',
          'fullscreen',
        ],
        settings: ['captions', 'quality', 'speed'],
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
        ratio: '16:9',
        autoplay: false,
        muted: true,
        hideControls: true,
        resetOnEnd: true,
        keyboard: { focused: true, global: false },
        tooltips: { controls: true, seek: true },
        captions: { active: false, language: 'auto', update: false },
        fullscreen: { enabled: true, fallback: true, iosNative: true },
        quality: {
          default: 576,
          options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240],
        },
      });

      // Custom styling for chat context
      const player = playerRef.current;

      // Add custom CSS for better mobile experience
      const style = document.createElement('style');
      style.textContent = `
        .plyr--video {
          border-radius: 8px;
          overflow: hidden;
        }
        .plyr--video .plyr__control {
          background: rgba(255, 255, 255, 0.9);
          color: #333;
        }
        .plyr--video .plyr__control:hover {
          background: rgba(255, 255, 255, 1);
        }
        .plyr--video .plyr__progress__played {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        }
        .plyr--video .plyr__volume__display {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        }
        .plyr--video .plyr__control--overlaid {
          background: rgba(59, 130, 246, 0.9);
          border: 2px solid rgba(255, 255, 255, 0.9);
        }
        .plyr--video .plyr__control--overlaid:hover {
          background: rgba(59, 130, 246, 1);
        }
        .plyr--full-ui input[type=range] {
          color: #3b82f6;
        }
        .plyr__video-wrapper {
          border-radius: 8px;
          overflow: hidden;
        }
      `;
      document.head.appendChild(style);

      // Cleanup function
      return () => {
        if (playerRef.current) {
          playerRef.current.destroy();
          playerRef.current = null;
        }
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      };
    }
  }, [src]);

  return (
    <div className={`custom-video-player ${className}`}>
      <video
        ref={videoRef}
        playsInline
        className="w-full h-auto"
        style={{ borderRadius: '8px' }}
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        <source src={src} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
