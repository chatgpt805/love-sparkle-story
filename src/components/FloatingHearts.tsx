
import React, { useEffect, useState } from 'react';

interface FloatingHeart {
  id: number;
  left: string;
  size: string;
  animationDuration: string;
  delay: string;
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    const heartCount = Math.max(5, Math.floor(window.innerWidth / 100));
    const newHearts: FloatingHeart[] = [];
    
    for (let i = 0; i < heartCount; i++) {
      newHearts.push({
        id: i,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 1 + 0.5}rem`,
        animationDuration: `${Math.random() * 5 + 10}s`,
        delay: `${Math.random() * 5}s`
      });
    }
    
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="floating-heart animate-float absolute bottom-0"
          style={{
            left: heart.left,
            fontSize: heart.size,
            animationDuration: heart.animationDuration,
            animationDelay: heart.delay,
            bottom: `-${heart.size}`,
            opacity: Math.random() * 0.5 + 0.3
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
}

export default FloatingHearts;
