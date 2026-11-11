# Project: IRONFORGE FITNESS 3D Web Platform

## Architecture
- **Framework**: Next.js 15 App Router (`src/app`), React 19, TypeScript in strict mode.
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) with CSS-first `@theme` configuration using the exact 4-color brand system:
  - `#000000` Deep Obsidian (Base surfaces, canvas clear, rubber floor, shadow depth)
  - `#7D39EB` Electric Violet (Secondary accents, rim lights, ambient aura, atmospheric depth)
  - `#C6FF33` Acid Lime (Primary CTA, specular highlights, active indicators, focus rings, 16.5:1 contrast)
  - `#FFFFFF` Crisp White (Headings, primary copy, high-bay key spotlights, 21:1 contrast)
- **3D Pipeline**: Three.js `0.187.0`, `@react-three/fiber` `9.8.2` (React 19 native), `@react-three/drei` `10.7.9`.
  - Architecture: Single persistent fixed background Canvas (`fixed inset-0 pointer-events-none z-0`) dynamically loaded via Next.js `dynamic(..., { ssr: false })`.
  - Tone Mapping: `THREE.ACESFilmicToneMapping`, `toneMappingExposure: 1.1`, adaptive DPR (desktop `[1, 1.8]`, mobile `[1, 1.3]`).
  - WebGL Fallback: Bulletproof capability detection with zero-crash static hero graphic and layered CSS radial glows.
- **Animation & Storytelling**: GSAP `3.15.1`, `@gsap/react` `2.1.2`, ScrollTrigger.
  - Camera control: Decoupled architecture where ScrollTrigger updates normalized progress and R3F `useFrame` interpolates along a 5-scene Catmull-Rom spline.
  - Motion accessibility: `prefers-reduced-motion` media query disables aggressive camera lerping, switching to gentle lighting/fade transitions.
- **Interactive Equipment Showcase**:
  - 4 items: Olympic Barbell & Bumpers, Pro-Hex Dumbbell (32.5kg), Calibrated Competition Plates (25kg), Commercial Workout Bench.
  - Procedural 3D fallbacks + GLB support with 100% commercial license safety.
  - Drag-to-rotate via OrbitControls, harmonic levitation physics ($y = y_0 + A \cdot \sin(\omega t)$), dynamic specular tracking, and interactive hotspots.
- **Content & UX**:
  - 7 core sections: Programs, About Bento Grid, Trainers with 3D tilt cards, Membership tiered cards with comparison matrix, Lazy-loaded Gallery with modal, Testimonials with demo markers, Final CTA & Footer.
  - Floating transparent glass navbar with dynamic scroll blur, mobile slide-out drawer with focus trap.
  - Validated 5-state contact form with demo mode indicator, WhatsApp parameterized direct chat button.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Framework Scaffolding & Design Tokens | Next.js 15, React 19, TypeScript strict mode, Tailwind CSS v4, 4-color theme tokens | M1 | Survey 1, R5 |
