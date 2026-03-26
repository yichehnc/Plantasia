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
  vibrancy: number; // 0.0 to 1.0
  lastWatered: string; // ISO date
  journal: JournalEntry[];
}

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
    image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=1000&auto=format&fit=crop', // Pencil cactus-ish
    vibrancy: 0.85,
    lastWatered: new Date().toISOString(),
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
    light: 'Indirect Bright',
    environmentalNeeds: {
      ventilation: true,
      shadeTolerant: false,
      brightIndirect: true,
    },
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=1000&auto=format&fit=crop', // Alocasia
    vibrancy: 0.4,
    lastWatered: new Date(Date.now() - 86400000 * 8).toISOString(), // 8 days ago
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
    image: 'https://images.unsplash.com/photo-1598880940080-ff9a29891b85?q=80&w=1000&auto=format&fit=crop', // Philodendron
    vibrancy: 0.9,
    lastWatered: new Date().toISOString(),
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
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=1000&auto=format&fit=crop', // Monstera
    vibrancy: 0.65,
    lastWatered: new Date(Date.now() - 86400000 * 5).toISOString(),
    journal: [
      {
        id: 'j2',
        date: '2024-02-01',
        note: 'Repotted into a larger terracotta pot with chunky soil mix.',
        tags: ['Repotted']
      }
    ]
  }
];
