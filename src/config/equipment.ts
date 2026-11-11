export interface EquipmentItem {
  id: 'barbell' | 'dumbbell' | 'plates' | 'bench';
  name: string;
  category: string;
  weight: string;
  material: string;
  dimensions: string;
  specs: string[];
  features: string[];
  interactiveDescription: string;
}

export const equipmentData: EquipmentItem[] = [
  {
    id: 'barbell',
    name: 'Competition Olympic Barbell',
    category: 'Free Weights',
    weight: '20.0 kg / 44.1 lbs',
    material: 'Swedish Tensile Steel (215,000 PSI) & Hard Chrome Sleeve',
    dimensions: '2200 mm length · 28 mm shaft diameter',
    specs: [
      '215,000 PSI tensile strength rated to 1,500 kg',
      'Aggressive 1.2 mm volcanic knurl pattern with dual powerlifting marks',
      'Precision needle bearings with zero-play spin rotation',
      'Anti-corrosion matte chrome finish engineered for extreme chalk adhesion',
    ],
    features: [
      'Competition calibrated to ±10 grams tolerance',
      'Engineered shaft whip optimized for maximal deadlift & clean mechanics',
      'Hardened steel sleeves prevent grooving under cast iron collars',
    ],
    interactiveDescription:
      'The crown jewel of IRONFORGE. Machined from ultra-high tensile Swedish steel with precision needle bearings, delivering smooth kinetic rotation on explosive Olympic pulls and zero bend under 800+ lb squats.',
  },
  {
    id: 'dumbbell',
    name: 'Pro-Hex Urethane Dumbbell',
    category: 'Free Weights',
    weight: '32.5 kg / 71.6 lbs (5 – 150 lbs Series)',
    material: 'Solid Steel Core with Molded High-Density CPU Urethane',
    dimensions: '360 mm length · 185 mm head diameter',
    specs: [
      'High-grade solid steel core friction-welded into single-piece head',
      '35 mm contoured ergonomic knurled stainless steel handle',
      'Non-marking German Cast Polyurethane (CPU) exterior',
      'Precision bevelled anti-roll hexagonal geometric heads',
    ],
    features: [
      'Drop-tested over 20,000 repetitions without weld compromise',
      'Ultra-dense CPU urethane eliminates noxious rubber odor and floor damage',
      'Laser-engraved metric and imperial weight callouts with Lime accent',
    ],
    interactiveDescription:
      'Engineered for indestructible unilateral loading. The solid steel core is permanently welded to anti-roll hexagonal heads coated in high-density German urethane that absorbs impact while preserving platform integrity.',
  },
  {
    id: 'plates',
    name: 'Calibrated Competition Steel Plates',
    category: 'Weight Plates',
    weight: '25.0 kg / 55.1 lbs (Red Competition Standard)',
    material: 'Cast Iron Plate with Precision Machined Center Stainless Hub',
    dimensions: '450 mm diameter · 27 mm ultra-slim profile',
    specs: [
      'Calibrated to within ±10 grams of official IPF competition standard',
      'Ultra-slim 27 mm profile allowing up to 700 kg load capacity on a standard bar',
      'Machined 50.4 mm center hole ensures snug fit on Olympic sleeves',
      'Electrostatic powder-coat finish with raised crisp white lettering',
    ],
    features: [
      'Official IPF color-coded perimeter identification band',
      'Deep perimeter grip lip for secure one-handed loading and handling',
      'Zero bounce formulation designed for structural platform longevity',
    ],
    interactiveDescription:
      'Thin, dense, and unforgiving. These competition-grade cast iron discs are machined to exact IPF tolerances with an ultra-slim 27 mm profile that enables lifters to load upwards of 1,500 lbs on a single barbell.',
  },
  {
    id: 'bench',
    name: 'Commercial Adjustable Incline Bench',
    category: 'Benches & Racks',
    weight: '62.0 kg / 136.7 lbs',
    material: '11-Gauge 3x3" Structural Steel & High-Density Bonded Foam',
    dimensions: '1420 mm length · 520 mm width · 450 mm flat height',
    specs: [
      'Heavy 11-gauge 75x75 mm laser-cut boxed steel frame',
      'Ladder adjustment system with 7 back positions (-15° decline to 85° incline)',
      '3 Independent seat angle adjustments with zero hinge play',
      'High-friction textured vinyl upholstery resistant to moisture and tears',
    ],
    features: [
      'Integrated heavy-duty transport wheels and knurled front handle',
      'Generous 300 mm back pad width for maximal scapular foundation during heavy presses',
      'Tested to an extraordinary static weight load capacity of 1,200 kg',
    ],
    interactiveDescription:
      'A rock-solid structural foundation for pressing. Constructed from laser-cut 11-gauge steel, offering zero wobble at any angle from -15° decline to 85° incline, complemented by high-friction non-slip vinyl upholstery.',
  },
];
