import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  rotationSpeed: number;
}

interface ConfettiProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
  onComplete?: () => void;
}

const colors = ['#58CC02', '#1CB0F6', '#FF9600', '#FF4B4B', '#8B5CF6', '#EC4899', '#FFD700'];

export const Confetti: React.FC<ConfettiProps> = ({
  active,
  duration = 3000,
  particleCount = 50,
  onComplete,
}) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setIsVisible(true);
      const newPieces: ConfettiPiece[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        velocity: {
          x: (Math.random() - 0.5) * 10,
          y: Math.random() * 3 + 2,
        },
        rotationSpeed: (Math.random() - 0.5) * 10,
      }));
      setPieces(newPieces);

      const timeout = setTimeout(() => {
        setIsVisible(false);
        setPieces([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [active, duration, particleCount, onComplete]);

  useEffect(() => {
    if (!isVisible || pieces.length === 0) return;

    const interval = setInterval(() => {
      setPieces((prevPieces) =>
        prevPieces.map((piece) => ({
          ...piece,
          x: piece.x + piece.velocity.x,
          y: piece.y + piece.velocity.y,
          rotation: piece.rotation + piece.rotationSpeed,
          velocity: {
            ...piece.velocity,
            y: piece.velocity.y + 0.1, // gravity
          },
        }))
      );
    }, 16);

    return () => clearInterval(interval);
  }, [isVisible, pieces.length]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: piece.x,
            top: piece.y,
            width: piece.size,
            height: piece.size * 0.6,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  );
};

interface CelebrationOverlayProps {
  show: boolean;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  xpGained?: number;
  onClose: () => void;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  show,
  title,
  subtitle,
  icon,
  xpGained,
  onClose,
}) => {
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(onClose, 4000);
      return () => clearTimeout(timeout);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <>
      <Confetti active={show} />
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4 animate-bounce-in shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {icon && (
            <div className="text-6xl mb-4 animate-pulse">{icon}</div>
          )}
          <h2 className="text-2xl font-bold text-[#3C3C3C] mb-2">{title}</h2>
          {subtitle && (
            <p className="text-[#777777] mb-4">{subtitle}</p>
          )}
          {xpGained && (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF9600] to-[#FFB347] text-white px-4 py-2 rounded-full font-bold">
              <span>+{xpGained} XP</span>
            </div>
          )}
          <button
            onClick={onClose}
            className="mt-6 w-full bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
      <style>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </>
  );
};
