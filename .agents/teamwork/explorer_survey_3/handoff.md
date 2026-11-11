# Frontend Architecture, Content Sections & Performance Survey

## 1. Observation

### 1.1 Project Working Directory & Environment
- **Project Root**: `c:\Users\Admin\Desktop\GYM website 1`
- **Initial Workspace State**: Checked via PowerShell `Get-ChildItem -Path . -Force` (exited code 0). Contains only `.git`, `.agents/teamwork/`, and a 17-byte `README.md`. No pre-existing front-end framework files exist in the project root.
- **Node.js & NPM Version**: Node.js `v25.8.0`, NPM `11.11.0` (Windows OS).
- **Primary Requirements Source**: `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\ORIGINAL_REQUEST.md`
  - Verbatim R3: *"Implement all website sections with responsive layouts, accessible semantic HTML, and polished animations:
    - Training Programs (Strength Training, HIIT & Conditioning, Personal Training, Functional Fitness)
    - About the Gym (cinematic layout highlighting equipment, expert trainers, facilities, community)
    - Trainers Section (3 demo trainer profiles with subtle 3D tilt cards)
    - Membership Experience (Starter, Pro, Elite tiered cards with clear comparison and configurable placeholder pricing)
    - Gallery Experience (masonry or horizontal responsive gallery with lazy loading)
    - Testimonials (3 clearly marked fictional demo testimonials)
    - Final Conversion Section (cinematic CTA to join or contact)"* (lines 19–27)
  - Verbatim R4: *"Build a floating transparent navbar with smooth section navigation and mobile drawer menu. Implement a validated contact enquiry form (name, phone, email, membership interest, message) with loading, success, and error states, operating in demo mode with configurable business details, along with a configurable WhatsApp enquiry link."* (lines 29–31)
  - Verbatim R5: *"Engineer the site using Next.js 15 App Router, React 19, TypeScript strict mode, and Tailwind CSS v4. Ensure mobile-first performance with adaptive rendering, optimized GLB models, lazy-loading/Suspense for 3D scenes, instancing, asset disposal, reduced particle/shadow complexity on mobile, zero horizontal overflow, and full accessibility (ARIA, semantic headings, visible focus states). Verify responsive layouts and interactions across desktop, tablet, and mobile. Verification requires running production build (`npm run build`), strict TypeScript type-checking, linting, and browser testing."* (lines 32–34)
  - Verbatim Brand Palette: *"exact four-colour palette (#000000 Black, #7D39EB Violet, #C6FF33 Lime, #FFFFFF White)"* (line 14 & line 39).
  - Verbatim Acceptance Criteria:
    - *"All 7 core content sections (Programs, About, Trainers, Membership, Gallery, Testimonials, Final CTA) are implemented"* (line 47)
    - *"Transparent navigation with desktop links and mobile touch-friendly drawer functions across all viewports"* (line 48)
    - *"Contact form validates inputs, displays loading/success/error states, and indicates demo mode"* (line 49)
    - *"WhatsApp button links to configured business contact placeholder"* (line 50)
    - *"Mobile, tablet, and desktop layouts render responsively with no horizontal overflow"* (line 53)
    - *"Production build (`npm run build`) completes cleanly with zero TypeScript or lint errors"* (line 55)
    - *"Reduced motion media query (`prefers-reduced-motion`) disables intense camera motions gracefully"* (line 56)

### 1.2 Peer Explorer Boundary Alignment
- **Explorer 1 (Codebase & Infrastructure)**: Establishes Next.js 15 App Router setup, React 19, Tailwind CSS v4, TypeScript configs, and build scripts.
- **Explorer 2 (3D Architecture)**: Documented in `.agents/teamwork/explorer_survey_2/handoff.md`:
  - Persistent background `<Canvas>` (`fixed inset-0 pointer-events-none z-0`) rendering dark industrial gym environment, 4-color lighting rig, 5-scene camera narrative via GSAP ScrollTrigger, and interactive 3D equipment showcase.
  - HTML content sections must sit on `relative z-10 pointer-events-auto` layer above the canvas.
  - Interactive 3D equipment section requires an event-forwarding overlay or designated viewport region where pointer interactions are captured.
- **Explorer 3 (This Agent)**: Architectural blueprint for all 7 HTML content sections, navigation, forms, WhatsApp integration, mobile-first responsive layout, and client-side performance engineering.

---

## 2. Logic Chain

