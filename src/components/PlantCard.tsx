import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CloudRain, Droplets, Sprout } from 'lucide-react';
import { Plant } from '../data/plants';
import { cn } from '../lib/utils';
import { audioEngine } from '../utils/audio';

interface PlantCardProps {
  plant: Plant;
  onClick: () => void;
  onUpdate?: (plant: Plant) => void;
}

function parseWateringIntervalDays(frequency: string) {
  const normalized = frequency.trim().toLowerCase();
  const match = normalized.match(/^(\d+)\s*\/\s*(week|month)$/);

  if (!match) return 7;

  const amount = Number(match[1]);
  return match[2] === 'week'
    ? Math.max(1, Math.round(7 / Math.max(amount, 1)))
    : Math.max(1, Math.round(30 / Math.max(amount, 1)));
}

function getWateringState(plant: Plant) {
  const interval = parseWateringIntervalDays(plant.frequency);
  const daysSince = Math.max(0, Math.floor((Date.now() - new Date(plant.lastWatered).getTime()) / 86400000));
  const remaining = interval - daysSince;

  if (remaining <= 0) return `Water now`;
  if (remaining === 1) return 'Water tomorrow';
  return `${remaining} days left`;
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

    window.setTimeout(() => {
      setIsMisting(false);
      onUpdate?.({
        ...plant,
        vibrancy: Math.min(plant.vibrancy + 0.05, 1),
      });
    }, 900);
  };

  const startPress = () => {
    pressTimer.current = setTimeout(() => {
      handleMist();
    }, 600);
  };

  const cancelPress = () => {
    if (!pressTimer.current) return;
    clearTimeout(pressTimer.current);
    pressTimer.current = null;
  };

  const statusTone =
    plant.status === 'Thriving' ? 'bg-leaf text-white' :
    plant.status === 'Needs Attention' ? 'bg-clay text-white' :
    plant.status === 'Dead' ? 'bg-ink text-white' :
    'bg-sky text-ink';

  return (
    <motion.button
      layoutId={`plant-${plant.id}`}
      type="button"
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onClick={() => {
        if (!isMisting) onClick();
      }}
      className="group relative flex w-full flex-col overflow-hidden rounded-[2rem] border border-ink/10 bg-white/80 text-left shadow-soft"
    >
      <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(79,117,67,0.18),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(238,231,217,0.78))] p-4">
        <div
          className="relative overflow-hidden rounded-[1.5rem] bg-white/70 shadow-[inset_0_0_0_1px_rgba(15,23,20,0.06)]"
          style={{ aspectRatio: plant.posterRatio ?? 0.75 }}
        >
          {imageFailed ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_50%_25%,rgba(79,117,67,0.18),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(232,223,205,0.55))] p-8 text-leaf-deep">
              <Sprout className="h-16 w-16 stroke-[1.2]" />
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-ink/40">
                Pixel study
              </span>
            </div>
          ) : (
            <motion.img
              src={plant.image}
              alt={plant.name}
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover"
              style={{
                filter: `grayscale(${100 - plant.vibrancy * 100}%) contrast(1.08) brightness(1.02)`,
                imageRendering: plant.image.startsWith('data:image/svg+xml') ? 'pixelated' : 'auto',
                mixBlendMode: 'multiply',
              }}
            />
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/25 to-transparent" />

          <div className="absolute left-4 top-4">
            <span className={cn(
              'inline-flex rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] shadow-soft',
              statusTone
            )}>
              {plant.status}
            </span>
          </div>

          <AnimatePresence>
            {isMisting && (
              <motion.div
                initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-white/30 backdrop-blur-[1px]"
            >
              <CloudRain className="h-8 w-8 text-ink" />
            </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="space-y-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-[2.6rem] leading-[0.9] text-ink sm:text-3xl">{plant.name}</h3>
            <p className="mt-2 text-sm italic text-ink/55">{plant.species}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm text-ink/70 min-[420px]:grid-cols-2">
          <div className="rounded-2xl bg-canvas/80 p-3">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45">
              <Droplets className="h-4 w-4" />
              Watering
            </div>
            <p className="font-medium text-ink">{plant.waterAmount}</p>
            <p className="mt-1 text-xs text-ink/55">{plant.frequency}</p>
          </div>
          <div className="rounded-2xl bg-canvas/80 p-3">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45">Next action</div>
            <p className="font-medium text-ink">{getWateringState(plant)}</p>
            <p className="mt-1 text-xs text-ink/55">{plant.light}</p>
          </div>
        </div>
      </div>
    </motion.button>
  );
};
