# 🏋️‍♂️ IRONFORGE FITNESS — 3D Elite Strength Sanctuary

[![Next.js 15](https://img.shields.io/badge/Next.js-15.2.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r187-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://gsap.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/E2E_Tests-234_Passed-C6FF33?style=for-the-badge&labelColor=000000)](tests/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **"FORGE YOUR ULTIMATE PHYSIQUE"**  
> An elite strength and conditioning sanctuary engineered with calibrated competition iron, biomechanical performance coaching, and contrast biohacking recovery suites. Built with high-performance 3D WebGL experiences and modern web standards.

---

## 🌟 Overview

**IRONFORGE FITNESS** is an immersive, next-generation fitness web application combining real-time 3D graphics, cinematic scroll-driven camera choreography, and interactive athletic components. Designed for performance athletes, strength competitors, and modern fitness enthusiasts, the platform delivers a high-impact digital experience while maintaining strict accessibility, responsive mobile ergonomics, and graceful WebGL fallbacks.

Repository: [github.com/Dinarxn/GYM-website-one](https://github.com/Dinarxn/GYM-website-one)

---

## ⚡ Key Features

### 🌌 1. Immersive 3D WebGL Experience
- **Real-Time 3D Canvas:** Powered by `@react-three/fiber` and `@react-three/drei`.
- **Athletic Hero Figure & Environment:** Atmospheric industrial warehouse aesthetic with volumetric-feel spot lighting, dynamic dust particles, and reflective floor surfaces.
- **GSAP ScrollTrigger Camera Narrative:** 5-scene coordinated camera movement tracking user scroll depth across sections.
- **Hardware Fallback & Fault Tolerance:** Automatic WebGL capability detection (`webglSupport.ts`). Gracefully degrades to a high-resolution dark industrial hero aesthetic on low-spec hardware or upon `webglcontextlost` events.

### 🏋️ 2. Interactive Equipment Showcase
- **Competition-Grade Apparatus:** Interactive 3D showcases for calibrated barbells, dumbbells, and power racks.
- **Hotspot Inspection:** Clickable interactive markers revealing technical engineering specs, knurling details, and steel grade metrics.
- **Interactive OrbitControls:** Smooth inspection controls with touch and pointer rotation damping.

### 📋 3. Training Programs & Syllabus
- **4 Core Disciplines:**
  - **Powerlifting:** Calibrated IPF-spec squat, bench press, and deadlift periodization.
  - **Hypertrophy & Bodybuilding:** Biomechanical muscle hypertrophy and aesthetic sculpt engineering.
  - **Olympic Weightlifting:** Snatch and clean & jerk velocity and mobility training.
  - **Athletic Conditioning:** High-intensity metabolic conditioning and contrast recovery.
- **Category Filter Tabs & Intensity Indicators:** Dynamic filter tabs and interactive intensity bars.
- **Accessible Syllabus Modal:** Deep-dive modal window with keyboard trapping (`Escape` dismiss, backdrop click) and focus restoration.

### 🎴 4. 3D Tilt Coach Cards & Bento Grid
- **Interactive Coach Profiles:** Certified CSCS trainers featuring physics-based 3D tilt tracking cursor motion with specular sheen highlights.
- **Facility Bento Grid:** Asymmetric grid showcasing key facility pillars: 24/7 Biometric Access, Calibrated Steel, Sub-Zero Cryo & Infrared Contrast Suites, and Biomechanical Lab.

### 💳 5. Dynamic Membership Experience
- **Tiered Plans:** Starter, Pro (Most Popular), and Elite.
- **Billing Switcher:** Instant monthly vs. annual toggle with automated 20% discount calculation.
- **Interactive Amenities Matrix:** Full feature breakdown comparison across all tiers.
- **Seamless Lead Prefill:** Clicking any tier preselects and scrolls directly into the conversion form with visual focus cues.

### 🖼️ 6. Curated Facility Gallery
- **Masonry Grid Layout:** 8 curated high-resolution photography cards with category filtering (Equipment, Facility, Recovery, Athletes).
- **Interactive Lightbox:** Fullscreen image modal supporting keyboard arrows (`←` / `→`), swipe navigation, and ARIA modal accessibility.

### 💬 7. Lead Conversion & WhatsApp Pipeline
- **Smart Contact Form:** Real-time field validation, error clearing on typing, and instant submission simulation.
- **Automated WhatsApp Lead Generator:** Direct WhatsApp enquiry generator constructing personalized pre-filled text with selected membership tier and referral source.
- **Permanent Demo Transparency:** Clear badges indicating demo status with zero data harvesting.

### ♿ 8. Accessibility & Performance First
- **WCAG AAA Contrast Tokens:** High-contrast palette using Electric Lime (`#C6FF33`) and Electric Violet (`#7D39EB`) on Obsidian (`#000000`).
- **Reduced Motion Support:** Respects `prefers-reduced-motion: reduce` by replacing 3D camera sweeps with instant waypoint transitions and disabling tilt physics.
- **Keyboard Friendly:** Skip-to-content anchor, focus rings, and full modal/drawer keyboard containment.
- **Adaptive Resolution:** Automatic DPR clamping (`min(1.5, window.devicePixelRatio)`) for smooth 60fps performance on mobile screens.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Core Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) |
| **3D Rendering** | [Three.js r187](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei) |
| **Animations** | [GSAP 3.15](https://gsap.com/) & [@gsap/react](https://gsap.com/resources/react/) (ScrollTrigger) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), PostCSS, `tailwind-merge`, `clsx` |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Testing** | Node.js E2E Test Runner Harness (234 test cases across 4 tiers) |

---

## 📁 Project Structure

```text
GYM-website-one/
├── src/
│   ├── app/
│   │   ├── globals.css              # Tailwind v4 directives & brand color tokens
│   │   ├── layout.tsx               # Root layout, metadata, persistent 3D canvas mount
│   │   └── page.tsx                 # Unified landing page orchestrator
│   ├── components/
│   │   ├── canvas/                  # 3D WebGL Three.js Components
│   │   │   ├── DustParticles.tsx    # Ambient floating atmospheric particles
│   │   │   ├── FallbackHeroImage.tsx# Accessible non-WebGL fallback banner
│   │   │   ├── GymCanvas.tsx        # Main Canvas wrapper & dynamic SSR importer
│   │   │   ├── GymEnvironment.tsx   # Atmospheric lighting and studio environment
│   │   │   ├── GymFloor.tsx         # Textured floor with reflections
│   │   │   ├── HeroFigure.tsx       # Procedural athletic sculpture & geometry
│   │   │   └── WebGLDetector.tsx    # Context check & lifecycle failure listeners
│   │   ├── forms/
│   │   │   ├── ContactForm.tsx      # Interactive contact & lead form
│   │   │   └── WhatsAppButton.tsx   # Floating quick-action conversion badge
│   │   ├── navigation/
│   │   │   ├── Navbar.tsx           # Floating desktop pill navigation
│   │   │   ├── NavLinks.tsx         # ScrollSpy active navigation links
│   │   │   └── MobileDrawer.tsx     # Fullscreen mobile slide-out menu
│   │   ├── sections/                # Page Sections
│   │   │   ├── AboutSection.tsx     # Bento grid & key metric stats
│   │   │   ├── EquipmentSectionOverlay.tsx # 3D equipment interaction UI
│   │   │   ├── FinalCtaSection.tsx  # Bottom conversion CTA & lead form
│   │   │   ├── Footer.tsx           # Operational hours, social links, disclaimers
│   │   │   ├── GallerySection.tsx   # Curated photo gallery with category filter
│   │   │   ├── HeroOverlay.tsx      # Main typography & CTA triggers
│   │   │   ├── MembershipSection.tsx# Tiered plans & amenities comparison table
│   │   │   ├── ProgramsSection.tsx  # 4 disciplines & syllabus inspection
│   │   │   ├── TestimonialsSection.tsx # Social proof & demo athlete feedback
│   │   │   └── TrainersSection.tsx  # CSCS coach cards with 3D tilt
│   │   └── ui/                      # Reusable UI Primitives
│   │       ├── Badge.tsx            # Industrial tag pills
│   │       ├── Button.tsx           # Primary lime, secondary violet, outline styles
│   │       ├── LightboxModal.tsx    # Keyboard-accessible full-screen image viewer
│   │       ├── SectionHeader.tsx    # Eyebrow, uppercase title & subtitle combo
│   │       └── TiltCard.tsx         # 3D interactive pointer-tracking wrapper
│   ├── config/                      # Static Data & Content Configurations
│   │   ├── equipment.ts             # 3D apparatus definitions & specifications
│   │   ├── gallery.ts               # Facility image assets & categories
│   │   ├── membership.ts            # Pricing plans, features, and amenity matrix
│   │   ├── programs.ts              # Training program syllabus & weekly breakdowns
│   │   ├── site.ts                  # Site metadata, contacts, social links, colors
│   │   └── trainers.ts              # Coach bios, specialties, and achievements
│   └── lib/
│       ├── utils.ts                 # Class merger utility (`clsx` + `twMerge`)
│       └── webglSupport.ts          # WebGL 1/2 capability detection utilities
├── tests/                           # 4-Tier Automated E2E Test Suite
│   ├── helpers/                     # Assertions, DOM simulators, WebGL mocks
│   ├── tier1/                       # 20 feature-level unit verification suites
│   ├── tier2/                       # 20 boundary, extreme input & stress suites
│   ├── tier3/                       # Cross-feature interaction suites
│   ├── tier4/                       # 10 realistic end-to-end prospect journeys
│   └── runner.js                    # Autonomous test runner script
├── public/                          # Static assets & public images
├── next.config.ts                   # Next.js build configuration
├── tailwind.config.ts / postcss.config.mjs # Tailwind CSS configuration
├── tsconfig.json                    # Strict TypeScript configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.17.0 or higher (Node 20+ recommended)
- **npm**, **yarn**, or **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dinarxn/GYM-website-one.git
   cd GYM-website-one
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Start production server:**
   ```bash
   npm run start
   ```

---

## 🧪 Testing Suite

The repository includes a comprehensive, environment-agnostic **4-Tier E2E Testing Suite** consisting of **234 test cases** with zero third-party testing dependencies, ensuring high reliability across all functional requirements.

```bash
node tests/runner.js
```

### Coverage Breakdown

| Test Tier | Scope | Test Cases | Status |
|---|---|:---:|:---:|
| **Tier 1** | Feature Baseline Coverage (100% across all 20 features) | 100 | ✅ Passed |
| **Tier 2** | Boundaries, Extreme Viewports, Bad Inputs, Context Losses | 100 | ✅ Passed |
| **Tier 3** | Cross-Feature Workflows (ScrollSync, Form prefill, OrbitControls) | 24 | ✅ Passed |
| **Tier 4** | Real-World Prospect Journeys & Conversion Scenarios | 10 | ✅ Passed |
| **Total** | **All 4 Tiers Combined** | **234** | **100% Pass** |

---

## 🎨 Design System & Palette

Designed under a dark industrial cyberpunk aesthetic, optimizing contrast and visual hierarchy:

| Token | Hex | Role | Preview |
|---|---|---|:---:|
| **Deep Obsidian** | `#000000` | Background & Canvas Foundation | `⬛` |
| **Electric Lime** | `#C6FF33` | Primary Conversion CTAs, Accents & Badges | `🟩` |
| **Electric Violet** | `#7D39EB` | Secondary Highlights, Badges & Glows | `🟪` |
| **Pure White** | `#FFFFFF` | Primary Typography & High-Emphasis Headers | `⬜` |
| **Industrial Zinc** | `#27272A` | Sub-surfaces, Border Rings & Card Backdrops | `🔲` |

---

## 📱 Browser & Device Support

- **Desktop**: Chrome, Edge, Firefox, Safari, Brave (WebGL 2.0 / WebGL 1.0 accelerated)
- **Mobile & Tablet**: iOS Safari 15+, Chrome for Android, Samsung Internet
- **Low-Power / Legacy**: Automatic fallback to styled hero graphics if WebGL is unavailable or disabled.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free for personal and commercial usage.

---

<p align="center">
  Crafted with passion for athletic excellence & modern web engineering.<br />
  <strong>IRONFORGE FITNESS</strong> — <i>Engineered Without Compromise.</i>
</p>