### 2.1 Exact Brand Palette & Design Token System
From Observation 1.1 (strict 4-color palette mandate: `#000000 Black`, `#7D39EB Violet`, `#C6FF33 Lime`, `#FFFFFF White`), we deduce the semantic color roles and contrast hierarchy:

| Color Hex | Semantic Role | Tailwind Utility Mapping | Accessibility / Contrast Ratio on Black |
| :--- | :--- | :--- | :--- |
| `#000000` | Void Background, Canvas Clear, Base Cards | `bg-black`, `bg-[#000000]` | Base Surface |
| `#7D39EB` | Electric Violet (Atmospheric aura, secondary borders, gradient glows) | `text-[#7D39EB]`, `border-[#7D39EB]`, `bg-[#7D39EB]` | Decorative & Accent / Exceeds 4.5:1 on white text |
| `#C6FF33` | Acid Lime (High-voltage highlights, primary CTAs, active states, focus rings) | `text-[#C6FF33]`, `bg-[#C6FF33]`, `ring-[#C6FF33]` | **16.5:1** contrast ratio against `#000000` (Exceeds WCAG AAA 7:1) |
| `#FFFFFF` | Primary Headings, High-Contrast Body Copy, Icons | `text-white`, `border-white/10` | **21:1** contrast ratio against `#000000` (Maximum contrast) |

#### Surface & Glass Elevation Tokens:
- **Surface Level 0 (Base Canvas)**: `#000000`
- **Surface Level 1 (Card Shell)**: `bg-zinc-950/80` with `border border-white/10`
- **Surface Level 2 (Inner Card Core)**: `bg-black/90` with `border border-[#7D39EB]/20`
- **Surface Level 3 (Active / Focus Card)**: `border-[#C6FF33]` with lime outer glow (`box-shadow: 0 0 25px rgba(198, 255, 51, 0.2)`)
- **Glassmorphism Backdrop**: `backdrop-blur-xl bg-black/75` (restricted exclusively to fixed navbar, modal overlays, and drawer to prevent GPU paint thrashing).

---

### 2.2 Directory Architecture & Component Hierarchy (Next.js 15 App Router)
To maintain clean separation between Server Components (SEO-optimized static copy, structured metadata) and Client Components (interactive forms, 3D tilt, lightboxes, mobile drawers):

```
src/
├── app/
│   ├── layout.tsx             # Root layout: metadata, fonts, fixed 3D canvas mount, navbar, footer
│   ├── page.tsx               # Main landing page assembling all 7 content sections
│   └── globals.css            # Tailwind CSS v4 directives, custom font imports, custom utility classes
├── components/
│   ├── navigation/
│   │   ├── Navbar.tsx         # Floating transparent glass pill navbar (Client Component)
│   │   ├── NavLinks.tsx       # Smooth scroll anchor link items with active ScrollSpy tracking
│   │   └── MobileDrawer.tsx   # Accessible slide-out mobile drawer with focus trap
│   ├── sections/
│   │   ├── HeroOverlay.tsx    # Accessible HTML hero copy, stats bar, and CTA buttons over 3D canvas
│   │   ├── ProgramsSection.tsx# Section 1: 4 Training Programs grid with filter tabs & syllabus modal
│   │   ├── AboutSection.tsx   # Section 2: Asymmetrical Bento Grid (Equipment, Trainers, Facilities, Community)
│   │   ├── TrainersSection.tsx# Section 3: 3 Trainer Profiles with 3D Tilt Cards & consultation trigger
│   │   ├── EquipmentSectionOverlay.tsx # Narrative overlay coordinating with 3D Equipment Showcase
│   │   ├── MembershipSection.tsx # Section 4: Tiered cards (Starter, Pro, Elite), billing switcher, amenities matrix
│   │   ├── GallerySection.tsx # Section 5: Filterable masonry gallery with lazy loading & full lightbox modal
│   │   ├── TestimonialsSection.tsx # Section 6: 3 clearly marked demo testimonials carousel
│   │   ├── FinalCtaSection.tsx# Section 7: Cinematic conversion banner & direct WhatsApp/trial CTAs
│   │   └── Footer.tsx         # Comprehensive footer: operational hours, legal demo notices, social links
│   ├── forms/
│   │   ├── ContactForm.tsx    # Validated enquiry form with loading, success, error, and demo mode states
│   │   └── WhatsAppButton.tsx # Floating quick-action badge + inline parameterized WhatsApp link
│   └── ui/
│   │   ├── TiltCard.tsx       # Reusable 3D perspective tilt container with touch/reduced-motion fallback
│   │   ├── LightboxModal.tsx  # Accessible full-screen image viewer with keyboard navigation
│   │   ├── SectionHeader.tsx  # Unified eyebrow tag, H2 title, and subtitle typography block
│   │   ├── Badge.tsx          # Micro-pills (e.g. "MOST POPULAR", "FICTIONAL DEMO", "CSCS CERTIFIED")
│   │   └── Button.tsx         # High-craft button with double-bezel, nested icon, and magnetic press
├── config/
│   ├── site.ts                # Brand information, business contact placeholders, WhatsApp telephone
│   ├── programs.ts            # Detailed syllabus, intensity, duration, and deliverables for 4 programs
│   ├── trainers.ts            # Bios, credentials, specialties, and quotes for 3 trainers
│   ├── membership.ts          # Tier definitions, pricing matrix, and comprehensive feature checklists
│   ├── gallery.ts             # Image paths, aspect ratios, categories, alt text, and credits
│   └── testimonials.ts        # 3 Fictional demo testimonials with verification badges
├── types/
│   └── index.ts               # Strict TypeScript interfaces for all components, models, and form schemas
└── hooks/
    ├── useScrollSpy.ts         # Tracks active section via IntersectionObserver
    ├── usePrefersReducedMotion.ts # Listens to media query (prefers-reduced-motion: reduce)
    └── useFocusTrap.ts        # Traps focus within mobile menu and lightbox modals
```

