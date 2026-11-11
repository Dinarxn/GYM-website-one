export interface SiteConfig {
  name: string;
  tagline: string;
  shortDescription: string;
  address: string;
  phone: string;
  email: string;
  hours: {
    access: string;
    coaching: string;
    recovery: string;
  };
  whatsappNumber: string;
  demoMode: boolean;
  socials: {
    instagram: string;
    youtube: string;
    twitter: string;
  };
}

export const BRAND_COLORS = {
  black: '#000000',
  violet: '#7D39EB',
  lime: '#C6FF33',
  white: '#FFFFFF',
} as const;

export const siteConfig: SiteConfig = {
  name: 'IRONFORGE FITNESS',
  tagline: 'FORGE YOUR ULTIMATE PHYSIQUE',
  shortDescription:
    'An elite strength and conditioning sanctuary engineered with calibrated competition iron, biomechanical performance coaching, and contrast biohacking recovery suites.',
  address: '420 Titan Boulevard, Industrial District, New York, NY 10001',
  phone: '+1 (800) 476-6367',
  email: 'inquiries@ironforgefitness.com',
  hours: {
    access: '24/7/365 Biometric Keycard Access',
    coaching: 'Monday – Saturday: 06:00 – 22:00',
    recovery: 'Daily: 06:00 – 23:00',
  },
  whatsappNumber: '+18004766367',
  demoMode: true,
  socials: {
    instagram: 'https://instagram.com/ironforge_demo',
    youtube: 'https://youtube.com/@ironforge_demo',
    twitter: 'https://twitter.com/ironforge_demo',
  },
};
