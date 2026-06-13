import React, { startTransition, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Droplets, Leaf, Plus, Sparkles, Sprout } from 'lucide-react';
import { Plant, INITIAL_PLANTS } from './data/plants';
import { PlantCard } from './components/PlantCard';
import { PlantDetail } from './components/PlantDetail';
import { AddPlantModal } from './components/AddPlantModal';
import { audioEngine } from './utils/audio';

const STORAGE_KEY = 'plantasia-archive-v2';

const FILTERS = ['All', 'Needs Attention', 'Thriving', 'Alive'] as const;
type Filter = (typeof FILTERS)[number];

function parseWateringIntervalDays(frequency: string) {
  const normalized = frequency.trim().toLowerCase();

  if (normalized.includes('/day')) return 1;

  const match = normalized.match(/^(\d+)\s*\/\s*(week|month)$/);
  if (!match) return 7;

  const amount = Number(match[1]);
  const period = match[2];

  if (period === 'week') {
    return Math.max(1, Math.round(7 / Math.max(amount, 1)));
  }

  return Math.max(1, Math.round(30 / Math.max(amount, 1)));
}

function getDaysSince(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

function getUrgencyScore(plant: Plant) {
  const interval = parseWateringIntervalDays(plant.frequency);
  const daysSince = getDaysSince(plant.lastWatered);
  const overdueDays = Math.max(0, daysSince - interval);
  const statusPenalty =
    plant.status === 'Needs Attention' ? 12 :
    plant.status === 'Alive' ? 4 :
    plant.status === 'Dead' ? 20 : 0;

  return overdueDays * 10 + statusPenalty + (1 - plant.vibrancy) * 8;
}

function loadPlants() {
  if (typeof window === 'undefined') return INITIAL_PLANTS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Plant[]) : INITIAL_PLANTS;
  } catch {
    return INITIAL_PLANTS;
  }
}

