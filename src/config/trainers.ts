export interface TrainerProfile {
  id: string;
  name: string;
  moniker: string;
  role: string;
  bio: string;
  quote: string;
  certifications: string[];
  specialties: string[];
  stats: {
    experience: string;
    athletesCoached: string;
    specialtyMetric: string;
    metricLabel: string;
  };
  imageUrl: string;
}

export const trainersData: TrainerProfile[] = [
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    moniker: 'Vanguard',
    role: 'Head Strength Coach & Powerlifting Director',
    bio: 'Former national competitive powerlifter with over 14 years developing collegiate and national barbell champions. Specializes in force vector biomechanics, CNS fatigue management, and technical mastery of the squat, bench, and deadlift.',
    quote: 'Form is non-negotiable. Iron reveals every compromise you make in secret.',
    certifications: ['CSCS (NSCA)', 'USAW Level 2 Senior Coach', 'FMS Level 2 Certified'],
    specialties: ['Maximal Force Production', 'Barbell Mechanics', 'CNS Periodization', 'Rehab-to-Platform Coaching'],
    stats: {
      experience: '14+ Yrs',
      athletesCoached: '450+',
      specialtyMetric: '805 LBS',
      metricLabel: 'Competition Deadlift PR',
    },
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'elena-rostova',
    name: 'Dr. Elena Rostova',
    moniker: 'Apex',
    role: 'Director of Functional Athletics & Mobility',
    bio: 'Doctor of Physical Therapy and former Olympic weightlifting contender. Elena bridges the critical gap between intense structural loading and lifetime orthopedic longevity, ensuring members lift heavy without chronic joint breakdown.',
    quote: 'True strength moves seamlessly through every degree of human freedom.',
    certifications: ['DPT (Doctor of Physical Therapy)', 'CSCS', 'Olympic Weightlifting Specialist', 'FRCms'],
    specialties: ['Joint Capsule Health', 'Olympic Snatch & Clean', 'Rotator Cuff Pre-Hab', 'Spinal Decompression'],
    stats: {
      experience: '11+ Yrs',
      athletesCoached: '380+',
      specialtyMetric: '100%',
      metricLabel: 'Injury Prevention Rate',
    },
    imageUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'jaxson-reed',
    name: 'Jaxson Reed',
    moniker: 'Forge',
    role: 'Head of Metabolic Conditioning & Anaerobic Systems',
    bio: 'Former military physical training instructor and elite hybrid athlete. Jaxson architects the lactate buffering, assault bike, and sled conditioning protocols that give IRONFORGE athletes an inexhaustible anaerobic engine.',
    quote: 'The mind negotiates long before the lungs give out. We train the mind first.',
    certifications: ['NASM-PES', 'CrossFit Level 3', 'Kettlebell Athletics Master', 'Heart-Rate Telemetry Specialist'],
    specialties: ['Lactate Threshold Buffering', 'VO2 Max Optimization', 'Hybrid Endurance', 'Mental Fortitude'],
    stats: {
      experience: '9+ Yrs',
      athletesCoached: '600+',
      specialtyMetric: '68 mL',
      metricLabel: 'VO2 Max Conditioning Record',
    },
    imageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1200&auto=format&fit=crop',
  },
];
