import { generatePixelPlant } from '../utils/pixelPlant';

export interface JournalEntry {
  id: string;
  date: string;
  note: string;
  image?: string;
  tags: ('Repotted' | 'Fertilized' | 'Pest Treatment' | 'Pruned' | 'Watered' | 'Note')[];
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  status: 'Thriving' | 'Alive' | 'Needs Attention' | 'Dead';
  frequency: string; // e.g., "1/week", "2/week"
  waterAmount: string; // e.g., "600ml", "<300ml"
  notes: string;
  petFriendly: boolean;
  purchaseDate: string;
  repottedDate?: string;
  light: 'Direct Light' | 'Indirect Bright' | 'Moderate' | 'Low';
  environmentalNeeds: {
    ventilation: boolean;
    shadeTolerant: boolean;
    brightIndirect: boolean;
  };
  image: string;
  posterRatio?: number;
  vibrancy: number; // 0.0 to 1.0
  lastWatered: string; // ISO date
  journal: JournalEntry[];
}

const daysAgo = (days: number) => new Date(Date.now() - 86400000 * days).toISOString();

export const INITIAL_PLANTS: Plant[] = [
  {
    id: '1',
    name: 'Pencil Cactus',
    species: 'Euphorbia tirucalli',
    status: 'Thriving',
    frequency: '2/week',
    waterAmount: '<300ml',
    notes: 'Note: If stems break, the milky sap is a skin irritant. Handle with care.',
    petFriendly: false,
    purchaseDate: '2023-11-20',
    light: 'Direct Light',
    environmentalNeeds: {
      ventilation: true,
      shadeTolerant: true,
      brightIndirect: true,
    },
    image: generatePixelPlant('pencil-cactus'),
    posterRatio: 0.72,
    vibrancy: 0.85,
    lastWatered: daysAgo(1),
    journal: [
      {
        id: 'j1',
        date: '2023-11-20',
        note: 'Brought home from the nursery. Placed in south-facing window.',
        tags: ['Note']
      }
    ]
  },
  {
    id: '2',
    name: 'Alocasia Regal Shields',
    species: 'Alocasia reginula',
    status: 'Needs Attention',
    frequency: '1/week',
    waterAmount: '600ml',
    notes: 'Leaves will droop when thirsty. Mist frequently.',
    petFriendly: false,
    purchaseDate: '2023-12-15',
    repottedDate: '2024-02-01',
    light: 'Indirect Bright',
    environmentalNeeds: {
      ventilation: true,
      shadeTolerant: false,
      brightIndirect: true,
    },
    image: generatePixelPlant('alocasia-regal-shields'),
    posterRatio: 0.62,
    vibrancy: 0.4,
    lastWatered: daysAgo(8),
    journal: []
  },
  {
    id: '3',
    name: 'Philodendron Florida',
    species: 'Philodendron squamiferum',
    status: 'Thriving',
    frequency: '1/week',
    waterAmount: '500ml',
    notes: 'Climber. Needs a moss pole for best growth.',
    petFriendly: false,
    purchaseDate: '2024-01-10',
    light: 'Indirect Bright',
    environmentalNeeds: {
      ventilation: true,
      shadeTolerant: true,
      brightIndirect: true,
    },
    image: generatePixelPlant('philodendron-florida'),
    posterRatio: 0.86,
    vibrancy: 0.9,
    lastWatered: daysAgo(0),
    journal: []
  },
  {
    id: '4',
    name: 'Monstera Deliciosa',
    species: 'Monstera deliciosa',
    status: 'Alive',
    frequency: '1/week',
    waterAmount: '1000ml',
    notes: 'Wipe leaves to remove dust.',
    petFriendly: false,
    purchaseDate: '2023-08-05',
    repottedDate: '2024-02-01',
    light: 'Indirect Bright',
    environmentalNeeds: {
      ventilation: true,
      shadeTolerant: true,
      brightIndirect: true,
    },
    image: generatePixelPlant('monstera-deliciosa'),
    posterRatio: 0.7,
    vibrancy: 0.65,
    lastWatered: daysAgo(5),
    journal: [
      {
        id: 'j2',
        date: '2024-02-01',
        note: 'Repotted into a larger terracotta pot with chunky soil mix.',
        tags: ['Repotted']
      }
    ]
  },
  {
    id: '5',
    name: 'Elkhorn Fern A',
    species: 'Platycerium bifurcatum',
    status: 'Thriving',
    frequency: '1/week',
    waterAmount: '600ml',
    notes: 'Do not wipe off the furry scales. Likes humidity and regular misting.',
    petFriendly: false,
    purchaseDate: '2023-11-20',
    light: 'Moderate',
    environmentalNeeds: {
      ventilation: true,
      shadeTolerant: true,
      brightIndirect: true,
    },
    image: generatePixelPlant('elkhorn-fern-a'),
    posterRatio: 0.58,
    vibrancy: 0.78,
    lastWatered: daysAgo(3),
    journal: []
  },
  {
    id: '6',
    name: 'Philodendron Marble Queen',
    species: 'Epipremnum aureum',
    status: 'Thriving',
    frequency: '1/week',
    waterAmount: '600ml',
    notes: 'Bright indirect light keeps the variegation crisp.',
    petFriendly: false,
    purchaseDate: '2023-11-16',
    light: 'Indirect Bright',
    environmentalNeeds: {
      ventilation: true,
      shadeTolerant: true,
      brightIndirect: true,
    },
    image: generatePixelPlant('philodendron-marble-queen'),
    posterRatio: 0.75,
    vibrancy: 0.88,
    lastWatered: daysAgo(2),
    journal: []
  },
  {
    id: '7',
    name: "Devil's Ivy 300mm",
    species: 'Epipremnum aureum',
    status: 'Thriving',
    frequency: '1/week',
    waterAmount: '1.2L',
    notes: 'A reliable climber and trailing plant. Rotate for even growth.',
    petFriendly: false,
    purchaseDate: '2023-12-04',
    light: 'Indirect Bright',
    environmentalNeeds: {
      ventilation: true,
      shadeTolerant: true,
      brightIndirect: true,
    },
    image: generatePixelPlant('devils-ivy-300mm'),
    posterRatio: 0.66,
    vibrancy: 0.92,
    lastWatered: daysAgo(4),
    journal: []
  },
  {
    id: '8',
    name: 'Syngonium Panda',
    species: 'Syngonium podophyllum',
    status: 'Alive',
    frequency: '1/week',
    waterAmount: '600ml',
    notes: 'Propagated cutting. Keep soil lightly moist while roots settle.',
    petFriendly: false,
    purchaseDate: '2023-12-04',
    light: 'Indirect Bright',
    environmentalNeeds: {
      ventilation: true,
      shadeTolerant: true,
      brightIndirect: true,
    },
    image: generatePixelPlant('syngonium-panda'),
    posterRatio: 0.9,
    vibrancy: 0.62,
    lastWatered: daysAgo(6),
    journal: []
  },
  {
    id: '9',
    name: 'Philodendron Fuzzy Petiole',
    species: 'Philodendron nangaritense',
    status: 'Needs Attention',
    frequency: '1/week',
    waterAmount: '600ml',
    notes: 'Under watch. Check petioles and undersides of leaves before watering.',
    petFriendly: false,
    purchaseDate: '2024-01-14',
    light: 'Indirect Bright',
    environmentalNeeds: {
      ventilation: true,
      shadeTolerant: true,
      brightIndirect: true,
    },
    image: generatePixelPlant('philodendron-fuzzy-petiole'),
    posterRatio: 0.6,
    vibrancy: 0.48,
    lastWatered: daysAgo(9),
    journal: []
  },
  {
    id: '10',
    name: 'Philodendron Mican',
    species: 'Philodendron hederaceum',
    status: 'Alive',
    frequency: '1/week',
    waterAmount: '<300ml',
    notes: 'Velvet leaves prefer indirect light and a gentle watering hand.',
    petFriendly: false,
    purchaseDate: '2024-01-20',
    light: 'Indirect Bright',
    environmentalNeeds: {
      ventilation: true,
      shadeTolerant: true,
      brightIndirect: true,
    },
    image: generatePixelPlant('philodendron-mican'),
    posterRatio: 0.8,
    vibrancy: 0.56,
    lastWatered: daysAgo(5),
    journal: []
  },
  {
    id: '11',
    name: 'Air Plants A B C D E',
    species: 'Tillandsia',
    status: 'Alive',
    frequency: '1/week',
    waterAmount: 'Bath',
    notes: 'Submerge for 3 hours, then shake upside down so water does not pool at the base.',
    petFriendly: false,
    purchaseDate: '2024-02-02',
    light: 'Direct Light',
    environmentalNeeds: {
      ventilation: true,
      shadeTolerant: false,
      brightIndirect: true,
    },
    image: generatePixelPlant('air-plants'),
    posterRatio: 0.68,
    vibrancy: 0.74,
    lastWatered: daysAgo(7),
    journal: []
  }
];