---

### 2.3 Detailed Architecture of the 7 Core Content Sections

#### Section 1: Training Programs (`ProgramsSection.tsx`)
1. **Four Disciplines**:
   - **Strength & Powerlifting**: Heavy compound lifting, competition benches, calibrated steel plates, progressive overload periodization.
   - **HIIT & Metabolic Conditioning**: High-velocity anaerobic intervals, Concept2 rowers, ski ergs, assault bikes, lactate threshold conditioning.
   - **Bespoke 1-on-1 Personal Training**: Dedicated biomechanical movement screen, custom periodization, full nutritional programming, weekly body composition scans.
   - **Functional Athletics & Mobility**: Turf sprint tracks, prowler sled pushes, gymnastic ring stability, myofascial release, joint longevity protocols.
2. **Interactive Layout**:
   - Filter Tabs: `All Disciplines`, `Strength`, `Conditioning`, `Personal Coaching`, `Functional Movement`.
   - Card Structure: Double-bezel card with category eyebrow, program name, intensity meter (1-5 visual pips), session duration, bulleted core deliverables, and "View Syllabus" modal trigger.
   - Neon accent: Subtle `#7D39EB` top border gradient transitioning to `#C6FF33` on hover.

#### Section 2: About the Gym (`AboutSection.tsx`)
1. **Four Core Pillars in Asymmetrical Bento Layout**:
   - **Pillar 1: Olympic-Grade Equipment** (Span 8 cols on desktop): Highlighting custom-machined urethane dumbbells (up to 150 lbs), calibrated Eleiko barbells, competition power cages, and isolateral lever machines.
   - **Pillar 2: Certified Performance Coaches** (Span 4 cols): Highlighting CSCS, EXOS, and Olympic coaching credentials with strict coach-to-member ratios.
   - **Pillar 3: Contrast Recovery Suites** (Span 4 cols): Sub-zero cold plunge tubs (38°F), dry cedar infrared saunas (195°F), Normatec compression boots.
   - **Pillar 4: Elite Community Culture** (Span 8 cols): Culture of accountability, zero tolerance for distractions, collective elevation of members.
2. **Key Metric Indicators**:
   - `15,000 SQ FT` Engineered Compound
   - `24/7/365` Encrypted Biometric Access
   - `50+` Dedicated Power & Olympic Stations
   - `99.2%` Member Goal Attainment Rate

#### Section 3: Trainers Section (`TrainersSection.tsx`)
1. **Three Demo Trainer Profiles**:
   - **Trainer 1: Marcus "Vanguard" Vance**
     - Role: Head of Strength & Powerlifting
     - Credentials: CSCS, USAW Level 2 Senior Coach, Ex-National Weightlifting Competitor
     - Focus: Biomechanics, Max-Strength Periodization, Deadlift/Squat Rehabilitation
     - Philosophy: *"Form is non-negotiable. Intensity is earned."*
   - **Trainer 2: Elena "Apex" Rostova**
     - Role: Director of Functional Athletics & Mobility
     - Credentials: DPT (Doctor of Physical Therapy), FMS Certified, Gymnastic Strength Coach
     - Focus: Joint Longevity, Scapular Stability, Dynamic Mobility, Posterior Chain Health
     - Philosophy: *"True strength moves seamlessly through every degree of human freedom."*
   - **Trainer 3: Jaxson "Forge" Reed**
     - Role: Lead Metabolic Conditioning & Endurance Architect
     - Credentials: Ex-Special Forces Combat Fitness Instructor, NASM-PES, Kettlebell Master
     - Focus: Lactate Buffering, VO2 Max Optimization, Mental Fortitude Under Fatigue
     - Philosophy: *"The mind breaks long before the body. We train the mind first."*
