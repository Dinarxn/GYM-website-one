# Dispatch: Sub-Orchestrator — Milestone 1 (Foundation, Content & UI Systems)

## Mission
Orchestrate Milestone 1: Foundation, Content & UI Systems for IRONFORGE FITNESS.
Decompose into workers or run the standard Explorer -> Worker -> Reviewer -> Challenger -> Auditor gate loop.

## Inputs
- `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\ORIGINAL_REQUEST.md`
- `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\PROJECT.md`
- Survey Reports:
  - `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\explorer_survey_1\handoff.md` (Codebase & package versions: Next.js 15, React 19, Tailwind v4, Drei v10, R3F v9)
  - `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\explorer_survey_3\handoff.md` (Component hierarchy, 7 sections, contact form, WhatsApp button)
- Your State Folder: `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\sub_orch_m1`
- Working Directory: `c:\Users\Admin\Desktop\GYM website 1`

## Scope of Milestone 1
1. Project Scaffolding & Config:
   - `package.json` with Next.js 15, React 19, Three.js 0.187, @react-three/fiber 9.8.2, @react-three/drei 10.7.9, gsap 3.15.1, @gsap/react 2.1.2, tailwindcss 4.3.5, @tailwindcss/postcss, lucide-react 1.72.0.
   - `tsconfig.json` (strict mode, path alias `@/*`).
   - `next.config.ts`, `postcss.config.mjs`, `src/app/globals.css` with `@theme` brand tokens (#000000, #7D39EB, #C6FF33, #FFFFFF).
2. UI Primitives & Layout:
   - `src/app/layout.tsx` (dark theme root, fonts, metadata).
   - UI Primitives: `Button`, `Badge`, `TiltCard`, `LightboxModal`, `SectionHeader`.
   - Floating Navbar with dynamic scroll blur, smooth anchor links, mobile drawer menu with focus trap.
3. 7 Core Content Sections:
   - Training Programs (Strength Training, HIIT & Conditioning, Personal Training, Functional Fitness) with syllabus modal.
   - About the Gym (asymmetrical bento grid: equipment, trainers, facilities, community).
   - Trainers (3 demo profiles with 3D tilt cards).
   - Membership Experience (Starter, Pro, Elite tiered cards + comparison matrix + monthly/annual toggle).
   - Gallery Experience (responsive masonry, lazy loading, full-screen lightbox).
   - Testimonials (3 marked fictional demo testimonials).
   - Final CTA (cinematic conversion banner, direct action).
   - Comprehensive Footer with business hours, legal demo notices.
4. Validated Contact System & WhatsApp:
   - Contact enquiry form (name, phone, email, membership interest, message) with loading, success, error, and demo mode indicator.
   - Configurable WhatsApp enquiry link.
5. Verification:
   - Clean production build (`npm run build`), strict TypeScript type-checking (`npx tsc --noEmit`), zero lint errors.
   - Forensic integrity audit must pass CLEAN.

## Gate Requirement
Execute Explorer -> Worker -> Reviewers (2) -> Challengers (2) -> Forensic Auditor (`teamwork_auditor`).
Evaluate Auditor verdict first (binary veto). Once all pass, publish handoff and signal completion.


## 2026-11-11T08:09:32Z
You are the Sub-Orchestrator for Milestone 1 (Foundation, Content & UI Systems) for IRONFORGE FITNESS.

MANDATORY INPUTS:
- Original Request: c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\ORIGINAL_REQUEST.md
- Project Scope: c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\PROJECT.md
- Dispatch: c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\sub_orch_m1\DISPATCH.md
- State Folder: c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\sub_orch_m1
- Working Directory: c:\Users\Admin\Desktop\GYM website 1
- Prior Survey Reports:
  * c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\explorer_survey_1\handoff.md
  * c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\explorer_survey_3\handoff.md

YOUR RESPONSIBILITIES:
1. Initialize your BRIEFING.md and progress.md. Create your SCOPE.md.
2. Execute Milestone 1 following the iteration loop:
   - Spawn Explorers / Spec Miners if further analysis is needed, or directly spawn Workers with explicit file ownership.
   - Worker implements:
     * `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `src/app/globals.css` with exact brand tokens (#000000, #7D39EB, #C6FF33, #FFFFFF).
     * Install dependencies cleanly (`npm install`).
     * `src/app/layout.tsx`, `src/app/page.tsx`.
     * Config files (`site.ts`, `programs.ts`, `trainers.ts`, `membership.ts`, `gallery.ts`, `equipment.ts`).
     * UI components (`Button`, `Badge`, `TiltCard`, `LightboxModal`, `SectionHeader`).
     * Floating Navbar, NavLinks, MobileDrawer.
     * All 7 Content Sections: Programs, About Bento Grid, Trainers, Membership tiered cards, Gallery, Testimonials, Final CTA, and Footer.
     * Validated Contact Form (5 states, demo mode notice) and WhatsApp enquiry button.
     * Ensure the build runs cleanly with `npm run build` and `npx tsc --noEmit`.
   - INCLUDE MANDATORY INTEGRITY WARNING in Worker dispatch:
     "DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected."
   - Review: Spawn 2 Reviewers (`teamwork_reviewer`) to objectively review and verify.
   - Challenge: Spawn 2 Challengers (`teamwork_challenger`) to stress-test forms, responsive layout, contrast, and interactions.
   - Audit: Spawn a Forensic Auditor (`teamwork_auditor`) to verify zero integrity violations.
   - Gate: Enforce strict gate passing. Auditor CLEAN is mandatory.
3. Once all gate criteria pass, produce handoff.md, notify project orchestrator (5de8e4f7-7b38-49b7-8d56-95a474ec7a84). Keep progress.md updated.
