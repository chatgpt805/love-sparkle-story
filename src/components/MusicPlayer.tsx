
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface MusicPlayerProps {
  audioTracks?: string[];
  onTrackChange?: (trackIndex: number) => void;
  autoPlay?: boolean;
}

export function MusicPlayer({ 
  audioTracks = [],
  onTrackChange,
  autoPlay = true
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio element when component mounts
    const audio = new Audio();
    audioRef.current = audio;
    
    // Setup event listeners
    audio.addEventListener('ended', playNextTrack);
    
    // Set initial track
    if (audioTracks.length > 0) {
      audio.src = audioTracks[currentTrackIndex];
      if (autoPlay) {
        audio.play().catch(e => {
          console.log("Autoplay prevented:", e);
        });
        setIsPlaying(true);
      }
    }
    
    return () => {
      // Clean up
      audio.removeEventListener('ended', playNextTrack);
      audio.pause();
      audioRef.current = null;
    };
  }, []);
  
  // Update audio source when track index changes
  useEffect(() => {
    if (audioRef.current && audioTracks.length > 0) {
      audioRef.current.src = audioTracks[currentTrackIndex];
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.log("Error playing audio:", e);
        });
      }
    }
  }, [currentTrackIndex, audioTracks]);
  
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (e) {
      console.error("Error toggling play state:", e);
    }
  };

  const playNextTrack = () => {
    if (!audioTracks.length) return;
    
    const nextIndex = (currentTrackIndex + 1) % audioTracks.length;
    setCurrentTrackIndex(nextIndex);
    
    if (onTrackChange) {
      onTrackChange(nextIndex);
    }
  };

  // Don't render anything if no audio tracks provided
  if (audioTracks.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
      <Button
        onClick={togglePlay}
        variant="secondary"
        size="icon"
        className="rounded-full bg-romantic-dark/70 hover:bg-romantic-dark shadow-md"
      >
        {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
      {audioTracks.length > 1 && (
        <Button
          onClick={playNextTrack}
          variant="secondary"
          size="icon"
          className="rounded-full bg-romantic-dark/70 hover:bg-romantic-dark shadow-md"
        >
          <Music className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export default MusicPlayer;
