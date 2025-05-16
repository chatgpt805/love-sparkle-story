
import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StorySlideProps {
  className?: string;
  children: ReactNode;
  isActive: boolean;
  onNextSlide?: () => void;
  hasNextButton?: boolean;
}

export function StorySlide({ 
  className, 
  children, 
  isActive,
  onNextSlide,
  hasNextButton = true
}: StorySlideProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 500); // match this with exit animation duration
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!visible) return null;

  return (
    <motion.div
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center p-6 transition-opacity',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="flex-grow flex flex-col items-center justify-center w-full">
        {children}
      </div>
      
      {hasNextButton && onNextSlide && (
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <button
            onClick={onNextSlide}
            className="px-6 py-2 rounded-full bg-romantic-dark text-white shadow-md hover:shadow-lg transition-all hover:bg-love-dark"
          >
            Continue Our Story
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default StorySlide;