export default function App() {
  const [plants, setPlants] = useState<Plant[]>(loadPlants);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [isAddingPlant, setIsAddingPlant] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const { scrollYProgress } = useScroll();

  const heroOpacity = useTransform(scrollYProgress, [0, 0.12, 0.28], [1, 0.82, 0.2]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.94]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
  }, [plants]);

  useEffect(() => {
    const onFirstPress = () => {
      audioEngine.init();
    };

    document.addEventListener('pointerdown', onFirstPress, { once: true });
    return () => document.removeEventListener('pointerdown', onFirstPress);
  }, []);

  const sortedPlants = useMemo(
    () => [...plants].sort((a, b) => getUrgencyScore(b) - getUrgencyScore(a) || a.name.localeCompare(b.name)),
    [plants],
  );

  const filteredPlants = useMemo(() => {
    if (activeFilter === 'All') return sortedPlants;
    return sortedPlants.filter((plant) => plant.status === activeFilter);
  }, [activeFilter, sortedPlants]);

  const selectedPlant = plants.find((plant) => plant.id === selectedPlantId) ?? null;

  const urgentPlants = sortedPlants.filter((plant) => getUrgencyScore(plant) > 6).slice(0, 3);
  const thrivingCount = plants.filter((plant) => plant.status === 'Thriving').length;
  const attentionCount = plants.filter((plant) => plant.status === 'Needs Attention').length;
  const wateredRecentlyCount = plants.filter((plant) => getDaysSince(plant.lastWatered) <= 2).length;

  const handleUpdatePlant = (updatedPlant: Plant) => {
    startTransition(() => {
      setPlants((currentPlants) => currentPlants.map((plant) => (
        plant.id === updatedPlant.id ? updatedPlant : plant
      )));
    });
  };

  const handleAddPlant = (plant: Plant) => {
    startTransition(() => {
      setPlants((currentPlants) => [plant, ...currentPlants]);
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas text-ink selection:bg-leaf selection:text-white">
      <div className="grain-overlay" />
      <div className="ambient-orb ambient-orb-a" />
      <div className="ambient-orb ambient-orb-b" />

      <header className="relative isolate overflow-hidden px-5 pb-12 pt-6 md:px-8 lg:px-10">
        <motion.div style={{ opacity: heroOpacity, y: heroY, scale: heroScale }} className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Plantasia archive</p>
              <p className="mt-2 max-w-xl text-sm text-ink/60 max-md:hidden md:text-base">
                A refined plant care companion with no filler stock imagery, only pixel studies or your own uploads.
              </p>
            </div>
            <button
              onClick={() => setIsAddingPlant(true)}
              className="hidden rounded-full border border-ink/15 bg-white/70 px-5 py-3 text-sm font-semibold text-ink shadow-soft transition hover:-translate-y-0.5 hover:border-ink/30 hover:bg-white md:inline-flex"
            >
              Add a plant
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="eyebrow">Watering ritual</p>
                <h1 className="display-title max-w-4xl text-leaf">
                  Keep every room in sync with a calmer, sharper plant archive.
                </h1>
                <p className="text-base leading-7 text-ink/65 md:hidden">
                  Track care and see what needs attention first.
                </p>
                <p className="hidden max-w-2xl text-base leading-7 text-ink/65 md:block md:text-lg">
                  Track care, log journal notes, and surface what needs attention first with motion-led interactions built in React.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-ink/10 pt-4">
                <div className="space-y-2">
                  <Droplets className="h-4 w-4 text-leaf-deep" />
                  <p className="font-display text-4xl leading-none text-ink">{wateredRecentlyCount}</p>
                  <p className="text-xs leading-4 text-ink/50 md:text-sm">watered</p>
                </div>
                <div className="space-y-2">
                  <Leaf className="h-4 w-4 text-leaf-deep" />
                  <p className="font-display text-4xl leading-none text-ink">{thrivingCount}</p>
                  <p className="text-xs leading-4 text-ink/50 md:text-sm">thriving</p>
                </div>
                <div className="space-y-2">
                  <Sparkles className="h-4 w-4 text-clay" />
                  <p className="font-display text-4xl leading-none text-ink">{attentionCount}</p>
                  <p className="text-xs leading-4 text-ink/50 md:text-sm">attention</p>
                </div>
              </div>
            </div>

            <aside className="border-t border-ink/10 pt-4 md:border md:border-ink/10 md:bg-white/35 md:p-5 md:shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">Focus queue</p>
                  <h2 className="mt-2 font-display text-2xl text-ink md:text-3xl">Start here</h2>
                </div>
                <Sprout className="h-5 w-5 shrink-0 text-leaf-deep/70 md:h-6 md:w-6" />
              </div>

              <div className="mt-4 divide-y divide-ink/10">
                {urgentPlants.length > 0 ? urgentPlants.map((plant, index) => (
                  <button
                    key={plant.id}
                    onClick={() => setSelectedPlantId(plant.id)}
                    className="flex w-full items-start justify-between gap-4 py-4 text-left transition first:pt-0 hover:text-ink/80"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/40">0{index + 1}</p>
                      <h3 className="mt-1 font-sans text-[1.1rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink md:text-[1.25rem]">{plant.name}</h3>
                      <p className="mt-1 truncate text-sm text-ink/50">{plant.species}</p>
                    </div>
                    <div className="pt-1">
                      <span className="inline-flex rounded-full border border-ink/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/55">
                        {plant.status}
                      </span>
                    </div>
                  </button>
                )) : (
                  <div className="py-6 text-sm text-ink/55">
                    The archive is in good shape right now.
                  </div>
                )}
              </div>
            </aside>
          </div>
        </motion.div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-24 md:px-8 lg:px-10">
        <section className="panel-solid mb-8 p-5 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Living archive</p>
              <h2 className="mt-2 font-display text-4xl text-ink md:text-5xl">{filteredPlants.length} plants on record</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60 max-md:hidden md:text-base">
                Every card keeps the same core data and interactions from the current Plantasia app, now organized for faster scanning and a cleaner visual rhythm.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={[
                    'rounded-full px-4 py-2 text-sm font-semibold transition',
                    activeFilter === filter
                      ? 'bg-ink text-white shadow-soft'
                      : 'border border-ink/10 bg-white/70 text-ink/65 hover:border-ink/30 hover:text-ink'
                  ].join(' ')}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="columns-1 gap-6 sm:columns-2 xl:columns-3 2xl:columns-4">
          {filteredPlants.map((plant) => (
            <div key={plant.id} className="mb-6 inline-block w-full break-inside-avoid md:mb-8">
              <PlantCard
                plant={plant}
                onClick={() => setSelectedPlantId(plant.id)}
                onUpdate={handleUpdatePlant}
              />
            </div>
          ))}

          <button
            onClick={() => setIsAddingPlant(true)}
            className="mb-6 hidden min-h-[420px] w-full break-inside-avoid flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-ink/20 bg-white/55 p-8 text-center shadow-soft transition hover:-translate-y-1 hover:border-ink/35 hover:bg-white/80 md:mb-8 md:inline-flex"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-4xl text-leaf-deep shadow-soft">+</div>
            <div>
              <p className="font-display text-3xl text-ink">Add another plant</p>
              <p className="mt-2 text-sm leading-6 text-ink/55 max-md:hidden">
                Upload your own photo or keep the built-in pixel illustration. No irrelevant stock shots.
              </p>
            </div>
          </button>
        </section>
      </main>

      <button
        onClick={() => setIsAddingPlant(true)}
        className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper/55 px-4 py-3 text-sm font-semibold text-ink shadow-soft backdrop-blur-md transition hover:bg-paper/75 md:hidden"
      >
        <Plus className="h-4 w-4" />
        Add plant
      </button>

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