2. **3D Tilt Interaction Mechanics (`TiltCard.tsx`)**:
   - Implements 3D perspective CSS: `perspective: 1000px`, `transform: rotateX(X deg) rotateY(Y deg) scale3d(1.02, 1.02, 1.02)`.
   - Dynamic radial gradient sheen tracking mouse position: `background: radial-gradient(circle at ${x}% ${y}%, rgba(198, 255, 51, 0.15), transparent 70%)`.
   - **Graceful Fallback**: Disabled automatically on touch devices (`(pointer: coarse)`) or when `prefers-reduced-motion` is active, replacing tilt with a smooth CSS opacity/border highlight.

#### Section 4: Membership Experience (`MembershipSection.tsx`)
1. **Billing Frequency Switcher**:
   - Interactive toggle: `Monthly Billing` vs `Annual Billing (Save 20%)`.
   - Smooth animated background pill indicating active billing cycle.
2. **Three Tiered Cards**:
   - **Starter Tier**:
     - Price: `$79 / month` (or `$63 / mo` annually)
     - Tagline: *"Foundational Strength"*
     - Inclusions: Standard facility access (5 AM - 11 PM), locker room & infrared sauna, initial fitness assessment, IRONFORGE mobile workout tracker.
     - CTA: `Select Starter Pass`
   - **Pro Tier (Highlighted / Most Popular)**:
     - Price: `$149 / month` (or `$119 / mo` annually)
     - Tagline: *"Unrestricted Performance"*
     - Visual badge: `MOST POPULAR` in Neon Lime `#C6FF33`
     - Border highlight: Full `#C6FF33` glowing perimeter
     - Inclusions: **24/7/365 all-facility biometric access**, full contrast recovery suite (cold plunge & sauna), bi-weekly coach check-ins, priority Olympic platform booking, 2 guest passes per month, 15% apparel discount.
     - CTA: `Claim Pro Access` (High-contrast `#C6FF33` button with black text)
   - **Elite Tier**:
     - Price: `$249 / month` (or `$199 / mo` annually)
     - Tagline: *"VIP Biomechanical Mastery"*
     - Border highlight: `#7D39EB` electric violet aura
     - Inclusions: All Pro amenities + **4 monthly 1-on-1 personal training sessions**, bespoke nutritional macros & meal planning, private reserved locker with laundry service, unlimited recovery lounge access, custom IRONFORGE training kit.
     - CTA: `Request Elite Membership`
3. **Interactive Amenities Comparison Matrix**:
   - Collapsible detailed matrix comparing 16 granular amenities (e.g. 24/7 access, cold plunge, guest privileges, 1-on-1 coaching, reserved parking, app analytics) across the three tiers.
4. **Configurable Architecture**:
   - All pricing, currency symbols, billing discounts, and feature lists are centralized in `src/config/membership.ts` for instantaneous customization by gym owners.

#### Section 5: Gallery Experience (`GallerySection.tsx`)
1. **Visual Curation & Categories**:
   - Tabs: `All Views`, `Lifting Platforms`, `Cardio & Turf`, `Recovery Suite`, `Atmosphere`.
   - 8 High-resolution, high-contrast industrial gym visuals showcasing the dark atmosphere, violet rim lighting, chalk clouds, and heavy steel.
2. **Performance & Lazy Loading**:
   - Modern WebP image optimization with responsive `srcset` (`sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`).
   - Low-quality image placeholder (LQIP) / CSS dark skeleton shimmer while loading.
   - `loading="lazy"` and `decoding="async"`.
3. **Interactive Lightbox Modal (`LightboxModal.tsx`)**:
   - Click-to-enlarge full-screen overlay with `backdrop-blur-2xl bg-black/90`.
   - Keyboard accessibility: `Esc` to close, `ArrowLeft` / `ArrowRight` to cycle images.
   - Touch swipe gestures for mobile navigation.
   - Focus trap preventing keyboard focus from escaping to the background page.

