# Original User Request

## Initial Request — 2026-11-11T07:54:13Z

Build an exceptionally premium, immersive, full 3D gym and fitness club website for fictional international fitness brand IRONFORGE FITNESS as a sales demonstration for selling custom websites to gym owners, following a structured phased workflow without compromising cinematic quality or mobile usability.

Working directory: c:\Users\Admin\Desktop\GYM website 1
Integrity mode: demo
The team must NOT: copy code from existing open-source projects for core logic; run external scripts or delegate execution to other tools

## Requirements

### R1. Genuine 3D Environment & Immersive Hero Experience
Deliver a continuous, high-performance Three.js 3D experience designed with React Three Fiber and @react-three/drei inside a dark industrial gym environment featuring overhead and accent lighting using the exact four-colour palette (#000000 Black, #7D39EB Violet, #C6FF33 Lime, #FFFFFF White). Do not substitute static images for core 3D experiences. The hero must feature a realistic 3D athletic figure in a powerful pose, subtle camera response to pointer movement, smooth cinematic reveal, accessible HTML text overlays, and a WebGL fallback with an optimized static hero image.

### R2. Scroll-Driven 3D Storytelling & Interactive Equipment Showcase
Implement GSAP ScrollTrigger to orchestrate smooth, multi-scene camera movements across 5 narrative scenes (The Beginning, Strength, Performance, Discipline, and Your Next Level) without abrupt hijacking, respecting prefers-reduced-motion and keyboard navigation. Include an interactive 3D equipment showcase (dumbbell, barbell, weight plates, training bench) with smooth drag-to-rotate interaction, subtle floating animations, and dynamic lighting. All 3D models and media assets must be properly licensed for commercial website projects, sourced or generated using optimized GLB models and procedural 3D fallbacks.

### R3. Comprehensive Fitness Club Content Sections
Implement all website sections with responsive layouts, accessible semantic HTML, and polished animations:
- Training Programs (Strength Training, HIIT & Conditioning, Personal Training, Functional Fitness)
- About the Gym (cinematic layout highlighting equipment, expert trainers, facilities, community)
- Trainers Section (3 demo trainer profiles with subtle 3D tilt cards)
- Membership Experience (Starter, Pro, Elite tiered cards with clear comparison and configurable placeholder pricing)
- Gallery Experience (masonry or horizontal responsive gallery with lazy loading)
- Testimonials (3 clearly marked fictional demo testimonials)
- Final Conversion Section (cinematic CTA to join or contact)

### R4. Responsive Navigation, Contact System & Integrations
Build a floating transparent navbar with smooth section navigation and mobile drawer menu. Implement a validated contact enquiry form (name, phone, email, membership interest, message) with loading, success, and error states, operating in demo mode with configurable business details, along with a configurable WhatsApp enquiry link.

### R5. Mobile-First Optimization & Technical Performance
Engineer the site using Next.js 15 App Router, React 19, TypeScript strict mode, and Tailwind CSS v4. Ensure mobile-first performance with adaptive rendering, optimized GLB models, lazy-loading/Suspense for 3D scenes, instancing, asset disposal, reduced particle/shadow complexity on mobile, zero horizontal overflow, and full accessibility (ARIA, semantic headings, visible focus states). Verify responsive layouts and interactions across desktop, tablet, and mobile. Verification requires running production build (`npm run build`), strict TypeScript type-checking, linting, and browser testing.

## Acceptance Criteria

### 3D Experience & Visual Direction
- [ ] Genuine Three.js/React Three Fiber 3D environment renders without console errors; core 3D experiences use actual 3D models rather than static image substitutions
- [ ] Exact brand colour system (#000000 Black, #7D39EB Violet, #C6FF33 Lime, #FFFFFF White) is maintained across the entire project
- [ ] 3D hero scene includes realistic athletic figure, dynamic lighting, and accessible HTML headline copy
- [ ] ScrollTrigger drives smooth 5-scene camera transitions and equipment showcase
- [ ] Interactive 3D equipment supports drag-to-rotate and smooth floating animation
- [ ] All 3D models and media assets used are properly licensed for commercial website projects
- [ ] WebGL fallback renders clean static fallback layout when WebGL is unavailable

### Content & Functionality
- [ ] All 7 core content sections (Programs, About, Trainers, Membership, Gallery, Testimonials, Final CTA) are implemented
- [ ] Transparent navigation with desktop links and mobile touch-friendly drawer functions across all viewports
- [ ] Contact form validates inputs, displays loading/success/error states, and indicates demo mode
- [ ] WhatsApp button links to configured business contact placeholder

### Performance & Build Quality
- [ ] Mobile, tablet, and desktop layouts render responsively with no horizontal overflow
- [ ] Adaptive DPR, texture optimization, and dynamic/lazy loading prevent main thread blocking on mobile devices
- [ ] Production build (`npm run build`) completes cleanly with zero TypeScript or lint errors
- [ ] Reduced motion media query (`prefers-reduced-motion`) disables intense camera motions gracefully
- [ ] Browser testing confirms functional interactions and clean console output across desktop, tablet, and mobile viewports
