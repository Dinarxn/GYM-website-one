# Scope: Milestone 1 — Foundation, Content & UI Systems

## Architecture
- **Framework & Foundation**: Next.js 15 App Router (`src/app`), React 19, TypeScript strict mode (`tsconfig.json`), Tailwind CSS v4 (`@tailwindcss/postcss`) with CSS-first `@theme` in `src/app/globals.css`.
- **Exact Brand Palette**:
  - `#000000` Deep Obsidian (Base surfaces, body background)
  - `#7D39EB` Electric Violet (Secondary accents, borders, atmospheric depth)
  - `#C6FF33` Acid Lime (Primary CTA, focus rings, highlights, 16.5:1 contrast)
  - `#FFFFFF` Crisp White (Headings, primary copy, 21:1 contrast)
- **UI Components & Layout**:
  - `src/components/ui/`: `Button.tsx`, `Badge.tsx`, `TiltCard.tsx`, `LightboxModal.tsx`, `SectionHeader.tsx`
  - `src/components/navigation/`: `Navbar.tsx`, `NavLinks.tsx`, `MobileDrawer.tsx`
  - `src/components/forms/`: `ContactForm.tsx`, `WhatsAppButton.tsx`
  - `src/components/sections/`:
    - `HeroOverlay.tsx` (semantic copy, stats, CTAs with `overflow-hidden` container clipping)
    - `ProgramsSection.tsx` (4 disciplines, syllabus modal with Escape listener & body scroll lock)
    - `AboutSection.tsx` (asymmetrical bento grid)
    - `TrainersSection.tsx` (3 trainer profiles with 3D tilt cards)
    - `EquipmentSectionOverlay.tsx` (narrative text ready for 3D showcase in M3)
    - `MembershipSection.tsx` (Starter, Pro, Elite tiered cards + comparison matrix + monthly/annual toggle)
    - `GallerySection.tsx` (masonry layout, lazy loading, full-screen lightbox)
    - `TestimonialsSection.tsx` (3 marked fictional demo testimonials)
    - `FinalCtaSection.tsx` (cinematic conversion banner)
    - `Footer.tsx` (hours, demo notices, social placeholders)
  - `src/config/`: `site.ts`, `programs.ts`, `trainers.ts`, `membership.ts`, `gallery.ts`, `equipment.ts`
  - `src/lib/`: `utils.ts`, `webglSupport.ts`

## Feature Inventory (Milestone 1 Scope)
| # | Feature | Description | Milestone | Status |
|---|---------|-------------|-----------|--------|
| 1 | Framework Scaffolding & Design Tokens | Next.js 15, React 19, TypeScript strict mode, Tailwind CSS v4, 4-color theme tokens | M1 | DONE |
| 2 | Component Library & UI Primitives | Buttons, Badges, TiltCard, LightboxModal, SectionHeader | M1 | DONE |
| 3 | Floating Navbar & Mobile Drawer | Transparent glass navbar, scroll blur, ScrollSpy, mobile slide-out drawer, focus trap | M1 | DONE |
| 4 | Training Programs Section | 4 disciplines (Strength, HIIT, Personal, Functional), syllabus cards, detail modal | M1 | DONE |
| 5 | About the Gym Bento Grid | Asymmetrical grid: Equipment, Trainers, Facilities, Community | M1 | DONE |
| 6 | Trainers Section & 3D Tilt Cards | 3 trainer profiles, stats, tilt physics, reduced-motion fallback | M1 | DONE |
| 7 | Membership Experience | Starter, Pro, Elite cards, monthly/annual toggle, amenities comparison matrix | M1 | DONE |
| 8 | Gallery Experience | Masonry layout, lazy loading, full-screen accessible lightbox modal | M1 | DONE |
| 9 | Testimonials Section | 3 fictional demo testimonials with clear demo badge & rating | M1 | DONE |
| 10 | Final Conversion CTA & Footer | Cinematic banner, join/trial action, operating hours, demo disclaimer footer | M1 | DONE |
| 11 | Contact Form & WhatsApp Integration | 5-state validated enquiry form with demo mode notice, WhatsApp link builder | M1 | DONE |

## Iteration Subtasks
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Foundation, Content & UI Implementation | Complete package.json, config files, UI components, navigation, 7 sections, forms, and build verification | none | DONE |
| 2 | Quality Review (2 Reviewers) | Comprehensive code review, responsiveness, typography, accessibility, build verification | Subtask 1 | DONE (APPROVE) |
| 3 | Adversarial Challenge (2 Challengers) | Form validation edge cases, responsive layout testing, contrast ratio checks, interaction stress tests | Subtask 1 | DONE (APPROVE) |
| 4 | Forensic Integrity Audit | Static analysis, verification of genuine implementation, zero cheating/hardcoding | Subtask 1 | DONE (CLEAN) |
| 5 | Iteration 2 Gate Evaluation | Verification of all criteria: Build/Test pass, Reviewer APPROVE, Challenger APPROVE, Auditor CLEAN | Subtasks 2-4 | DONE (PASS) |