#### Section 6: Testimonials Section (`TestimonialsSection.tsx`)
1. **Three Fictional Demo Testimonials**:
   - **Testimonial 1**:
     - Author: *David K.* (Competitive Powerlifter & Software Architect)
     - Quote: *"IRONFORGE eliminated every excuse I ever made. The atmosphere is quiet, intense, and relentless. In 8 months under Marcus Vance's programming, I added 55 lbs to my deadlift while dropping 14 lbs of body fat. There is no comparable gym in the country."*
     - Metric Achieved: `+55 LBS DEADLIFT PR`
     - Rating: 5/5 Stars (`#C6FF33`)
   - **Testimonial 2**:
     - Author: *Dr. Samantha M.* (Orthopedic Surgeon & Marathon Finisher)
     - Quote: *"Between 14-hour surgery shifts and marathon training, recovery is my lifeline. The contrast therapy suite—sub-zero plunges followed by infrared heat—keeps my systemic inflammation at absolute zero. Elena's mobility coaching kept me completely injury-free."*
     - Metric Achieved: `SUB-3:15 MARATHON PR`
     - Rating: 5/5 Stars (`#C6FF33`)
   - **Testimonial 3**:
     - Author: *Liam T.* (Tech Founder & Amateur Boxer)
     - Quote: *"Most commercial gyms are crowded social clubs with broken cables. IRONFORGE is an engineered temple of performance. Jaxson's conditioning sessions pushed my anaerobic threshold further than collegiate athletics ever did."*
     - Metric Achieved: `12% VO2 MAX INCREASE`
     - Rating: 5/5 Stars (`#C6FF33`)
2. **Mandatory Demo Verification Badge**:
   - Prominent badge at top of section: `[ FICTIONAL DEMO TESTIMONIALS — FOR SALES DEMONSTRATION PURPOSES ]`
   - Explicit inline labels next to author credentials: `(Demo Client Profile)`.

#### Section 7: Final Conversion Section & Cinematic Footer (`FinalCtaSection.tsx` & `Footer.tsx`)
1. **Conversion Banner**:
   - Full-bleed industrial dark container with radiant `#7D39EB` violet gradient mesh and `#C6FF33` lime corner accents.
   - Headline: `FORGE YOUR LEGACY. STEP ONTO THE PLATFORM.`
   - Supporting Copy: `Limited to 350 active memberships to maintain zero equipment wait times and uncompromised coaching quality.`
   - Action Pair:
     - Primary Button: `Claim Complimentary 3-Day Pass` (smooth scrolls directly to Contact Form)
     - Secondary Button: `Direct WhatsApp Inquiry` (instant WhatsApp chat)
   - Assurance Pills: `No Long-Term Lock-In Required`, `Instant Biometric Keycard Setup`, `Complimentary Biomechanical Assessment`.
2. **Footer Component (`Footer.tsx`)**:
   - Brand lockup with SVG anvil/forge emblem in `#C6FF33`.
   - Navigation links column, Hours column (`Mon-Sun: 24/7 Biometric Access`, `Staffed Coaching: 06:00 - 22:00`), Location column (`IRONFORGE Compound, Industrial Quarter, Metro 1`), Contact column.
   - Mandatory Demo Mode Notice: `IRONFORGE FITNESS is a fictional demonstration brand engineered by expert digital architects to showcase high-performance 3D commercial web solutions for gym and fitness enterprise owners.`

---

### 2.4 Floating Transparent Navigation & Mobile Touch Drawer

#### 1. Desktop Floating Navbar (`Navbar.tsx`)
- **Positioning**: Detached floating pill at `fixed top-5 inset-x-0 mx-auto w-[92%] max-w-6xl z-50`.
- **Styling**: `rounded-full border border-white/10 bg-black/75 backdrop-blur-xl transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)]`.
- **Dynamic Scroll States**:
  - Top of page (`scrollY < 40`): Ultra-minimal border, transparent base.
  - Scrolled (`scrollY >= 40`): Deep `#000000/90` blur, active `#7D39EB`/30 bottom rim, compact vertical padding (`py-2.5` vs `py-4`).
- **ScrollSpy Navigation**:
  - IntersectionObserver continuously observes section anchors: `#hero`, `#programs`, `#about`, `#trainers`, `#membership`, `#gallery`, `#testimonials`, `#contact`.
  - Active nav item receives glowing `#C6FF33` indicator pill and white text, while inactive links remain muted `#A1A1AA hover:text-white`.
