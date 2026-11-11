export interface GalleryItem {
  id: string;
  title: string;
  category: 'strength' | 'cardio' | 'recovery' | 'community';
  categoryLabel: string;
  imageUrl: string;
  aspectRatio: 'square' | 'portrait' | 'landscape';
  description: string;
  alt: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'gallery-1',
    title: 'Calibrated Competition Platforms',
    category: 'strength',
    categoryLabel: 'Heavy Strength',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    aspectRatio: 'landscape',
    description: 'Custom hardwood inset platforms with Eleiko competition bars and calibrated cast steel plates.',
    alt: 'Barbell loaded with heavy steel plates on competition lifting platform at IRONFORGE FITNESS',
  },
  {
    id: 'gallery-2',
    title: 'Focus Under Heavy Load',
    category: 'strength',
    categoryLabel: 'Heavy Strength',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    aspectRatio: 'portrait',
    description: 'Athlete locking out a heavy deadlift attempt in the high-bay industrial lifting hall.',
    alt: 'Powerlifter deadlifting in dark gym environment with chalk cloud and violet rim lighting',
  },
  {
    id: 'gallery-3',
    title: 'Anaerobic Erg Conditioning Line',
    category: 'cardio',
    categoryLabel: 'Cardio & Turf',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop',
    aspectRatio: 'landscape',
    description: 'Concept2 RowErgs and SkiErgs lined up for high-intensity interval intervals.',
    alt: 'Athletes rowing on Concept2 machines during conditioning workout',
  },
  {
    id: 'gallery-4',
    title: 'Custom Machined Dumbbell Arsenal',
    category: 'strength',
    categoryLabel: 'Heavy Strength',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop',
    aspectRatio: 'portrait',
    description: 'Precision urethane dumbbells ranging from 5 lbs to 150 lbs on tiered heavy-gauge steel racks.',
    alt: 'Rack of heavy chrome and black dumbbells in dark industrial fitness club',
  },
  {
    id: 'gallery-5',
    title: 'Contrast Therapy Cold Plunge Suite',
    category: 'recovery',
    categoryLabel: 'Biohacking & Recovery',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1200&auto=format&fit=crop',
    aspectRatio: 'landscape',
    description: 'Sub-zero stainless steel immersion cold plunge tubs chilled precisely to 38°F.',
    alt: 'Athlete recovering in contrast cold plunge bath after intense weight training',
  },
  {
    id: 'gallery-6',
    title: 'High-Velocity Sled Sprints',
    category: 'cardio',
    categoryLabel: 'Cardio & Turf',
    imageUrl: 'https://images.unsplash.com/photo-1434596922112-19c563067271?q=80&w=1200&auto=format&fit=crop',
    aspectRatio: 'portrait',
    description: 'Prowler sled pushes on the 40-meter indoor high-density synthetic sprint turf.',
    alt: 'Athlete pushing heavy weighted sled along green indoor turf lane',
  },
  {
    id: 'gallery-7',
    title: 'Finnish Cedar Infrared Sauna',
    category: 'recovery',
    categoryLabel: 'Biohacking & Recovery',
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop',
    aspectRatio: 'landscape',
    description: 'Aromatic red cedar dry sauna heated to 195°F for deep cellular heat-shock protein activation.',
    alt: 'Dimly lit traditional wooden sauna with glowing atmospheric ambient lighting',
  },
  {
    id: 'gallery-8',
    title: 'Iron Brotherhood & Accountability',
    category: 'community',
    categoryLabel: 'Iron Community',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop',
    aspectRatio: 'landscape',
    description: 'Members collaborating and celebrating personal record breakthroughs on the platform.',
    alt: 'Group of fitness athletes encouraging each other after completing heavy barbell workout',
  },
];
