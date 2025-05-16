
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LoveMeterProps {
  className?: string;
  startFilling?: boolean;
  onComplete?: () => void;
}

export function LoveMeter({ className, startFilling = false, onComplete }: LoveMeterProps) {
  const [fillWidth, setFillWidth] = useState(0);
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (!startFilling) return;
    
    const duration = 2000; // 2 seconds
    const interval = 20; // update every 20ms
    const steps = duration / interval;
    const increment = 100 / steps;
    let currentWidth = 0;
    
    const timer = setInterval(() => {
      currentWidth += increment;
      
      if (currentWidth >= 100) {
        currentWidth = 100;
        clearInterval(timer);
        if (onComplete && !hasCompleted.current) {
          hasCompleted.current = true;
          setTimeout(onComplete, 500);
        }
      }
      
      setFillWidth(currentWidth);
    }, interval);
    
    return () => clearInterval(timer);
  }, [startFilling, onComplete]);

  return (
    <div className={cn('flex flex-col items-center w-full max-w-md mx-auto', className)}>
      <div className="love-meter-container">
        <div 
          className="love-meter-fill" 
          style={{ width: `${fillWidth}%` }} 
        />
      </div>
      <p className="mt-2 text-love-dark font-medium">
        Our love meter: {Math.round(fillWidth)}%
      </p>
    </div>
  );
}

export default LoveMeter;