- **Header CTAs**:
  - Direct WhatsApp link icon.
  - Primary button: `Join Now` (pills button with `#C6FF33` background, black text, smooth scroll to `#membership` or `#contact`).

#### 2. Mobile Touch Drawer (`MobileDrawer.tsx`)
- **Hamburger Button**:
  - Touch-optimized 44x44px hit target (`aria-label="Toggle navigation menu"`, `aria-expanded={isOpen}`).
  - 3-bar morph animation: Top and bottom bars rotate 45 degrees to create a clean 'X', middle bar fades out with CSS transition.
- **Drawer Overlay**:
  - Slide-in from right (`translate-x-full` to `translate-x-0`) covering full mobile viewport.
  - Background: `bg-black/95 backdrop-blur-2xl border-l border-white/10`.
  - Staggered link reveal: Each navigation link translates from `translate-y-6 opacity-0` to `translate-y-0 opacity-100` with 50ms stagger.
  - Direct Action Group at bottom: Instant WhatsApp button and "Claim 3-Day Pass" button.
- **Accessibility & Escape Controls**:
  - `role="dialog"`, `aria-modal="true"`.
  - Listens to `keydown` event: Pressing `Escape` closes the drawer immediately.
  - Focus is trapped within drawer elements while open (`useFocusTrap`).
  - Restores focus to the hamburger button when closed.
  - Body scroll lock (`overflow: hidden` on `document.body` while menu is open).

---

### 2.5 Validated Contact Enquiry Form & WhatsApp Integration

#### 1. Contact Form Architecture (`ContactForm.tsx`)
1. **Form Schema & Strict TypeScript Interface**:
   ```typescript
   export interface ContactFormValues {
     fullName: string;
     phone: string;
     email: string;
     membershipInterest: 'starter' | 'pro' | 'elite' | 'personal-training' | 'general';
     preferredContact: 'whatsapp' | 'email' | 'phone';
     message: string;
   }
   ```
2. **Validation Rules**:
   - `fullName`: Required, minimum 2 characters, alphabetic characters and spaces only (`/^[a-zA-Z\s'-]{2,50}$/`).
   - `phone`: Required, valid international or domestic format (`/^\+?[0-9\s-()]{7,20}$/`).
   - `email`: Required, valid RFC email pattern (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
   - `membershipInterest`: Required, must be one of the enum values.
   - `message`: Optional, but if entered, must be at least 5 characters.
3. **Form State Machine**:
   - `idle`: Form is clean, awaiting interaction.
   - `touched`: User has interacted with a field; inline errors appear upon blur or invalid submission.
   - `submitting`: Submit button shows animated spinner, inputs disabled, ARIA announcement `aria-busy="true"`.
   - `success`: Card smoothly transitions to celebratory checkmark card:
     - Confirms receipt of inquiry.
     - Displays personalized summary: *"Thank you, [Name]! Your inquiry for the [Tier] membership has been logged."*
     - Clear indicator: *"In Demo Mode, this triggers an automatic simulation. In production, this wires to CRM or Resend API."*
     - "Submit Another Inquiry" reset button.
   - `error`: Alert banner appears at top of form with clear remediation instructions and red/violet border warning.
4. **Demo Mode Notification Banner**:
   - Bold banner permanently placed above form:
     `⚡ DEMO MODE ACTIVE: Form submissions are simulated for sales demonstration. In production deployment, entries connect to your CRM, WhatsApp Business webhook, or email service.`

#### 2. Configurable WhatsApp Integration (`WhatsAppButton.tsx`)
1. **Dynamic URL Construction**:
   ```typescript
   export function buildWhatsAppUrl(options?: {
     phone?: string;
     tier?: string;
     name?: string;
   }): string {
     const businessPhone = options?.phone || siteConfig.contact.whatsappPhone;
     let text = `Hello IRONFORGE FITNESS! I would like to inquire about gym membership.`;
     if (options?.tier) {
       text = `Hello IRONFORGE FITNESS! I am interested in joining the ${options.tier.toUpperCase()} membership tier.`;
     }
     if (options?.name) {
       text += ` My name is ${options.name}.`;
     }
     return `https://wa.me/${businessPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
   }
   ```
2. **Placement**:
   - Floating quick-dial button anchored at `fixed bottom-6 right-6 z-40` with pulsing `#C6FF33` ring.
   - Inline direct buttons within the Navigation bar, Membership cards, and Final CTA section.
   - Fully customizable phone number and greeting in `src/config/site.ts`.

