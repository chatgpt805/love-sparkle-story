
// YouTube IFrame API TypeScript definitions
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
  
  namespace YT {
    interface Player {
      playVideo(): void;
      pauseVideo(): void;
      stopVideo(): void;
      seekTo(seconds: number, allowSeekAhead: boolean): void;
      mute(): void;
      unMute(): void;
      isMuted(): boolean;
      setVolume(volume: number): void;
      getVolume(): number;
      getVideoLoadedFraction(): number;
      getPlayerState(): number;
      getCurrentTime(): number;
      getDuration(): number;
      getVideoUrl(): string;
      getVideoEmbedCode(): string;
    }

    interface PlayerOptions {
      height?: string;
      width?: string;
      videoId?: string;
      playerVars?: {
        autoplay?: 0 | 1;
        controls?: 0 | 1;
        disablekb?: 0 | 1;
        enablejsapi?: 0 | 1;
        fs?: 0 | 1;
        loop?: 0 | 1;
        modestbranding?: 0 | 1;
        playsinline?: 0 | 1;
        rel?: 0 | 1;
      };
      events?: {
        onReady?: (event: any) => void;
        onStateChange?: (event: any) => void;
        onPlaybackQualityChange?: (event: any) => void;
        onPlaybackRateChange?: (event: any) => void;
        onError?: (event: any) => void;
        onApiChange?: (event: any) => void;
      };
    }

    interface PlayerState {
      UNSTARTED: number;
      ENDED: number;
      PLAYING: number;
      PAUSED: number;
      BUFFERING: number;
      CUED: number;
    }

    const PlayerState: PlayerState;

    function Player(element: Element | string, options: PlayerOptions): Player;
  }
}

export {};
