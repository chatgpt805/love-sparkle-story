
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  youtubeUrl?: string;
}

export function MusicPlayer({ youtubeUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ" }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<any>(null);

  // Extract video ID from YouTube URL
  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : 'dQw4w9WgXcQ'; // default video ID
  };

  const videoId = getYoutubeVideoId(youtubeUrl);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&autoplay=0&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0`;

  useEffect(() => {
    // Initialize YouTube API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.stopVideo();
        } catch (e) {
          console.error("Error stopping YouTube video:", e);
        }
      }
    };
  }, [videoId, iframeLoaded]);

  const initPlayer = () => {
    if (!iframeRef.current) return;

    try {
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: () => {
            console.log("YouTube player ready");
          },
          onStateChange: (event: any) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          },
          onError: (e: any) => {
            console.error("YouTube player error:", e);
          }
        }
      });
    } catch (e) {
      console.error("Error initializing YouTube player:", e);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    } catch (e) {
      console.error("Error toggling play state:", e);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title="Background music"
        className="hidden"
        allow="autoplay; encrypted-media"
        onLoad={() => setIframeLoaded(true)}
      />
      <Button
        onClick={togglePlay}
        variant="secondary"
        size="icon"
        className="rounded-full bg-romantic-dark/70 hover:bg-romantic-dark shadow-md"
      >
        {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
    </div>
  );
}

export default MusicPlayer;