---

### 2.6 Mobile-First Optimization, Zero Horizontal Overflow & Performance

#### 1. Zero Horizontal Overflow Safeguards
1. **Root Layout Discipline**:
   - `html, body`: `width: 100%`, `overflow-x: clip`, `margin: 0`, `padding: 0`.
   - All section wrappers enforce `w-full max-w-full overflow-hidden` or `overflow-x-clip`.
   - Responsive padding uses standard clamp utilities: `px-4 sm:px-6 lg:px-8`.
2. **3D Canvas Layering**:
   - The React Three Fiber canvas sits in a fixed container: `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 0`.
   - Content container sits at `relative z-10 w-full min-h-screen`.
   - Interactive 3D equipment showcase (Scene 4) uses an isolated, bounded interaction zone with touch swipe events mapped directly to model rotation.

#### 2. 3D Canvas Dynamic Loading & Suspense
- To prevent Three.js and heavy WebGL shaders from delaying initial HTML paint and Core Web Vitals (LCP, FID):
  ```tsx
  // app/page.tsx
  const GymCanvas = dynamic(() => import('@/components/canvas/GymCanvas'), {
    ssr: false,
    loading: () => <CanvasLoadingSkeleton />
  });
  ```
- React 19 `<Suspense>` boundary wraps 3D assets, streaming static HTML sections immediately to the browser.

#### 3. Viewport Height Jumping Prevention on Mobile
- Mobile browsers (Safari on iOS, Chrome on Android) dynamically expand and collapse their address bars during scroll.
- **Rule**: Never use `h-screen` on scrollable sections. Always use `min-h-[100dvh]` or auto height with generous vertical padding (`py-20 md:py-32`) to eliminate visual layout shifts (CLS).

#### 4. Motion & Reduced Motion (`prefers-reduced-motion`)
- Custom React hook `usePrefersReducedMotion()`:
  - Detects `window.matchMedia('(prefers-reduced-motion: reduce)')`.
  - When active:
    - Tilting cards (`TiltCard.tsx`) lock at 0 degrees rotation.
    - Continuous floating animations and parallax scroll transforms are disabled.
    - Transitions fall back to instantaneous or simple opacity fades.
  - Tailwind utility integration: `motion-reduce:transform-none motion-reduce:transition-none`.

---

### 2.7 Accessibility (WCAG 2.1 AA Compliance)
1. **Semantic HTML Landmarks**:
   - `<header role="banner">` for floating navigation.
   - `<main id="main-content">` enclosing all 7 content sections.
   - `<section aria-labelledby="section-heading-id">` for each gym section.
   - `<form aria-label="Membership enquiry form">` with explicit `<label htmlFor="...">` bindings.
   - `<footer role="contentinfo">` for copyright and contact details.
2. **Keyboard Navigation & Visible Focus States**:
   - `focus-visible:ring-2 focus-visible:ring-[#C6FF33] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none` on all interactive links, buttons, and form inputs.
   - Logical tab order matching visual DOM layout.
   - Skip to main content link: `<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] px-4 py-2 bg-[#C6FF33] text-black font-bold rounded-md">Skip to content</a>`.
3. **Contrast Compliance**:
   - Pure White `#FFFFFF` on pitch black `#000000`: Contrast ratio **21:1** (WCAG AAA).
   - High-voltage Lime `#C6FF33` on `#000000`: Contrast ratio **16.5:1** (WCAG AAA).
   - Electric Violet `#7D39EB`: Used for non-text borders, background glow meshes, or paired with large white headlines.

---

## 3. Caveats

1. **Next.js 15 App Router & Client Boundaries**:
   - Next.js 15 defaults all components in `app/` to Server Components. Components using React hooks (`useState`, `useEffect`, `useRef`), event listeners (`onClick`, `onMouseMove`), or browser APIs must explicitly declare `'use client'` at the top of the file.
2. **Tailwind CSS v4 Configuration**:
   - Tailwind CSS v4 eliminates the traditional `tailwind.config.js` in favor of CSS-first `@theme` directives in `globals.css`. Brand colors `#000000`, `#7D39EB`, `#C6FF33`, and `#FFFFFF` must be declared under `@theme` or referenced via exact arbitrary hex classes (`bg-[#7D39EB]`, `text-[#C6FF33]`).
3. **Touch Parity for 3D Tilt**:
   - 3D perspective tilt calculations driven by mouse cursor coordinates do not apply naturally to touchscreen devices. Touch devices must cleanly bypass tilt calculations and rely on touch-tap states.
