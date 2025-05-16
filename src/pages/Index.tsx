import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import TypedText from '@/components/TypedText';
import LoveMeter from '@/components/LoveMeter';
import FloatingHearts from '@/components/FloatingHearts';
import MusicPlayer from '@/components/MusicPlayer';
import Confetti from '@/components/Confetti';
import StorySlide from '@/components/StorySlide';
import CameraCapture from '@/components/CameraCapture';
import { useIsMobile } from '@/hooks/use-mobile';

// Temporary placeholder URLs - Replace these with your actual URLs
const FRIEND_IMAGE_URL = "https://i.ibb.co/XGwwsH5/489730275-1352627626039942-2053303874681916799-n.jpg";
const GIRLFRIEND_IMAGE_URL = "https://i.ibb.co/j9tB6htK/489730756-1054726273235237-3566932234516458035-n.jpg";

// Add your MP4 audio files here - replace these with actual audio file paths
const AUDIO_TRACKS = [
  "/music.mp4", // Replace with your actual audio files
  "/music.mp4"
];

enum SlideState {
  TITLE = 0,
  FRIEND = 1,
  GIRLFRIEND = 2,
  LOVE_METER = 3,
  MESSAGE = 4,
  COMBINED_PHOTO = 5,
  FINAL = 6
}

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState<SlideState>(SlideState.TITLE);
  const [typingComplete, setTypingComplete] = useState<Record<SlideState, boolean>>({
    [SlideState.TITLE]: false,
    [SlideState.FRIEND]: false,
    [SlideState.GIRLFRIEND]: false,
    [SlideState.LOVE_METER]: false,
    [SlideState.MESSAGE]: false,
    [SlideState.COMBINED_PHOTO]: false,
    [SlideState.FINAL]: false
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [combinedImage, setCombinedImage] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const isMobile = useIsMobile();

  const handleNextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) as SlideState);
  }, []);

  const handleTypingComplete = useCallback((slide: SlideState) => {
    setTypingComplete(prev => ({
      ...prev,
      [slide]: true
    }));
  }, []);

  const handleHeartClick = useCallback(() => {
    setShowConfetti(true);
    
    // Stop confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  }, []);

  const handleCombinedImage = useCallback((imageUrl: string) => {
    setCombinedImage(imageUrl);
    // Automatically move to combined photo slide
    setCurrentSlide(SlideState.COMBINED_PHOTO);
  }, []);

  const handleTrackChange = useCallback((trackIndex: number) => {
    setCurrentTrack(trackIndex);
    console.log(`Now playing track: ${trackIndex + 1}`);
  }, []);

  const showCamera = currentSlide === SlideState.FINAL;

  // Get appropriate text size classes based on device
  const getTitleClass = () => isMobile ? "text-3xl font-bold" : "text-4xl md:text-6xl font-bold";
  const getSubtitleClass = () => isMobile ? "text-xl" : "text-xl md:text-2xl";
  const getTextClass = () => isMobile ? "text-base" : "text-lg md:text-xl";

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-romantic-light to-accent overflow-hidden flex flex-col items-center justify-center">
      <FloatingHearts />
      <MusicPlayer audioTracks={AUDIO_TRACKS} onTrackChange={handleTrackChange} autoPlay={true} />
      {showCamera && <CameraCapture friendImageUrl={FRIEND_IMAGE_URL} onCombinedImage={handleCombinedImage} />}
      <Confetti active={showConfetti} />
      
      <div className="relative w-full max-w-3xl h-screen max-h-[800px] mx-auto">
        {/* Title Slide */}
        <StorySlide 
          isActive={currentSlide === SlideState.TITLE}
          onNextSlide={typingComplete[SlideState.TITLE] ? handleNextSlide : undefined}
        >
          <motion.h1 
            className={`${getTitleClass()} text-love-dark mb-6 text-center`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <TypedText 
              text="A story about us..." 
              delay={80} 
              startTyping={true}
              onComplete={() => handleTypingComplete(SlideState.TITLE)} 
              className="text-center"
            />
          </motion.h1>
        </StorySlide>

        {/* Friend Photo Slide */}
        <StorySlide 
          isActive={currentSlide === SlideState.FRIEND}
          onNextSlide={typingComplete[SlideState.FRIEND] ? handleNextSlide : undefined}
        >
          <div className="flex flex-col items-center">
            <motion.div 
              className="w-52 h-52 md:w-80 md:h-80 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={FRIEND_IMAGE_URL} 
                alt="Friend" 
                className="w-full h-full object-cover" 
              />
            </motion.div>
            <div className={`${getSubtitleClass()} text-center text-love-dark`}>
              <TypedText 
                text="This is him..." 
                delay={60}
                startTyping={currentSlide === SlideState.FRIEND}
                onComplete={() => handleTypingComplete(SlideState.FRIEND)}
              />
            </div>
          </div>
        </StorySlide>

        {/* Girlfriend Photo Slide */}
        <StorySlide 
          isActive={currentSlide === SlideState.GIRLFRIEND}
          onNextSlide={typingComplete[SlideState.GIRLFRIEND] ? handleNextSlide : undefined}
        >
          <div className="flex flex-col items-center">
            <motion.div 
              className="w-52 h-52 md:w-80 md:h-80 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={GIRLFRIEND_IMAGE_URL} 
                alt="Girlfriend" 
                className="w-full h-full object-cover" 
              />
            </motion.div>
            <div className={`${getSubtitleClass()} text-center text-love-dark`}>
              <TypedText 
                text="And this is the one who stole his heart..." 
                delay={60}
                startTyping={currentSlide === SlideState.GIRLFRIEND}
                onComplete={() => handleTypingComplete(SlideState.GIRLFRIEND)}
              />
            </div>
            <div className="text-sm mt-4 text-love-dark opacity-70">
              {showCamera && "(Click the camera button to take your own photo)"}
            </div>
          </div>
        </StorySlide>

        {/* Love Meter Slide */}
        <StorySlide 
          isActive={currentSlide === SlideState.LOVE_METER}
          onNextSlide={typingComplete[SlideState.LOVE_METER] ? handleNextSlide : undefined}
        >
          <div className="w-full max-w-md">
            <motion.h2 
              className={`${getSubtitleClass()} font-bold text-love-dark mb-8 text-center`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              How much do I love you?
            </motion.h2>
            <LoveMeter 
              startFilling={currentSlide === SlideState.LOVE_METER}
              onComplete={() => handleTypingComplete(SlideState.LOVE_METER)}
            />
          </div>
        </StorySlide>

        {/* Message Slide */}
        <StorySlide 
          isActive={currentSlide === SlideState.MESSAGE}
          onNextSlide={typingComplete[SlideState.MESSAGE] ? handleNextSlide : undefined}
        >
          <motion.div 
            className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-lg max-w-md mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`${getTextClass()} text-center text-love-dark leading-relaxed`}>
              <TypedText 
                text="Will you be mine forever? If I have a chance, I will be yours for every part of my life with you."
                delay={50}
                startTyping={currentSlide === SlideState.MESSAGE}
                onComplete={() => handleTypingComplete(SlideState.MESSAGE)}
              />
            </div>
          </motion.div>
        </StorySlide>

        {/* Combined Photo Slide */}
        <StorySlide 
          isActive={currentSlide === SlideState.COMBINED_PHOTO}
          onNextSlide={combinedImage ? handleNextSlide : undefined}
        >
          <motion.div 
            className="flex flex-col items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={`${getSubtitleClass()} font-bold text-love-dark mb-4 text-center`}>
              Look how perfect we are together
            </h2>
            {combinedImage ? (
              <div className="w-full max-w-md rounded-lg overflow-hidden shadow-lg mb-6">
                <img 
                  src={combinedImage} 
                  alt="Combined Photos" 
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-lg">
                <p>Please use the camera button to take a photo</p>
              </div>
            )}
          </motion.div>
        </StorySlide>
        
        {/* Final Slide */}
        <StorySlide 
          isActive={currentSlide === SlideState.FINAL}
          hasNextButton={false}
        >
          <motion.div 
            className="flex flex-col items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={`${getTitleClass()} text-love-dark mb-8 text-center`}>
              Forever & Always
            </h2>
            <motion.button
              className="text-4xl md:text-6xl hover:text-5xl md:hover:text-7xl transition-all duration-300 bg-transparent border-none cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHeartClick}
            >
              ❤️
            </motion.button>
            <p className="mt-4 text-center text-love-dark">
              Click the heart!
            </p>
          </motion.div>
        </StorySlide>
      </div>
    </div>
  );
};

export default Index;
