import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Plant, INITIAL_PLANTS } from './data/plants';
import { PlantCard } from './components/PlantCard';
import { PlantDetail } from './components/PlantDetail';
import { AddPlantModal } from './components/AddPlantModal';
import { audioEngine } from './utils/audio';

export default function App() {
  const [plants, setPlants] = useState<Plant[]>(INITIAL_PLANTS);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [isAddingPlant, setIsAddingPlant] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18, 0.32], [1, 0.55, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.32], [1, 0.88]);
  const heroY = useTransform(scrollYProgress, [0, 0.32], [0, -140]);
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const archiveOpacity = useTransform(scrollYProgress, [0.18, 0.34], [0, 1]);
  const archiveY = useTransform(scrollYProgress, [0.18, 0.34], [60, 0]);

  // Initialize audio engine on first interaction
  useEffect(() => {
    const initAudio = async () => {
      document.addEventListener('click', () => {
        audioEngine.init();
      }, { once: true });
    };
    initAudio();
  }, []);

  const handleUpdatePlant = (updatedPlant: Plant) => {
    setPlants(plants.map(p => p.id === updatedPlant.id ? updatedPlant : p));
  };

  const handleAddPlant = (plant: Plant) => {
    setPlants([plant, ...plants]);
  };

  const selectedPlant = plants.find(p => p.id === selectedPlantId);

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-green-vibrant selection:text-white overflow-x-hidden">
      {/* Grain Overlay Global */}
      <div className="grain-overlay" />

      {/* Poster Cover */}
      <header className="sticky top-0 z-0 flex min-h-screen flex-col justify-between overflow-hidden px-4 py-8 text-center md:px-8 md:py-10">
        <motion.div
          style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
          className="font-mono text-xs font-bold tracking-[0.35em] uppercase opacity-60"
        >
          Reminder
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
          className="relative mx-auto flex w-full max-w-[1800px] flex-1 items-center justify-center"
        >
          <h1 className="text-poster w-full text-[23vw] leading-[0.72] tracking-[-0.06em] text-green-vibrant select-none md:text-[20vw] lg:text-[18vw] 2xl:text-[17vw]">
            <span className="block">WATER</span>
            <span className="block">THE</span>
            <span className="block">PLANTS</span>
          </h1>
        </motion.div>

        <motion.div
          style={{ opacity: scrollCueOpacity }}
          className="mx-auto flex max-w-sm flex-col items-center gap-3 pb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink/50"
        >
          <span>Scroll for the living archive</span>
          <span className="h-10 w-px bg-ink/20" />
        </motion.div>
      </header>

      {/* Plant Poster Wall */}
      <main className="relative z-10 mx-auto -mt-[18vh] max-w-[1500px] px-4 pb-24 pt-10 md:px-8 md:pt-20">
        <motion.div
          style={{ opacity: archiveOpacity, y: archiveY }}
          className="mb-12 flex flex-col gap-3 text-center md:mb-16"
        >
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-ink/45">
            Plant poster archive
          </p>
          <h2 className="font-serif text-4xl italic leading-none text-ink md:text-6xl">
            <span className="text-accent not-italic">{plants.length}</span> housemates, one watering ritual.
          </h2>
        </motion.div>

        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4 md:gap-8">
          {plants.map((plant) => (
            <div key={plant.id} className="mb-12 inline-block w-full break-inside-avoid md:mb-16">
              <PlantCard 
                plant={plant} 
                onClick={() => setSelectedPlantId(plant.id)}
                onUpdate={handleUpdatePlant}
              />
            </div>
          ))}
          
          {/* Add Plant Placeholder */}
          <button
            onClick={() => setIsAddingPlant(true)}
            className="mb-12 inline-flex aspect-[3/4] w-full break-inside-avoid flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed border-ink/20 hover:bg-ink/5 transition-colors group md:mb-16"
          >
            <div className="w-12 h-12 rounded-full border border-ink/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl font-serif italic">+</span>
            </div>
            <span className="font-mono text-xs uppercase tracking-widest opacity-50">Add Plant</span>
          </button>
        </div>
      </main>

      {/* Detail View Modal */}
      <AnimatePresence>
        {selectedPlant && (
          <PlantDetail 
            plant={selectedPlant} 
            onClose={() => setSelectedPlantId(null)}
            onUpdate={handleUpdatePlant}
          />
        )}
        {isAddingPlant && (
          <AddPlantModal
            onClose={() => setIsAddingPlant(false)}
            onAdd={handleAddPlant}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