4. **Form Submission in Demo Mode**:
   - Since the site is built in "demo mode" as a showcase for selling custom gym websites, the form simulates realistic submission with a 1.2s network delay, then reveals an interactive success state. The code must include clear inline comments showing exactly where to plug in a real endpoint (e.g. Next.js Route Handler `/api/contact`, Formspree, or Resend).

---

## 4. Conclusion

The frontend architecture for IRONFORGE FITNESS has been fully surveyed, decomposed, and specified to meet all requirements of R3, R4, and R5:

1. **All 7 Core Sections Specified**:
   - **Programs**: 4 distinct training disciplines with filter tabs and syllabus modal.
   - **About**: Asymmetric bento grid covering Equipment, Trainers, Facilities, and Community with metric callouts.
   - **Trainers**: 3 demo coach profiles (Marcus Vance, Elena Rostova, Jaxson Reed) with interactive 3D tilt cards.
   - **Membership**: Tiered cards (Starter, Pro, Elite), monthly/annual switcher, interactive amenities matrix, and configurable pricing in `src/config/membership.ts`.
   - **Gallery**: Categorized masonry gallery with lazy loading and full-screen accessible lightbox.
   - **Testimonials**: 3 clearly marked demo testimonials with rating stars, metrics, and demo disclaimer badges.
   - **Final CTA & Footer**: High-conversion cinematic banner with dual CTAs, legal demo notices, and operational hours.
2. **Navigation & Mobile Drawer**: Floating transparent glass pill navbar with ScrollSpy active tracking, focus-trapped slide-out mobile drawer, and animated hamburger morph.
3. **Contact & WhatsApp**: Comprehensive validated form with state machine (idle, validating, submitting, success, error) and clear demo mode indicator, coupled with parameterized WhatsApp link generator.
4. **Technical & Mobile Performance**: Strict 4-color palette, zero horizontal overflow safeguards, dynamic imports/Suspense for 3D canvases, `min-h-[100dvh]` mobile viewport stability, `prefers-reduced-motion` compliance, and WCAG 2.1 AA accessibility.

---

## 5. Verification Method

### 5.1 Independent Code & Build Verification
To independently verify that the frontend architecture meets all specifications without errors:

1. **TypeScript Type Checking**:
   ```bash
   npx tsc --noEmit
   ```
   *Expected Result*: Exits with code 0 and zero type errors under `strict: true`.

2. **ESLint Static Analysis**:
   ```bash
   npm run lint
   ```
   *Expected Result*: Exits with code 0 and zero lint warnings.

3. **Production Build**:
   ```bash
   npm run build
   ```
   *Expected Result*: Next.js App Router creates optimized static and server-rendered routes without any bundling or hydration errors.

### 5.2 Responsive & Visual Verification Checklist
1. **Desktop Viewport (1440px - 1920px)**:
   - Floating navbar floats detached with transparent glass background.
   - Bento grid in About section renders in asymmetric 8/4 column layout.
   - Trainer cards tilt smoothly following mouse coordinates with lime sheen.
   - Membership Pro card is prominently highlighted with neon lime border.
2. **Tablet Viewport (768px - 1024px)**:
   - Bento grid collapses gracefully to 2-column layout.
   - Programs grid transitions to 2x2 cards.
   - Touch gestures on gallery allow swipe navigation.
3. **Mobile Viewport (375px - 414px)**:
   - Hamburger icon renders and opens full-height glass drawer with focus trap.
   - All grids collapse to a clean single-column stack with `gap-6`.
   - Zero horizontal scroll bar (`window.innerWidth === document.documentElement.clientWidth`).
   - 3D tilt is disabled; cards respond with touch active states.
4. **Accessibility Verification**:
   - `Tab` key traverses from top navbar through all links and form inputs with visible `#C6FF33` lime outline.
   - Pressing `Escape` closes mobile drawer and lightbox modal.
   - Form validates required inputs and announces errors via `aria-describedby`.
   - Toggling system "Reduce Motion" stops all camera drifts and card tilting.

### 5.3 Invalidation Conditions
The frontend architecture is considered invalidated if:
- Any content section causes horizontal scroll overflow on mobile viewports.
- The 4-color palette is violated (e.g. introducing unauthorized blue, orange, or grey hues).
- Client components fail to declare `'use client'` causing Next.js 15 build failure.
- Form submissions fail to display the demo mode disclaimer or lack proper validation.
