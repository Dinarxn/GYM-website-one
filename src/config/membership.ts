export interface MembershipPlan {
  id: 'starter' | 'pro' | 'elite';
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnualMonthly: number; // monthly rate when billed annually (e.g. 20% discount)
  popular: boolean;
  accentBorder: 'default' | 'lime' | 'violet';
  badgeText?: string;
  description: string;
  features: string[];
  ctaLabel: string;
}

export interface AmenityMatrixRow {
  category: string;
  feature: string;
  starter: boolean | string;
  pro: boolean | string;
  elite: boolean | string;
}

export const membershipPlans: MembershipPlan[] = [
  {
    id: 'starter',
    name: 'Starter Iron',
    tagline: 'Foundational Barbell & Conditioning Access',
    priceMonthly: 79,
    priceAnnualMonthly: 63,
    popular: false,
    accentBorder: 'default',
    description:
      'Perfect for disciplined lifters seeking access to high-caliber iron platforms and foundational conditioning zones.',
    features: [
      'Standard facility access (05:00 – 23:00)',
      'Access to calibrated competition barbells & platforms',
      'Locker room, private showers & cedar dry sauna',
      'IRONFORGE mobile performance tracking app',
      'Initial 45-min biomechanical fitness assessment',
    ],
    ctaLabel: 'Select Starter Plan',
  },
  {
    id: 'pro',
    name: 'Pro Athlete',
    tagline: '24/7 Biometric Access & Contrast Recovery',
    priceMonthly: 149,
    priceAnnualMonthly: 119,
    popular: true,
    accentBorder: 'lime',
    badgeText: 'MOST POPULAR',
    description:
      'The definitive choice for dedicated athletes requiring unlimited 24/7 access, full contrast recovery suites, and priority lifting stations.',
    features: [
      '24/7/365 Encrypted Biometric Keycard Access',
      'Full contrast therapy suite (Sub-zero plunge & infrared sauna)',
      'Bi-weekly coach performance check-in & telemetry audit',
      'Priority Olympic lifting platform reservation',
      '2 Guest passes per calendar month',
      '15% Member discount on IRONFORGE apparel & supplements',
    ],
    ctaLabel: 'Claim Pro Access',
  },
  {
    id: 'elite',
    name: 'Elite Mastery',
    tagline: 'VIP Dedicated Coaching & Private Recovery Lounge',
    priceMonthly: 249,
    priceAnnualMonthly: 199,
    popular: false,
    accentBorder: 'violet',
    badgeText: 'VIP PERFORMANCE',
    description:
      'The peak tier for uncompromising athletes. Includes dedicated monthly 1-on-1 coaching, personalized nutrition, and private locker privileges.',
    features: [
      'Everything included in Pro Athlete tier',
      '4 Monthly 1-on-1 personal coaching sessions (CSCS Coach)',
      'Bespoke periodized macro & nutrition protocol with weekly adjustments',
      'Permanent reserved private locker with daily laundry service',
      'Unlimited recovery suite access with Normatec compression gear',
      'Complimentary custom IRONFORGE competition training kit',
    ],
    ctaLabel: 'Request Elite Membership',
  },
];

export const amenityMatrix: AmenityMatrixRow[] = [
  { category: 'Access', feature: 'Standard Facility Hours (05:00 - 23:00)', starter: true, pro: true, elite: true },
  { category: 'Access', feature: '24/7/365 Biometric Keycard Access', starter: false, pro: true, elite: true },
  { category: 'Access', feature: 'Guest Passes per Month', starter: 'None', pro: '2 Passes', elite: 'Unlimited' },
  { category: 'Platforms', feature: 'Calibrated Steel Plates & Bars', starter: true, pro: true, elite: true },
  { category: 'Platforms', feature: 'Priority Lifting Platform Reservation', starter: false, pro: true, elite: true },
  { category: 'Platforms', feature: 'Velocity Based Training (VBT) Bar Sensors', starter: false, pro: true, elite: true },
  { category: 'Recovery', feature: 'Cedar Dry Sauna Access', starter: true, pro: true, elite: true },
  { category: 'Recovery', feature: 'Sub-Zero Cold Plunge Tubs (38°F)', starter: false, pro: true, elite: true },
  { category: 'Recovery', feature: 'Normatec Compression Boots & Hyperice', starter: false, pro: 'Add-on', elite: true },
  { category: 'Coaching', feature: 'Initial Biomechanical Movement Screen', starter: true, pro: true, elite: true },
  { category: 'Coaching', feature: 'Bi-Weekly Coach Progress Reviews', starter: false, pro: true, elite: true },
  { category: 'Coaching', feature: 'Dedicated 1-on-1 CSCS Sessions', starter: false, pro: false, elite: '4 / Month' },
  { category: 'Nutrition', feature: 'Personalized Macro & Meal Planning', starter: false, pro: false, elite: true },
  { category: 'Amenities', feature: 'Private Permanent Locker + Laundry', starter: false, pro: false, elite: true },
  { category: 'App', feature: 'IRONFORGE Mobile Analytics Suite', starter: true, pro: true, elite: true },
  { category: 'Gear', feature: 'Official Competition Training Kit', starter: false, pro: '15% Off', elite: 'Included Free' },
];
