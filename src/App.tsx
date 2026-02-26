import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plant, INITIAL_PLANTS } from './data/plants';
import { PlantCard } from './components/PlantCard';
import { PlantDetail } from './components/PlantDetail';
import { audioEngine } from './utils/audio';
import { Sprout } from 'lucide-react';

export default function App() {
  const [plants, setPlants] = useState<Plant[]>(INITIAL_PLANTS);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);

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

  const selectedPlant = plants.find(p => p.id === selectedPlantId);

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-green-vibrant selection:text-white overflow-x-hidden">
      {/* Grain Overlay Global */}
      <div className="grain-overlay" />

      {/* Poster Header */}
      <header className="pt-8 pb-4 px-4 md:px-8 max-w-7xl mx-auto text-center">
        <div className="font-mono text-xs font-bold tracking-[0.2em] uppercase mb-4 opacity-60">
          Reminder
        </div>
        
        <div className="relative">
          <h1 className="text-poster text-[18vw] md:text-[14vw] text-green-vibrant leading-[0.8] tracking-tighter select-none">
            <div className="flex justify-center">WATER</div>
            <div className="flex justify-center">THE</div>
            <div className="flex justify-center">PLANTS</div>
          </h1>
          
          {/* Decorative elements or small text interspersed could go here */}
        </div>
      </header>

      {/* Main Grid */}
      <main className="px-4 md:px-8 pb-24 max-w-7xl mx-auto -mt-8 md:-mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
          {plants.map((plant, index) => (
            <div key={plant.id} className={`${index % 2 === 0 ? 'md:translate-y-12' : ''}`}>
              <PlantCard 
                plant={plant} 
                onClick={() => setSelectedPlantId(plant.id)}
                onUpdate={handleUpdatePlant}
              />
            </div>
          ))}
          
          {/* Add Plant Placeholder */}
          <button className={`aspect-[3/4] rounded-sm border-2 border-dashed border-ink/20 flex flex-col items-center justify-center gap-2 hover:bg-ink/5 transition-colors group ${plants.length % 2 === 0 ? 'md:translate-y-12' : ''}`}>
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
      </AnimatePresence>
    </div>
  );
}
