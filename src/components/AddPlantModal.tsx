import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Upload } from 'lucide-react';
import { Plant } from '../data/plants';
import { generatePixelPlant } from '../utils/pixelPlant';

interface AddPlantModalProps {
  onClose: () => void;
  onAdd: (plant: Plant) => void;
}

export function AddPlantModal({ onClose, onAdd }: AddPlantModalProps) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const canSubmit = name.trim().length > 0;
  const previewImage = image || generatePixelPlant(name.trim() || 'new plant');

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
        setError(null);
      }
    };
    reader.onerror = () => setError('Could not read that image file.');
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    const plant: Plant = {
      id: `plant-${Date.now()}`,
      name: name.trim(),
      species: species.trim() || 'Botanical companion',
      status: 'Alive',
      frequency: '1/week',
      waterAmount: '600ml',
      notes: 'Newly added to the living archive.',
      petFriendly: false,
      purchaseDate: new Date().toISOString().slice(0, 10),
      light: 'Indirect Bright',
      environmentalNeeds: {
        ventilation: true,
        shadeTolerant: true,
        brightIndirect: true,
      },
      image: image || generatePixelPlant(name.trim()),
      posterRatio: 0.72,
      vibrancy: 0.7,
      lastWatered: new Date().toISOString(),
      journal: [],
    };

    onAdd(plant);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-paper"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-paper p-6">
        <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-ink/5">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-ink/50">
          Plant image
        </p>
        <span className="h-10 w-10" />
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-89px)] max-w-6xl gap-10 px-6 py-10 md:grid-cols-[0.9fr_1.1fr] md:items-center md:px-10">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden bg-white/60 shadow-[0_30px_80px_rgba(26,26,26,0.12)]">
          <img
            src={previewImage}
            alt={name || 'Plant image preview'}
            className="h-full w-full object-cover mix-blend-multiply"
            style={{ imageRendering: image ? 'auto' : 'pixelated' }}
          />
          {!image && (
            <div className="absolute inset-x-6 bottom-6 bg-paper/85 p-3 text-center backdrop-blur">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink/55">
                Pixel placeholder until you upload
              </p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-green-vibrant">
              Add a plant
            </p>
            <h2 className="font-serif text-5xl italic leading-none md:text-7xl">
              Keep the pixel study or upload your own plant photo.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-ink/60 md:text-base">
              Plantasia stays image-relevant by default: generated placeholders for quick setup, or your own real plant shots when you have them.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.24em] text-ink/50">
                Plant name
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Philodendron Florida"
                className="w-full rounded-none border-0 border-b-2 border-ink/20 bg-transparent px-0 py-4 font-serif text-3xl outline-none transition-colors placeholder:text-ink/25 focus:border-green-vibrant"
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.24em] text-ink/50">
                Species optional
              </span>
              <input
                value={species}
                onChange={(event) => setSpecies(event.target.value)}
                placeholder="e.g. Philodendron squamiferum"
                className="w-full rounded-none border-0 border-b border-ink/15 bg-transparent px-0 py-3 font-serif text-2xl italic outline-none transition-colors placeholder:text-ink/25 focus:border-ink/50"
              />
            </label>
          </div>

          {error && (
            <p className="border-l-4 border-yellow-500 bg-yellow-50 p-4 text-sm leading-relaxed text-yellow-900">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-ink/20 px-6 font-mono text-xs font-bold uppercase tracking-[0.18em] transition-all hover:border-ink hover:bg-ink/5">
              <Upload className="h-4 w-4" />
              Upload photo
              <input type="file" accept="image/*" onChange={handleUpload} className="sr-only" />
            </label>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-green-vibrant px-6 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Sparkles className="h-4 w-4" />
              Add to archive
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
