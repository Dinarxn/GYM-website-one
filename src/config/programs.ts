export interface ProgramSyllabusItem {
  phase: string;
  focus: string;
  details: string;
}

export interface ProgramItem {
  id: string;
  category: 'strength' | 'conditioning' | 'personal' | 'functional';
  categoryLabel: string;
  title: string;
  tagline: string;
  description: string;
  duration: string;
  intensity: number; // 1 to 5
  coachToMemberRatio: string;
  keyBenefits: string[];
  equipmentUsed: string[];
  syllabus: ProgramSyllabusItem[];
}

export const programsData: ProgramItem[] = [
  {
    id: 'strength-powerlifting',
    category: 'strength',
    categoryLabel: 'Heavy Strength',
    title: 'Strength & Powerlifting',
    tagline: 'Calibrated Iron. Maximal Force Production.',
    description:
      'Engineered for lifters demanding absolute strength progression. Focuses on the core barbell movements—squat, bench press, deadlift, and overhead press—using wave-loading periodization, calibrated steel plates, and specialized power cages.',
    duration: '75 Minutes / Session',
    intensity: 5,
    coachToMemberRatio: '1:6 Cap',
    keyBenefits: [
      'Progressive overload periodization tracking',
      'Competition Eleiko barbells and calibrated steel plates',
      'Velocity-based training (VBT) barbell sensors',
      'Biomechanical bar-path video review',
    ],
    equipmentUsed: ['Competition Power Cages', 'Eleiko 20kg Bars', 'Calibrated Steel Plates', 'Monolift Attachments'],
    syllabus: [
      {
        phase: 'Phase 1: Volume Accumulation (Weeks 1-4)',
        focus: 'Hypertrophic foundation & motor pattern refinement',
        details: 'High-volume compound clusters at 68-76% 1RM to build tendon density, work capacity, and positional control.',
      },
      {
        phase: 'Phase 2: Neural Intensification (Weeks 5-8)',
        focus: 'Central nervous system recruitment & rate of force development',
        details: 'Wave-loading sets at 80-88% 1RM utilizing dynamic accommodating resistance bands and deficit pulls.',
      },
      {
        phase: 'Phase 3: Peak Realization (Weeks 9-12)',
        focus: 'Maximal 1RM realization & mock meet calibration',
        details: 'Singles and doubles at 90-96% 1RM under strict competitive command standards, culminating in platform testing.',
      },
    ],
  },
  {
    id: 'hiit-conditioning',
    category: 'conditioning',
    categoryLabel: 'Metabolic Conditioning',
    title: 'HIIT & Conditioning',
    tagline: 'High-Velocity Anaerobic Power & Lactate Buffering.',
    description:
      'Relentless metabolic conditioning engineered to push VO2 max and anaerobic capacity. Blends Concept2 ergs, assault air bikes, weighted prowler pushes, and heavy kettlebell circuits in high-density intervals.',
    duration: '50 Minutes / Session',
    intensity: 4,
    coachToMemberRatio: '1:10 Cap',
    keyBenefits: [
      'Heart-rate zone telemetry on live monitors',
      'Elevated post-exercise oxygen consumption (EPOC)',
      'Zero-impact conditioning ergs protecting joints',
      'Rapid lactate tolerance conditioning',
    ],
    equipmentUsed: ['Concept2 RowErg & SkiErg', 'Echo Assault Bikes', 'Titan Prowler Sleds', 'Competition Kettlebells'],
    syllabus: [
      {
        phase: 'Module A: Aerobic Power & Cardiac Output',
        focus: 'Stroke volume enlargement & mitochondrial density',
        details: 'Extended 3-minute sub-threshold intervals across alternating ergs to elevate steady-state mitochondrial efficiency.',
      },
      {
        phase: 'Module B: Glycolytic Lactate Buffering',
        focus: 'Acidosis tolerance & rapid recovery capacity',
        details: '45-second maximum-effort sprints followed by 45-second recovery cycles targeting rapid blood lactate clearance.',
      },
      {
        phase: 'Module C: Alactic Sled & Prowler Intervals',
        focus: 'Explosive drive & ground-force power production',
        details: 'Full-load turf sled pushes with resisted sprint intervals to forge unbreakable mental and physiological endurance.',
      },
    ],
  },
  {
    id: 'personal-training',
    category: 'personal',
    categoryLabel: 'Bespoke Coaching',
    title: '1-on-1 Elite Personal Training',
    tagline: 'Tailored Periodization & Biomechanical Mastery.',
    description:
      'Complete individualized attention from master CSCS coaches. Includes 3D movement screen analysis, personalized periodization curves, custom nutrition architecture, and continuous biofeedback tracking.',
    duration: '60 Minutes / Session',
    intensity: 5,
    coachToMemberRatio: '1:1 Exclusive',
    keyBenefits: [
      'Comprehensive 3D gait and orthopedic assessment',
      'Bespoke periodized macro and micro-cycles',
      'Macro and micronutrient nutritional coaching',
      'Priority access to private training pods',
    ],
    equipmentUsed: ['Private Platinum Training Pods', 'Optojump Laser Mats', 'Force Plates', 'Isokinetic Dynamometers'],
    syllabus: [
      {
        phase: 'Stage 1: Biomechanical Audit & Baseline Screen',
        focus: 'Joint mobility, asymmetries, and structural integrity',
        details: 'Comprehensive orthopedic evaluation to isolate kinetic chain deficiencies and formulate custom pre-hab protocols.',
      },
      {
        phase: 'Stage 2: Custom Hypertrophy & Kinetic Optimization',
        focus: 'Targeted muscle recruitment & movement mastery',
        details: 'Laser-focused 1-on-1 coaching refining eccentric cadences, active range control, and neuromuscular firing.',
      },
      {
        phase: 'Stage 3: Advanced Periodization & Body Recomposition',
        focus: 'Elite physique transformation & functional performance',
        details: 'Continuous DEXA scan cross-referencing with tailored training adjustments for maximal lean tissue development.',
      },
    ],
  },
  {
    id: 'functional-fitness',
    category: 'functional',
    categoryLabel: 'Athletic Movement',
    title: 'Functional Fitness & Mobility',
    tagline: 'Multi-Planar Strength, Joint Longevity & Core Armor.',
    description:
      'Bridge the gap between raw barbell power and fluid real-world athletic movement. Integrates Olympic ring drills, sandbag carries, rotational core work, and decompression mobility flows for bulletproof joint longevity.',
    duration: '60 Minutes / Session',
    intensity: 4,
    coachToMemberRatio: '1:8 Cap',
    keyBenefits: [
      'Enhanced multi-planar rotary power and agility',
      'Shoulder and hip joint decompression protocols',
      'Uncompromising core stiffness and spinal stabilization',
      'Active active-recovery contrast session synergy',
    ],
    equipmentUsed: ['Gymnastic Rings', 'Heavy Sandbags', 'Turkish Get-Up Bells', 'Turf Sprint Lanes'],
    syllabus: [
      {
        phase: 'Block 1: Scapular & Pelvic Stabilization',
        focus: 'Rotator cuff, serratus anterior, and deep pelvic floor control',
        details: 'Suspension gymnastic ring stability holds, band dislocates, and Copenhagen adductor planks for resilient joints.',
      },
      {
        phase: 'Block 2: Asymmetrical & Offset Loading',
        focus: 'Anti-rotational core stiffness & real-world grip tenacity',
        details: 'Heavy farmer carries, suitcase deadlifts, and offset sandbag cleans to bulletproof against torsional spinal shearing.',
      },
      {
        phase: 'Block 3: Tri-Planar Dynamic Velocity',
        focus: 'Deceleration mechanics & multidirectional agility',
        details: 'Rotational medicine ball slams, turf lateral bounds, and deceleration drops for athletic poise under unpredictable torque.',
      },
    ],
  },
];
