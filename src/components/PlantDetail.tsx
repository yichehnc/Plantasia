import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plant, JournalEntry } from '../data/plants';
import { audioEngine } from '../utils/audio';
import { cn } from '../lib/utils';
import { Droplets, Sun, ShieldAlert, History, ArrowLeft, CloudRain, Music, BookOpen, Plus, Tag, Camera, Check } from 'lucide-react';

interface PlantDetailProps {
  plant: Plant;
  onClose: () => void;
  onUpdate: (updatedPlant: Plant) => void;
}

export function PlantDetail({ plant, onClose, onUpdate }: PlantDetailProps) {
  const [isWatering, setIsWatering] = useState(false);
  const [showMistParticles, setShowMistParticles] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [activeTab, setActiveTab] = useState<'care' | 'journal'>('care');
  
  // Journal State
  const [newNote, setNewNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<JournalEntry['tags']>([]);
  const [isAddingEntry, setIsAddingEntry] = useState(false);

  // Stop music on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopAmbient();
    };
  }, []);

  // Update music when vibrancy changes
  useEffect(() => {
    if (isPlayingMusic) {
      audioEngine.updateVibrancy(plant.vibrancy);
    }
  }, [plant.vibrancy, isPlayingMusic]);

  const toggleMusic = async () => {
    if (isPlayingMusic) {
      audioEngine.stopAmbient();
      setIsPlayingMusic(false);
    } else {
      await audioEngine.init();
      audioEngine.startAmbient(plant.vibrancy);
      setIsPlayingMusic(true);
    }
  };

  const handleWater = async () => {
    setIsWatering(true);
    await audioEngine.init();
    audioEngine.playWateringSound();
    
    // Simulate watering delay and effect
    setTimeout(() => {
      const newVibrancy = Math.min(plant.vibrancy + 0.15, 1.0);
      
      // Auto-add journal entry for watering
      const waterEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        note: 'Watered the plant.',
        tags: ['Watered']
      };

      const updatedPlant: Plant = {
        ...plant,
        vibrancy: newVibrancy,
        status: newVibrancy > 0.8 ? 'Thriving' : 'Alive',
        lastWatered: new Date().toISOString(),
        journal: [waterEntry, ...plant.journal]
      };
      
      onUpdate(updatedPlant);
      setIsWatering(false);
    }, 500);
  };

  const handleMist = async () => {
    await audioEngine.init();
    audioEngine.playMistSound();
    setShowMistParticles(true);
    
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    setTimeout(() => {
      setShowMistParticles(false);
      const newVibrancy = Math.min(plant.vibrancy + 0.05, 1.0);
      onUpdate({
        ...plant,
        vibrancy: newVibrancy
      });
    }, 1000);
  };

  const handleAddJournalEntry = () => {
    if (!newNote.trim() && selectedTags.length === 0) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      note: newNote,
      tags: selectedTags.length > 0 ? selectedTags : ['Note']
    };

    onUpdate({
      ...plant,
      journal: [entry, ...plant.journal]
    });

    setNewNote('');
    setSelectedTags([]);
    setIsAddingEntry(false);
  };

  const toggleTag = (tag: JournalEntry['tags'][0]) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const availableTags: JournalEntry['tags'][0][] = ['Repotted', 'Fertilized', 'Pest Treatment', 'Pruned', 'Note'];
  const wateredToday = new Date(plant.lastWatered).toDateString() === new Date().toDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 flex flex-col bg-paper overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-ink/10 bg-paper z-10">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-ink/5 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-ink" />
        </button>
        <h2 className="font-serif text-2xl italic text-ink truncate max-w-[200px]">{plant.name}</h2>
        <button 
          onClick={toggleMusic}
          className={cn(
            "p-2 rounded-full transition-all duration-500",
            isPlayingMusic ? "bg-green-vibrant text-white shadow-lg animate-pulse" : "hover:bg-ink/5 text-ink/40"
          )}
        >
          <Music className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ink/10 bg-paper z-10">
        <button 
          onClick={() => setActiveTab('care')}
          className={cn(
            "flex-1 py-4 text-xs uppercase tracking-widest font-bold transition-colors relative",
            activeTab === 'care' ? "text-ink" : "text-ink/40 hover:text-ink/60"
          )}
        >
          Care Profile
          {activeTab === 'care' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink" />}
        </button>
        <button 
          onClick={() => setActiveTab('journal')}
          className={cn(
            "flex-1 py-4 text-xs uppercase tracking-widest font-bold transition-colors relative",
            activeTab === 'journal' ? "text-ink" : "text-ink/40 hover:text-ink/60"
          )}
        >
          Journal ({plant.journal.length})
          {activeTab === 'journal' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {activeTab === 'care' ? (
          <div className="p-6 max-w-2xl mx-auto w-full space-y-8">
            {/* Hero Image Card */}
            <div className="relative aspect-[3/4] w-full rounded-sm border-2 border-ink/10 p-2 bg-white shadow-lg">
              <div className="relative w-full h-full overflow-hidden rounded-sm bg-gray-100">
                <motion.img 
                  src={plant.image} 
                  alt={plant.name}
                  className="w-full h-full object-cover"
                  style={{ 
                    filter: `grayscale(${100 - (plant.vibrancy * 100)}%) contrast(1.1) brightness(${0.9 + (plant.vibrancy * 0.1)})`
                  }}
                  animate={{
                    filter: `grayscale(${100 - (plant.vibrancy * 100)}%) contrast(1.1) brightness(${0.9 + (plant.vibrancy * 0.1)})`
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleMist();
                  }}
                />
                
                {/* Grain Overlay on Image */}
                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
                />

                {/* Mist Particles */}
                <AnimatePresence>
                  {showMistParticles && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
                    >
                      <div className="w-full h-full bg-white/30 backdrop-blur-[1px]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Vibrancy Meter */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs uppercase tracking-widest opacity-60">
                <span>Dormant</span>
                <span>Vibrancy</span>
                <span>Thriving</span>
              </div>
              <div className="h-2 w-full bg-ink/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-gray-400 to-green-vibrant"
                  initial={{ width: `${plant.vibrancy * 100}%` }}
                  animate={{ width: `${plant.vibrancy * 100}%` }}
                  transition={{ type: "spring", stiffness: 50 }}
                />
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center">
              <div className={cn(
                "px-4 py-2 border-2 rounded-full text-xs font-bold uppercase tracking-widest",
                plant.status === 'Thriving' ? "border-green-vibrant text-green-vibrant" : "border-ink/50 text-ink/50"
              )}>
                Condition: {plant.status}
              </div>
            </div>

            {/* Data Modules Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Light */}
              <div className="p-4 border border-ink/10 rounded-lg bg-white/50 space-y-2 flex flex-col items-center">
                <div className="flex items-center gap-2 text-ink/60 w-full">
                  <Sun className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Light</span>
                </div>
                
                {/* Analog Dial */}
                <div className="relative w-24 h-12 overflow-hidden mt-2">
                  {/* Dial Arc */}
                  <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-8 border-ink/10 border-b-0 box-border" />
                  
                  {/* Needle */}
                  <motion.div 
                    className="absolute bottom-0 left-1/2 w-1 h-12 bg-ink origin-bottom rounded-full"
                    initial={{ rotate: -90 }}
                    animate={{ 
                      rotate: plant.light === 'Direct Light' ? 45 : 
                              plant.light === 'Indirect Bright' ? 0 : 
                              plant.light === 'Moderate' ? -30 : -60 
                    }}
                    transition={{ type: "spring", stiffness: 60, damping: 10 }}
                    style={{ marginLeft: '-2px' }}
                  />
                  
                  {/* Center Dot */}
                  <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-ink rounded-full -translate-x-1/2 translate-y-1/2" />
                </div>
                
                <p className="font-serif text-lg mt-1 text-center">{plant.light}</p>
              </div>

              {/* Water */}
              <div className="p-4 border border-ink/10 rounded-lg bg-white/50 space-y-3">
                <div className="flex items-center gap-2 text-ink/60">
                  <Droplets className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Water</span>
                </div>
                <p className="font-serif text-lg">{plant.waterAmount}</p>
                <p className="text-xs opacity-60">{plant.frequency}</p>
                <button
                  type="button"
                  onClick={handleWater}
                  disabled={isWatering || wateredToday}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors",
                    wateredToday
                      ? "border-green-vibrant/30 bg-green-vibrant/10 text-ink"
                      : "border-ink/10 bg-paper/70 text-ink hover:border-ink/25 hover:bg-white",
                    (isWatering || wateredToday) && "cursor-default"
                  )}
                >
                  <span className="text-xs uppercase tracking-[0.18em] text-ink/60">
                    {wateredToday ? 'Watered today' : isWatering ? 'Watering...' : 'Mark as watered'}
                  </span>
                  <span className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-sm border transition-colors",
                    wateredToday
                      ? "border-green-vibrant bg-green-vibrant text-white"
                      : "border-ink/25 bg-white text-transparent"
                  )}>
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </button>
              </div>
            </div>

            {/* Environmental Needs Drawer */}
            <div className="p-4 border border-ink/10 rounded-lg bg-white/50 space-y-3">
              <h3 className="text-xs uppercase tracking-wider opacity-60">Environmental Needs</h3>
              <div className="flex flex-wrap gap-2">
                {plant.environmentalNeeds.ventilation && (
                  <span className="px-2 py-1 bg-ink/5 rounded text-xs">Good airflow</span>
                )}
                {plant.environmentalNeeds.shadeTolerant && (
                  <span className="px-2 py-1 bg-ink/5 rounded text-xs">Shade tolerant</span>
                )}
                {plant.environmentalNeeds.brightIndirect && (
                  <span className="px-2 py-1 bg-ink/5 rounded text-xs">Bright indirect light</span>
                )}
              </div>
            </div>

            {/* Safety Warning */}
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-lg">
              <div className="flex gap-3">
                <ShieldAlert className="w-5 h-5 text-yellow-700 shrink-0" />
                <p className="text-sm text-yellow-900 leading-relaxed">
                  {plant.notes}
                </p>
              </div>
            </div>

            {/* History Footer */}
            <div className="flex items-center gap-2 justify-center text-xs opacity-40 pt-4 pb-8">
              <History className="w-3 h-3" />
              <span>Joined the Archive: {new Date(plant.purchaseDate).toLocaleDateString()}</span>
            </div>
          </div>
        ) : (
          <div className="p-6 max-w-2xl mx-auto w-full space-y-6">
            {/* Add Entry Button */}
            {!isAddingEntry && (
              <button 
                onClick={() => setIsAddingEntry(true)}
                className="w-full py-4 border-2 border-dashed border-ink/20 rounded-lg flex items-center justify-center gap-2 text-ink/60 hover:bg-ink/5 hover:border-ink/40 transition-all group"
              >
                <Plus className="w-5 h-5" />
                <span className="font-mono text-sm uppercase tracking-wider">Add Journal Entry</span>
              </button>
            )}

            {/* Add Entry Form */}
            <AnimatePresence>
              {isAddingEntry && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white p-4 rounded-lg border border-ink/10 space-y-4 shadow-sm">
                    <textarea 
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="How is the plant doing today?"
                      className="w-full p-3 bg-paper rounded border border-ink/10 font-serif text-lg focus:outline-none focus:border-ink/30 min-h-[100px]"
                    />
                    
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors border",
                            selectedTags.includes(tag) 
                              ? "bg-ink text-paper border-ink" 
                              : "bg-transparent text-ink/60 border-ink/20 hover:border-ink/40"
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/60 hover:text-ink">
                        <Camera className="w-4 h-4" />
                        Add Photo
                      </button>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setIsAddingEntry(false)}
                          className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink/60 hover:text-ink"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleAddJournalEntry}
                          className="px-6 py-2 bg-ink text-paper rounded-full text-xs font-bold uppercase tracking-wider hover:bg-ink/90"
                        >
                          Save Entry
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timeline */}
            <div className="space-y-6 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-px before:bg-ink/10">
              {plant.journal.length === 0 ? (
                <div className="text-center py-12 opacity-40">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 stroke-1" />
                  <p className="font-serif italic text-lg">No journal entries yet.</p>
                </div>
              ) : (
                plant.journal.map((entry) => (
                  <div key={entry.id} className="relative pl-12">
                    {/* Timeline Dot */}
                    <div className="absolute left-[13px] top-4 w-2 h-2 rounded-full bg-ink/30 ring-4 ring-paper" />
                    
                    <div className="bg-white p-4 rounded-lg border border-ink/5 shadow-sm space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-xs opacity-50">
                          {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <div className="flex gap-1">
                          {entry.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-ink/5 rounded text-[10px] uppercase font-bold tracking-wider text-ink/60">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="font-serif text-lg leading-relaxed">{entry.note}</p>
                      {entry.image && (
                        <div className="mt-3 rounded overflow-hidden border border-ink/10">
                          <img src={entry.image} alt="Journal entry" className="w-full h-auto object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Bar (Only visible in Care tab) */}
      <AnimatePresence>
        {activeTab === 'care' && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-paper via-paper to-transparent z-20"
          >
            <div className="flex gap-4 max-w-2xl mx-auto">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleWater}
                className="flex-1 h-16 bg-ink text-paper rounded-xl font-serif text-xl flex items-center justify-center gap-3 shadow-lg hover:bg-ink/90 transition-colors relative overflow-hidden"
              >
                <Droplets className="w-5 h-5" />
                <span>Watered</span>
                {isWatering && (
                  <motion.div 
                    className="absolute inset-0 bg-white/20"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