| 2 | Component Library & UI Primitives | Buttons, Badges, TiltCard, LightboxModal, SectionHeader | M1 | Survey 3, R3 |
| 3 | Floating Navbar & Mobile Drawer | Transparent glass navbar, scroll blur, ScrollSpy, mobile slide-out drawer, focus trap | M1 | Survey 3, R4 |
| 4 | Training Programs Section | 4 disciplines (Strength, HIIT, Personal, Functional), syllabus cards, detail modal | M1 | Survey 3, R3 |
| 5 | About the Gym Bento Grid | Asymmetrical grid: Equipment, Trainers, Facilities, Community | M1 | Survey 3, R3 |
| 6 | Trainers Section & 3D Tilt Cards | 3 trainer profiles, stats, tilt physics, reduced-motion fallback | M1 | Survey 3, R3 |
| 7 | Membership Experience | Starter, Pro, Elite cards, monthly/annual toggle, amenities comparison matrix | M1 | Survey 3, R3 |
| 8 | Gallery Experience | Masonry layout, lazy loading, full-screen accessible lightbox modal | M1 | Survey 3, R3 |
| 9 | Testimonials Section | 3 fictional demo testimonials with clear demo badge & rating | M1 | Survey 3, R3 |
| 10 | Final Conversion CTA & Footer | Cinematic banner, join/trial action, operating hours, demo disclaimer footer | M1 | Survey 3, R3 |
| 11 | Contact Form & WhatsApp Integration | 5-state validated enquiry form with demo mode notice, WhatsApp link builder | M1 | Survey 3, R4 |
| 12 | 3D Canvas & WebGL Fallback Infrastructure | Persistent R3F Canvas, SSR-safe mounting, adaptive DPR, WebGL detection, static hero fallback | M2 | Survey 2, R1 |
| 13 | Dark Industrial Gym Environment & Lighting | 4-color lighting rig (#000000, #7D39EB, #C6FF33, #FFFFFF), rubber floor, chalk dust particles | M2 | Survey 2, R1 |
| 14 | 3D Athletic Hero Figure & Reveal | Power stance sculpt, dual rim lighting, cinematic reveal sequence, pointer parallax | M2 | Survey 2, R1 |
| 15 | GSAP ScrollTrigger 5-Scene Camera Narrative | 5 narrative scenes (Beginning, Strength, Performance, Discipline, Next Level), Catmull-Rom lerp | M3 | Survey 2, R2 |
| 16 | Interactive 3D Equipment Showcase | Barbell, Dumbbell, Plates, Bench, drag-to-rotate OrbitControls, harmonic levitation, hotspots | M3 | Survey 2, R2 |
| 17 | Motion Accessibility & Keyboard Navigation | `prefers-reduced-motion` camera locking, accessible keyboard section navigation | M3 | Survey 2, R2 |
| 18 | Mobile-First Performance & Layout Hardening | Zero horizontal overflow, touch gesture tuning, GPU memory disposal, DPR clamping | M4 | Survey 1,3, R5 |
| 19 | Production Build & Lint Verification | Clean `npm run build`, strict TypeScript type-checking, lint compliance | M4 | Survey 1, R5 |
| 20 | E2E Testing Suite & Coverage Verification | Pass 100% of E2E tests (Tiers 1-4) and Tier 5 adversarial hardening | M5 | R1-R5, Project Pattern |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Foundation, Content & UI Systems | Next.js 15, React 19, Tailwind v4, Design Tokens, Navigation, 7 Content Sections, Contact Form, WhatsApp, UI Primitives | none | DONE |
| M2 | 3D Industrial Gym Environment & Hero Experience | R3F Canvas, 4-color Lighting Rig, Industrial Floor, Dust Particles, 3D Athletic Hero Figure, Pointer Parallax, WebGL Fallback | M1 | IN_PROGRESS |
| M3 | Scroll-Driven 3D Storytelling & Equipment Showcase | GSAP ScrollTrigger 5-Scene Camera Narrative, Catmull-Rom spline, Interactive Equipment Showcase (Barbell, Dumbbell, Plates, Bench), Hotspots, Reduced Motion | M2 | PLANNED |
| M4 | Mobile-First Optimization & Performance Hardening | DPR clamping, touch controls, GPU memory deep disposal, zero overflow verification, production build (`npm run build`) | M3 | PLANNED |
| M5 | Final Milestone: E2E Test Suite 100% Pass & Adversarial Hardening | Phase 1: Pass 100% E2E tests (Tiers 1-4); Phase 2: Tier 5 adversarial coverage hardening | M4, TEST_READY.md | PLANNED |

## Parallel Track: E2E Testing Track
- **Owner**: E2E Testing Orchestrator
- **Scope**: Requirement-driven, opaque-box test suite (Tiers 1-4) covering all 20 inventoried features.
- **Output**: `TEST_INFRA.md` and `TEST_READY.md`.

## Interface Contracts
### Global Design Tokens & Theme Contract
```typescript
export const BRAND_COLORS = {
  black: '#000000',
  violet: '#7D39EB',
  lime: '#C6FF33',
  white: '#FFFFFF',
} as const;

export interface SiteConfig {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  whatsappNumber: string;
  demoMode: boolean;
}
```

### 3D Scene & Camera Narrative State Contract
```typescript
export type SceneId = 'beginning' | 'strength' | 'performance' | 'discipline' | 'next-level';

export interface CameraWaypoint {
  id: SceneId;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface EquipmentItem {
  id: 'barbell' | 'dumbbell' | 'plates' | 'bench';
  name: string;
  weight: string;
  material: string;
  specs: string[];
  features: string[];
}
```

### Form & State Contracts
```typescript
export interface ContactEnquiryData {
  name: string;
  phone: string;
  email: string;
  membershipInterest: 'starter' | 'pro' | 'elite' | 'personal-training';
  message: string;
}

export type FormStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'error';
```

## Code Layout
```
c:\Users\Admin\Desktop\GYM website 1/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── GymCanvas.tsx
│   │   │   ├── GymEnvironment.tsx
│   │   │   ├── HeroFigure.tsx
│   │   │   ├── CameraController.tsx
│   │   │   ├── EquipmentShowcase.tsx
│   │   │   ├── DustParticles.tsx
│   │   │   ├── FallbackHeroImage.tsx
│   │   │   └── WebGLDetector.tsx
│   │   ├── navigation/
│   │   │   ├── Navbar.tsx
│   │   │   ├── NavLinks.tsx
│   │   │   └── MobileDrawer.tsx
│   │   ├── sections/
│   │   │   ├── HeroOverlay.tsx
│   │   │   ├── ProgramsSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── TrainersSection.tsx
│   │   │   ├── EquipmentOverlay.tsx
│   │   │   ├── MembershipSection.tsx
│   │   │   ├── GallerySection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── FinalCtaSection.tsx
│   │   │   └── Footer.tsx
│   │   ├── forms/
│   │   │   ├── ContactForm.tsx
│   │   │   └── WhatsAppButton.tsx
│   │   └── ui/
│   │       ├── TiltCard.tsx
│   │       ├── LightboxModal.tsx
│   │       ├── SectionHeader.tsx
│   │       ├── Badge.tsx
│   │       └── Button.tsx
│   ├── config/
│   │   ├── site.ts
│   │   ├── programs.ts
│   │   ├── trainers.ts
│   │   ├── membership.ts
│   │   ├── gallery.ts
│   │   └── equipment.ts
│   └── lib/
│       ├── utils.ts
│       ├── cameraPath.ts
│       └── webglSupport.ts
├── public/
│   ├── images/
│   └── models/
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── README.md
```
