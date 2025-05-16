
import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  xVelocity: number;
  yVelocity: number;
  shape: 'circle' | 'square' | 'heart';
}

interface ConfettiProps {
  count?: number;
  active?: boolean;
}

export function Confetti({ count = 100, active = false }: ConfettiProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  const colors = [
    '#FF6B81', // love red
    '#FFC0CB', // romantic pink
    '#FFD700', // gold
    '#87CEEB', // sky blue
    '#FFFFFF', // white
    '#FF69B4', // hot pink
  ];

  const createConfettiPiece = (index: number): ConfettiPiece => {
    return {
      id: index,
      x: Math.random() * 100,
      y: -20 - Math.random() * 80, // Start above the screen
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      xVelocity: Math.random() * 2 - 1,
      yVelocity: Math.random() * 3 + 2,
      shape: ['circle', 'square', 'heart'][Math.floor(Math.random() * 3)] as any
    };
  };

  useEffect(() => {
    if (!active) {
      setConfetti([]);
      return;
    }

    // Create initial confetti
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < count; i++) {
      pieces.push(createConfettiPiece(i));
    }
    setConfetti(pieces);

    // Animate confetti
    const interval = setInterval(() => {
      setConfetti(prevConfetti => {
        return prevConfetti.map(piece => {
          // Move confetti
          const newY = piece.y + piece.yVelocity;
          const newX = piece.x + piece.xVelocity;
          const newRotation = piece.rotation + 2;

          // Remove confetti that's gone offscreen
          if (newY > 120) {
            return createConfettiPiece(piece.id);
          }

          return {
            ...piece,
            y: newY,
            x: newX,
            rotation: newRotation
          };
        });
      });
    }, 50);

    return () => clearInterval(interval);
  }, [active, count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => {
        let shapeClass = '';
        
        switch(piece.shape) {
          case 'circle':
            shapeClass = 'rounded-full';
            break;
          case 'heart':
            return (
              <div
                key={piece.id}
                className="absolute text-2xl"
                style={{
                  left: `${piece.x}%`,
                  top: `${piece.y}%`,
                  transform: `rotate(${piece.rotation}deg)`,
                  color: piece.color,
                  fontSize: `${piece.size}px`
                }}
              >
                ❤️
              </div>
            );
          default:
            shapeClass = '';
        }
        
        return (
          <div
            key={piece.id}
            className={`absolute ${shapeClass}`}
            style={{
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              backgroundColor: piece.color,
              transform: `rotate(${piece.rotation}deg)`
            }}
          />
        );
      })}
    </div>
  );
}

export default Confetti;
