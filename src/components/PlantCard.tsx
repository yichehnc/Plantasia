import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plant } from '../data/plants';
import { cn } from '../lib/utils';
import { CloudRain, Sprout } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface PlantCardProps {
  plant: Plant;
  onClick: () => void;
  onUpdate?: (plant: Plant) => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onClick, onUpdate }) => {
  const [isMisting, setIsMisting] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleMist = async () => {
    setIsMisting(true);
    await audioEngine.init();
    audioEngine.playMistSound();
    
    if (navigator.vibrate) navigator.vibrate(50);

    setTimeout(() => {
      setIsMisting(false);
      if (onUpdate) {
        onUpdate({
          ...plant,
          vibrancy: Math.min(plant.vibrancy + 0.05, 1.0)
        });
      }
    }, 1000);
  };

  const startPress = () => {
    pressTimer.current = setTimeout(() => {
      handleMist();
    }, 600); // 600ms long press
  };

  const cancelPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  return (
    <motion.div
      layoutId={`plant-${plant.id}`}
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onClick={(e) => {
        if (!isMisting) onClick();
      }}
      className="group cursor-pointer relative flex flex-col items-center text-center"
    >
      {/* Image Container - Minimal, no border, just the image */}
      <div
        className="relative mb-3 w-full overflow-hidden bg-white/60 shadow-[0_22px_45px_rgba(26,26,26,0.06)]"
        style={{ aspectRatio: plant.posterRatio ?? 0.75 }}
      >
        {imageFailed ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_50%_30%,rgba(40,167,69,0.2),transparent_42%),linear-gradient(135deg,rgba(255,255,255,0.8),rgba(244,241,234,0.4))] p-8 text-green-vibrant">
            <Sprout className="h-16 w-16 stroke-[1.2]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink/40">
              Botanical study
            </span>
          </div>
        ) : (
          <motion.img
            src={plant.image}
            alt={plant.name}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105"
            style={{
              filter: `grayscale(${100 - (plant.vibrancy * 100)}%) contrast(1.2) brightness(1.05)`,
              imageRendering: plant.image.startsWith('data:image/svg+xml') ? 'pixelated' : 'auto',
              mixBlendMode: 'multiply'
            }}
          />
        )}
        
        {/* Mist Overlay */}
        <AnimatePresence>
          {isMisting && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-white/30 backdrop-blur-[1px]"
            >
              <CloudRain className="w-8 h-8 text-ink animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Typography - Matches the poster style */}
      <div className="space-y-1">
        <h3 className="font-sans font-bold text-xs md:text-sm leading-tight uppercase tracking-tight">
          {plant.name}
        </h3>
        <p className="font-serif italic text-[10px] md:text-xs opacity-60">
          {plant.species}
        </p>
      </div>

      {/* Status Indicator - Minimal Dot */}
      {plant.status !== 'Thriving' && (
        <div className={cn(
          "absolute top-0 right-0 w-2 h-2 rounded-full shadow-sm",
          plant.status === 'Needs Attention' ? "bg-yellow-500" :
          plant.status === 'Dead' ? "bg-red-500" : "bg-blue-400"
        )} />
      )}
    </motion.div>
  );
};
