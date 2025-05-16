
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TypedTextProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  startTyping?: boolean;
}

export function TypedText({ 
  text, 
  delay = 40, 
  className = '', 
  onComplete, 
  startTyping = false 
}: TypedTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (!startTyping) return;
    
    let index = 0;
    setIsTyping(true);
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        if (onComplete && !hasCompleted.current) {
          hasCompleted.current = true;
          onComplete();
        }
      }
    }, delay);

    return () => clearInterval(interval);
  }, [text, delay, onComplete, startTyping]);

  return (
    <span 
      className={cn('typing-text', { 'typing': isTyping }, className)}
      aria-label={text}
    >
      {displayedText || (isTyping ? '' : text)}
    </span>
  );
}

export default TypedText;
