# Handoff Report: E2E Test Specifications for Features 1 to 10

## 1. Observation

### 1.1 Authoritative Requirement Sources
We directly inspected and extracted requirements from the authoritative project files:

1. **`c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\ORIGINAL_REQUEST.md`**:
   - Lines 13-15: *"Deliver a continuous, high-performance Three.js 3D experience... using the exact four-colour palette (#000000 Black, #7D39EB Violet, #C6FF33 Lime, #FFFFFF White)... accessible HTML text overlays, and a WebGL fallback with an optimized static hero image."*
   - Lines 19-27: *"Implement all website sections with responsive layouts, accessible semantic HTML, and polished animations:
     - Training Programs (Strength Training, HIIT & Conditioning, Personal Training, Functional Fitness)
     - About the Gym (cinematic layout highlighting equipment, expert trainers, facilities, community)
     - Trainers Section (3 demo trainer profiles with subtle 3D tilt cards)
     - Membership Experience (Starter, Pro, Elite tiered cards with clear comparison and configurable placeholder pricing)
     - Gallery Experience (masonry or horizontal responsive gallery with lazy loading)
     - Testimonials (3 clearly marked fictional demo testimonials)
     - Final Conversion Section (cinematic CTA to join or contact)"*
   - Lines 29-31: *"Build a floating transparent navbar with smooth section navigation and mobile drawer menu. Implement a validated contact enquiry form... operating in demo mode with configurable business details, along with a configurable WhatsApp enquiry link."*
   - Lines 32-34: *"Engineer the site using Next.js 15 App Router, React 19, TypeScript strict mode, and Tailwind CSS v4... zero horizontal overflow, and full accessibility (ARIA, semantic headings, visible focus states)."*
   - Lines 38-57 (Acceptance Criteria):
     - Exact brand colour system (#000000 Black, #7D39EB Violet, #C6FF33 Lime, #FFFFFF White) is maintained across entire project.
     - All 7 core content sections are implemented.
     - Transparent navigation with desktop links and mobile touch-friendly drawer functions across all viewports.
     - Reduced motion media query (`prefers-reduced-motion`) disables intense motions gracefully.

2. **`c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\PROJECT.md`**:
   - Lines 4-9: Next.js 15 App Router, React 19, TypeScript strict mode, Tailwind CSS v4 with CSS-first `@theme` configuration:
     - `#000000` Deep Obsidian (Base surfaces, canvas clear)
     - `#7D39EB` Electric Violet (Secondary accents, rim lights, ambient aura)
     - `#C6FF33` Acid Lime (Primary CTA, specular highlights, active indicators, focus rings, 16.5:1 contrast)
     - `#FFFFFF` Crisp White (Headings, primary copy, 21:1 contrast)
   - Lines 27-38: Features 1 through 10 assigned to Milestone 1:
     - F1: Framework Scaffolding & Design Tokens
     - F2: Component Library & UI Primitives (Button, Badge, TiltCard, LightboxModal, SectionHeader)
     - F3: Floating Navbar & Mobile Drawer (Glass navbar, scroll blur, scrollspy, mobile drawer, focus trap)
     - F4: Training Programs Section (4 disciplines, cards, modal syllabus)
     - F5: About the Gym Bento Grid (Equipment, Trainers, Facilities, Community)
     - F6: Trainers Section & 3D Tilt Cards (3 trainer profiles, stats, tilt physics, reduced-motion fallback)
     - F7: Membership Experience (Starter, Pro, Elite, monthly/annual toggle, comparison matrix)
     - F8: Gallery Experience (Masonry layout, lazy loading, lightbox modal)
     - F9: Testimonials Section (3 fictional demo testimonials, demo badge, rating)
     - F10: Final Conversion CTA & Footer (Cinematic banner, join/trial action, hours, disclaimer footer)
   - Lines 65-83: Global Design Tokens & Theme Contract:
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

3. **`c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\e2e_test_orchestrator\SCOPE.md` & `TEST_INFRA.md`**:
   - Zero-dependency Node.js test runner harness at `tests/runner.js`.
   - Tier 1: Feature Coverage (5 tests per feature).
   - Tier 2: Boundary, Corner & Negative cases (5 tests per feature).
   - Total specification target for Features 1-10: 50 Tier 1 tests + 50 Tier 2 tests = 100 test specifications.

4. **`c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\explorer_survey_3\handoff.md`**:
   - Lines 114-236: Granular content breakdown:
     - Programs: Strength & Powerlifting, HIIT & Metabolic Conditioning, Bespoke 1-on-1 Personal Training, Functional Athletics & Mobility.
     - About Bento: Equipment (8 cols), Trainers (4 cols), Recovery (4 cols), Community (8 cols), with metrics `15,000 SQ FT`, `24/7/365`, `50+`, `99.2%`.
     - Trainers: Marcus Vance (CSCS, USAW L2), Elena Rostova (DPT, FMS), Jaxson Reed (NASM-PES, Kettlebell Master).
     - Membership: Starter ($79/mo), Pro ($149/mo, Most Popular Lime badge), Elite ($249/mo), 20% annual discount, 16 amenities matrix.
     - Gallery: 8 images, 5 category tabs, WebP lazy loading, lightbox modal with Esc and arrow keys.
     - Testimonials: David K. (`+55 LBS DEADLIFT PR`), Dr. Samantha M. (`SUB-3:15 MARATHON PR`), Liam T. (`12% VO2 MAX INCREASE`), demo badge `[ FICTIONAL DEMO TESTIMONIALS — FOR SALES DEMONSTRATION PURPOSES ]`.
     - Final CTA & Footer: "FORGE YOUR LEGACY. STEP ONTO THE PLATFORM", dual action CTAs, 3 trust pills, hours `24/7 Biometric Access`, legal demo notice.

---

## 2. Logic Chain

### 2.1 Test Stratification & Partitioning
- **Tier 1 (Feature Coverage)**: Validates functional correctness, happy-path user flows, DOM structure, semantic contracts, and aesthetic adherence to brand tokens under standard operating conditions.
- **Tier 2 (Boundary, Corner, and Negative Cases)**: Exercises invalid inputs, extreme viewports (320px to 4K), media query overrides (`prefers-reduced-motion`, `pointer: coarse`, high-contrast), keyboard trapping, rapid user interaction spam, error recovery, and missing configuration fallbacks.

### 2.2 Traceability Mapping
Every test case maps directly to:
1. Feature ID (F01 through F10).
2. Requirement clause in `ORIGINAL_REQUEST.md` (R1, R3, R4, R5, AC).
3. Architecture contract in `PROJECT.md`.
4. Discrete test identifier in `tests/tier1/` or `tests/tier2/`.

---

## 3. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Infrastructure | Framework & Design Tokens | Next.js 15, React 19, TS strict, Tailwind v4, 4-color palette tokens | `BRAND_COLORS`, `SiteConfig` object, Tailwind `@theme` | CSS variables, typography classes, contrast ratios | Throws on invalid hex or missing required config fields | `PROJECT.md` #1, `ORIGINAL_REQUEST.md` R5 |
| 2 | UI Primitives | Component Library & UI Primitives | Button, Badge, TiltCard, LightboxModal, SectionHeader | Component props (variants, labels, callbacks, children) | Rendered DOM nodes, ARIA attributes, event triggers | Disabled button suppresses events; touch suppresses tilt | `PROJECT.md` #2, `ORIGINAL_REQUEST.md` R3 |
| 3 | Navigation | Floating Navbar & Mobile Drawer | Glass pill navbar, scroll blur, scrollspy, mobile drawer, focus trap | Scroll position `scrollY`, route anchors, hamburger click | Dynamic padding, active indicator pill, slide-in drawer | Scroll lock on body; Esc dismisses drawer | `PROJECT.md` #3, `ORIGINAL_REQUEST.md` R4 |
| 4 | Content | Training Programs Section | 4 disciplines, category tabs, cards, syllabus modal | Selected category tab, modal trigger click | Filtered program list, syllabus modal open | Empty filter fallback; modal Esc dismiss | `PROJECT.md` #4, `ORIGINAL_REQUEST.md` R3 |
| 5 | Content | About the Gym Bento Grid | 4-pillar bento grid (Equipment, Trainers, Facilities, Community) | Viewport width, pillar data props | Asymmetric grid layout, metric stat badges | Stacks to 1-col on mobile without overflow | `PROJECT.md` #5, `ORIGINAL_REQUEST.md` R3 |
| 6 | Content | Trainers Section & 3D Tilt Cards | 3 trainer profiles, stats, tilt physics, reduced-motion fallback | Mousemove coordinates (x, y), reduced motion query | 3D rotateX/rotateY, radial sheen, planar fallback | Clamps angles to ±15°; touch falls back to static | `PROJECT.md` #6, `ORIGINAL_REQUEST.md` R3 |
| 7 | Content | Membership Experience | Starter, Pro, Elite cards, billing toggle, comparison matrix | Billing interval (`monthly`/`annual`), matrix toggle | Discounted pricing, active toggle pill, 16 amenities | Clamps negative price; rounds decimals cleanly | `PROJECT.md` #7, `ORIGINAL_REQUEST.md` R3 |
| 8 | Content | Gallery Experience | Masonry grid, category filtering, lazy loading, lightbox modal | Category tab, thumbnail click, keyboard arrow events | Lazy WebP images, lightbox overlay, slide counter | Image 404 placeholder; wraps at index bounds | `PROJECT.md` #8, `ORIGINAL_REQUEST.md` R3 |
| 9 | Content | Testimonials Section | 3 fictional demo testimonials, demo badge, star ratings | Testimonial dataset, rating scores | Demo disclaimer banner, 5-star icons, PR metrics | Throws if demo disclaimer omitted; clamps rating [1,5] | `PROJECT.md` #9, `ORIGINAL_REQUEST.md` R3 |
| 10 | Content | Final Conversion CTA & Footer | Cinematic banner, join/trial CTA, hours, legal demo disclaimer | Button clicks, anchor targets, site contact config | Smooth scroll to `#contact`, footer links, demo notice | Validates WhatsApp URL; fallback on missing phone | `PROJECT.md` #10, `ORIGINAL_REQUEST.md` R3 |

---

## 4. Edge Cases

| # | Feature | Input / Trigger | Observed & Expected Behavior |
|---|---------|-----------------|------------------------------|
| E01 | F1 Design Tokens | Corrupted hex code (e.g. `#GGGGGG`, empty string) in theme helper | Helper sanitizes input and defaults to base `#000000` without throwing unhandled exception. |
| E02 | F1 Design Tokens | Screen width shrunk to 320px | Zero horizontal overflow; `clientWidth === scrollWidth`; no horizontal scrollbar. |
| E03 | F2 UI Primitives | Click event triggered on `Button` with `disabled={true}` or `isLoading={true}` | Event is completely suppressed; callback not called; button has `aria-disabled="true"`. |
| E04 | F2 UI Primitives | `TiltCard` hovered when `prefers-reduced-motion: reduce` is active | 3D rotation transform is forced to `none` / `rotateX(0deg) rotateY(0deg)`; static border glow used. |
| E05 | F2 UI Primitives | `LightboxModal` open; user presses `Tab` repeatedly | Keyboard focus remains strictly trapped within modal interactive elements (close, prev, next). |
| E06 | F3 Navigation | Mobile drawer open (`isOpen: true`); user presses `Escape` key | Drawer closes immediately (`isOpen: false`), body scroll unlocks, focus returns to hamburger button. |
| E07 | F3 Navigation | Hamburger button toggled 10 times in 200ms (rapid spam) | State machine handles rapid state changes deterministically without visual desynchronization. |
| E08 | F3 Navigation | Mobile drawer open at 375px; browser viewport resized to 1200px | Drawer auto-closes or hides; desktop navbar renders properly without orphaned overlay. |
| E09 | F4 Programs | Category filter tab clicked with no matching items | Section renders accessible empty state notice ("No programs found for this category"). |
| E10 | F4 Programs | Program item missing optional `syllabus.prerequisites` array | Program card and modal render gracefully without throwing `TypeError: cannot read property of undefined`. |
| E11 | F5 Bento Grid | Long translated text string (200+ characters) in bento description | Card expands vertically via auto-rows without breaking asymmetric grid or overlapping sibling cells. |
| E12 | F5 Bento Grid | High-contrast accessibility mode enabled (`prefers-contrast: more`) | Bento cards increase background to solid `#000000` with 100% opacity and high-contrast `#FFFFFF` borders. |
| E13 | F6 Trainers | Pointer moved far outside card container boundaries | Rotation angles strictly clamped to maximum threshold of ±15 degrees; does not invert card. |
| E14 | F6 Trainers | Trainer avatar image fails to load (HTTP 404) | Card renders stylized SVG monogram silhouette fallback with initials without collapsing card layout. |
| E15 | F7 Membership | Annual discount percentage set to custom fractional value (e.g. 17.5%) | Price rounds cleanly to nearest whole dollar or two decimal places without floating-point overflow (`$122.9250000...`). |
| E16 | F7 Membership | Comparison matrix toggled open/closed rapidly | Transition height animates cleanly without jumping or throwing CSS animation exceptions. |
| E17 | F8 Gallery | User presses `ArrowRight` while on the final image (index 7 of 8) | Image index wraps around safely to index 0 without out-of-bounds error. |
| E18 | F8 Gallery | User presses `ArrowLeft` while on the first image (index 0 of 8) | Image index wraps around safely to index 7 without index -1 error. |
| E19 | F9 Testimonials | Testimonial object lacks mandatory demo disclaimer indicator | Test assertion fails immediately, preventing unverified claims from shipping in demo mode. |
| E20 | F10 Conversion CTA | Primary CTA "Claim Complimentary 3-Day Pass" clicked | Window smoothly scrolls to `#contact`, and focus is placed on the first form input (`fullName`). |

---

## 5. Exhaustive Test Specifications: Features 1 to 10

### Feature 1: Framework Scaffolding & Design Tokens

#### Tier 1: Feature Coverage (5 Tests)
- **`T1-F01-01`**: Exact 4-Color Brand Theme Tokens
  - **Objective**: Verify that the exact 4-color palette (#000000, #7D39EB, #C6FF33, #FFFFFF) is defined in CSS theme tokens and code constants.
  - **Inputs**: Inspect `src/config/site.ts`, `PROJECT.md`, and `src/app/globals.css`.
  - **Actions**: Read `BRAND_COLORS` constant and computed `@theme` CSS custom properties.
  - **Expected Assertions**:
    - `BRAND_COLORS.black === '#000000'`
    - `BRAND_COLORS.violet === '#7D39EB'`
    - `BRAND_COLORS.lime === '#C6FF33'`
    - `BRAND_COLORS.white === '#FFFFFF'`
    - CSS variable `--color-brand-black` resolves to `#000000`.
    - CSS variable `--color-brand-violet` resolves to `#7D39EB`.
    - CSS variable `--color-brand-lime` resolves to `#C6FF33`.
    - CSS variable `--color-brand-white` resolves to `#FFFFFF`.
  - **Failure Condition**: Any color differs from the specified hex value, or extra brand colors are introduced.

- **`T1-F01-02`**: WCAG AAA Contrast Ratios on Deep Obsidian
  - **Objective**: Verify that brand contrast ratios meet or exceed WCAG AAA accessibility thresholds against pitch black (`#000000`).
  - **Inputs**: Compute relative luminance of `#000000`, `#C6FF33`, and `#FFFFFF` using WCAG 2.1 formula: $L = 0.2126R + 0.7152G + 0.0722B$.
  - **Actions**: Calculate contrast ratio $(L_1 + 0.05) / (L_2 + 0.05)$.
  - **Expected Assertions**:
    - Contrast ratio of `#C6FF33` (Acid Lime) on `#000000` is $\ge 16.0:1$ (actual ~16.5:1, exceeding WCAG AAA 7:1).
    - Contrast ratio of `#FFFFFF` (Crisp White) on `#000000` is $21.0:1$ (maximum possible contrast).
  - **Failure Condition**: Contrast ratio falls below 7.0:1 for text colors on dark surfaces.

- **`T1-F01-03`**: SiteConfig Object Interface Integrity
  - **Objective**: Verify that `siteConfig` in `src/config/site.ts` implements the complete `SiteConfig` interface contract.
  - **Inputs**: Import `siteConfig` from `src/config/site.ts`.
  - **Actions**: Validate presence and data types of all required fields.
  - **Expected Assertions**:
    - `typeof siteConfig.name === 'string'` and equals `"IRONFORGE FITNESS"`.
    - `typeof siteConfig.tagline === 'string'` and length > 10.
    - `typeof siteConfig.phone === 'string'` and length > 5.
    - `typeof siteConfig.email === 'string'` and matches email regex pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
    - `typeof siteConfig.address === 'string'` and length > 5.
    - `typeof siteConfig.whatsappNumber === 'string'` and contains only digits and optional leading `+`.
    - `siteConfig.demoMode === true`.
  - **Failure Condition**: Any field is missing, has incorrect type, or `demoMode` is not boolean `true`.

- **`T1-F01-04`**: Framework Dependency Verification
  - **Objective**: Verify `package.json` contains Next.js 15, React 19, TypeScript, and Tailwind CSS v4 dependencies.
  - **Inputs**: Parse `package.json` at project root.
  - **Actions**: Inspect `dependencies` and `devDependencies` dictionaries.
  - **Expected Assertions**:
    - `dependencies['next']` matches `^15`.
    - `dependencies['react']` matches `^19`.
    - `dependencies['react-dom']` matches `^19`.
    - `dependencies['tailwindcss']` matches `^4`.
    - `dependencies['@tailwindcss/postcss']` is present.
    - `devDependencies['typescript']` matches `^5`.
  - **Failure Condition**: Missing any core dependency or downgraded framework version.

- **`T1-F01-05`**: Root Layout Document Meta & Viewport
  - **Objective**: Verify `src/app/layout.tsx` exports metadata with brand title, dark theme color, and responsive viewport.
  - **Inputs**: Inspect `metadata` and `viewport` exports in `src/app/layout.tsx`.
  - **Actions**: Check exported configuration object.
  - **Expected Assertions**:
    - `metadata.title` contains `"IRONFORGE FITNESS"`.
    - `metadata.description` exists and contains fitness/gym positioning copy.
    - `viewport.themeColor` equals `[{ media: '(prefers-color-scheme: dark)', color: '#000000' }]` or `'#000000'`.
    - `viewport.width` equals `'device-width'`.
    - `viewport.initialScale` equals `1`.
  - **Failure Condition**: Missing title or theme-color metadata.

#### Tier 2: Boundary, Corner & Negative Cases (5 Tests)
- **`T2-F01-01`**: Disallowed Palette Color Rejection (Negative Boundary)
  - **Objective**: Verify theme validator rejects any color outside the 4 authorized hex codes (#000000, #7D39EB, #C6FF33, #FFFFFF).
  - **Inputs**: Pass unapproved colors (`#FF0000`, `#00FFCC`, `#FFA500`, `#123456`) to the brand theme verification utility.
  - **Actions**: Execute theme integrity audit helper.
  - **Expected Assertions**:
    - Helper throws or returns `valid: false` with detailed error listing unauthorized color codes.
  - **Failure Condition**: Unapproved color hex codes pass validation silently.

- **`T2-F01-02`**: Corrupted Hex Value Sanitization (Negative)
  - **Objective**: Verify color parsing helper handles malformed hex inputs gracefully without crashing.
  - **Inputs**: Test inputs: `""`, `null`, `undefined`, `"rgb(0,0,0)"`, `"#ZZZZZZ"`, `"#123"`.
  - **Actions**: Invoke `parseBrandHex(input)`.
  - **Expected Assertions**:
    - Return value defaults safely to base `#000000`.
    - No unhandled runtime `TypeError` or exception thrown.
  - **Failure Condition**: Process crashes with unhandled exception on malformed input.

- **`T2-F01-03`**: Ultra-Narrow Viewport Zero Horizontal Overflow (Boundary)
  - **Objective**: Verify root document structure enforces zero horizontal overflow at extreme narrow width (320px).
  - **Inputs**: Simulate 320px viewport in virtual DOM simulator.
  - **Actions**: Inspect `<html>` and `<body>` CSS styles and compute element width vs viewport.
  - **Expected Assertions**:
    - `body` style has `overflow-x: clip` or `overflow-x: hidden`.
    - No direct child container exceeds `320px` width.
    - `document.documentElement.scrollWidth <= 320`.
  - **Failure Condition**: Horizontal scrollbar exists or content extends beyond 320px.

- **`T2-F01-04`**: Strict TypeScript Interface Compliance (Compile Negative)
  - **Objective**: Verify adding extra or invalid fields to `SiteConfig` causes TypeScript compile error under strict mode.
  - **Inputs**: Construct mock object `{ ...siteConfig, unauthorizedProp: 123 }`.
  - **Actions**: Validate through TypeScript AST / type checker.
  - **Expected Assertions**:
    - TypeScript compiler flags error TS2353 ("Object literal may only specify known properties").
  - **Failure Condition**: TypeScript compiles with invalid fields under strict checking.

- **`T2-F01-05`**: Missing Environment Variables / Config Resilience (Edge Case)
  - **Objective**: Verify application loads with built-in default config when optional environment variables are absent.
  - **Inputs**: `process.env.NEXT_PUBLIC_WHATSAPP_PHONE = undefined`.
  - **Actions**: Load `siteConfig`.
  - **Expected Assertions**:
    - `siteConfig.whatsappNumber` falls back to placeholder default string without throwing `TypeError`.
    - Application layout renders without hydration error.
  - **Failure Condition**: App throws exception when optional env variables are missing.

---

### Feature 2: Component Library & UI Primitives

#### Tier 1: Feature Coverage (5 Tests)
- **`T1-F02-01`**: Button Component Variants & Primary Lime Styling
  - **Objective**: Verify `Button` renders `primary`, `secondary`, and `ghost` variants with correct classes and click handling.
  - **Inputs**: Mount `Button` with `variant="primary"`, `variant="secondary"`, `variant="ghost"`.
  - **Actions**: Render component, inspect DOM class list, trigger `click` event.
  - **Expected Assertions**:
    - `variant="primary"` includes `bg-[#C6FF33]` and `text-black`.
    - `variant="secondary"` includes `border border-[#7D39EB]` and `text-white`.
    - `variant="ghost"` includes `bg-transparent` and `hover:text-[#C6FF33]`.
    - Clicking the button executes the `onClick` spy callback.
    - Includes visible focus ring class `focus-visible:ring-2 focus-visible:ring-[#C6FF33]`.
  - **Failure Condition**: Incorrect variant classes or failing click trigger.

- **`T1-F02-02`**: Badge Component Styling & Typography
  - **Objective**: Verify `Badge` renders variants (`lime`, `violet`, `dark`, `outline`) with uppercase tracking.
  - **Inputs**: Mount `Badge` with `variant="lime"` and text `"MOST POPULAR"`.
  - **Actions**: Inspect element tag, class list, and text content.
  - **Expected Assertions**:
    - Text content equals `"MOST POPULAR"`.
    - Has uppercase font utility `uppercase font-bold tracking-wider`.
    - `variant="lime"` includes `bg-[#C6FF33]/20` and `text-[#C6FF33]` or `border-[#C6FF33]`.
  - **Failure Condition**: Badge renders lowercase, missing variant styles.

- **`T1-F02-03`**: SectionHeader Eyebrow, H2 Title, and Subtitle Hierarchy
  - **Objective**: Verify `SectionHeader` renders semantic heading structure with uppercase eyebrow tag and subtitle.
  - **Inputs**: Mount `SectionHeader` with `eyebrow="PROGRAMS"`, `title="SCULPTED FOR PERFORMANCE"`, `description="Four distinct disciplines."`.
  - **Actions**: Inspect virtual DOM elements.
  - **Expected Assertions**:
    - Eyebrow element renders text `"PROGRAMS"` with `#C6FF33` lime color styling.
    - Title renders in an `<h2>` element containing `"SCULPTED FOR PERFORMANCE"` with `text-white`.
    - Description renders in a `<p>` tag containing `"Four distinct disciplines."` with `text-zinc-400`.
  - **Failure Condition**: Missing `<h2>` tag or wrong text hierarchy.

- **`T1-F02-04`**: TiltCard 3D Perspective Container
  - **Objective**: Verify `TiltCard` renders with 3D CSS perspective and handles mouse coordinate updates.
  - **Inputs**: Mount `TiltCard` with sample child `<div>Card Content</div>`.
  - **Actions**: Inspect container style properties and simulate `mousemove` event at `offsetX: 200, offsetY: 150`.
  - **Expected Assertions**:
    - Container style contains `perspective: 1000px` (or `perspective-1000`).
    - Inner card container receives dynamic 3D transform (e.g. `rotateX(...) rotateY(...)`).
    - Child node `"Card Content"` is present in the DOM.
  - **Failure Condition**: Perspective missing or transform fails to calculate.

- **`T1-F02-05`**: LightboxModal Accessible Dialog & Dismissal
  - **Objective**: Verify `LightboxModal` mounts as an accessible modal dialog and dismisses on close button click.
  - **Inputs**: Mount `LightboxModal` with `isOpen={true}`, `onClose={onCloseSpy}`.
  - **Actions**: Check ARIA attributes and simulate click on the close button.
  - **Expected Assertions**:
    - Root modal container has `role="dialog"` and `aria-modal="true"`.
    - Close button has accessible label (`aria-label="Close modal"`).
    - Simulating click on close button invokes `onCloseSpy` exactly once.
  - **Failure Condition**: Missing `role="dialog"` or close button does not fire callback.

#### Tier 2: Boundary, Corner & Negative Cases (5 Tests)
- **`T2-F02-01`**: Button Disabled and Loading States (Negative / Boundary)
  - **Objective**: Verify `Button` suppresses clicks and announces disabled state when `disabled={true}` or `isLoading={true}`.
  - **Inputs**: Mount `Button` with `disabled={true}`, `onClick={spy}`.
  - **Actions**: Trigger click event and keyboard `Enter` / `Space` keypress.
  - **Expected Assertions**:
    - Button has `disabled` attribute or `aria-disabled="true"`.
    - Has `pointer-events-none` and `opacity-50` styling.
    - `spy` callback count remains 0.
  - **Failure Condition**: Click or keypress invokes callback while disabled.

- **`T2-F02-02`**: TiltCard Touch Device Bypass (Boundary)
  - **Objective**: Verify 3D tilt calculations are completely bypassed when `(pointer: coarse)` matches.
  - **Inputs**: Mock `window.matchMedia('(pointer: coarse)').matches = true`. Mount `TiltCard`.
  - **Actions**: Dispatch `mousemove` and `touchmove` events.
  - **Expected Assertions**:
    - Transform property remains `none` or `rotateX(0deg) rotateY(0deg)`.
    - No computational stutter or unhandled touch event errors.
  - **Failure Condition**: 3D tilt angles calculated on touch screen devices.

- **`T2-F02-03`**: TiltCard Prefers-Reduced-Motion Override (Boundary)
  - **Objective**: Verify 3D tilt disables motion when `prefers-reduced-motion: reduce` is active.
  - **Inputs**: Mock `window.matchMedia('(prefers-reduced-motion: reduce)').matches = true`. Mount `TiltCard`.
  - **Actions**: Dispatch `mousemove` events across all corners.
  - **Expected Assertions**:
    - 3D rotation transform is forced to identity `rotateX(0deg) rotateY(0deg)`.
    - Card renders with static subtle border highlight without motion.
  - **Failure Condition**: Rotation occurs despite user's reduced-motion preference.

- **`T2-F02-04`**: LightboxModal Focus Trap & Escape Key (Boundary)
  - **Objective**: Verify keyboard focus is locked within `LightboxModal` and `Escape` key closes the modal.
  - **Inputs**: Mount `LightboxModal` with `isOpen={true}`, `onClose={onCloseSpy}`. Focus first interactive element.
  - **Actions**: Dispatch `Tab` key on last interactive element; dispatch `Escape` keydown event.
  - **Expected Assertions**:
    - Tabbing past the last interactive element wraps focus back to the first interactive element.
    - Pressing `Escape` invokes `onCloseSpy` immediately.
  - **Failure Condition**: Focus leaks to background page or `Escape` key does not close modal.

- **`T2-F02-05`**: SectionHeader Extreme String Length & Null Eyebrow (Corner)
  - **Objective**: Verify `SectionHeader` renders cleanly when `eyebrow` is `undefined` and `title` contains a 300-character string.
  - **Inputs**: Mount `SectionHeader` with `title="A".repeat(300)`, `eyebrow={undefined}`.
  - **Actions**: Inspect rendered DOM.
  - **Expected Assertions**:
    - No eyebrow DOM element is rendered (no empty tag or undefined text).
    - Long title wraps with `break-words` without causing horizontal overflow.
  - **Failure Condition**: Throws error on missing eyebrow or text clips horizontally.

---

### Feature 3: Floating Navbar & Mobile Drawer

#### Tier 1: Feature Coverage (5 Tests)
- **`T1-F03-01`**: Desktop Floating Pill Navbar Structure & Links
  - **Objective**: Verify `Navbar` renders fixed at top with glass styling and all 7 section links.
  - **Inputs**: Mount `Navbar` at desktop viewport (1280px).
  - **Actions**: Inspect DOM elements and navigation link `href` attributes.
  - **Expected Assertions**:
    - Navbar has classes `fixed top-5 inset-x-0 mx-auto rounded-full bg-black/75 backdrop-blur-xl border border-white/10`.
    - Contains links with exact anchors: `#programs`, `#about`, `#trainers`, `#membership`, `#gallery`, `#testimonials`, `#contact`.
    - Contains primary CTA button "Join Now" linking to `#membership` or `#contact`.
  - **Failure Condition**: Missing required navigation links or wrong anchor values.

- **`T1-F03-02`**: Dynamic Scroll Blur & Compact State
  - **Objective**: Verify navbar transitions to compact state with intensified blur when page is scrolled past 40px.
  - **Inputs**: Simulate scroll event with `window.scrollY = 60`.
  - **Actions**: Trigger scroll listener.
  - **Expected Assertions**:
    - Navbar container adds compact padding class `py-2.5` (vs initial `py-4`).
    - Background opacity increases to `bg-black/90`.
    - Subtle violet rim border class `border-[#7D39EB]/30` or `shadow-lg` is applied.
  - **Failure Condition**: Navbar remains in initial state after scroll event.

- **`T1-F03-03`**: ScrollSpy Active Section Highlighting
  - **Objective**: Verify active section link is visually highlighted with Acid Lime `#C6FF33` pill indicator.
  - **Inputs**: Trigger IntersectionObserver callback simulating `#trainers` section in view.
  - **Actions**: Inspect class list of `#trainers` link.
  - **Expected Assertions**:
    - `#trainers` link receives `text-[#C6FF33]` or `text-white` with active lime badge/dot.
    - Has `aria-current="page"` attribute.
    - Other links remain muted (`text-zinc-400`).
  - **Failure Condition**: Multiple links marked active or active state fails to update.

- **`T1-F03-04`**: Mobile Hamburger Toggle & Morphing Icon
  - **Objective**: Verify hamburger button appears at mobile viewport (<768px) and toggles drawer open state.
  - **Inputs**: Set viewport width to 375px. Mount `Navbar`.
  - **Actions**: Inspect hamburger button attributes; click hamburger button.
  - **Expected Assertions**:
    - Hamburger button is visible with `aria-label="Toggle navigation menu"` and `aria-expanded="false"`.
    - Clicking button toggles `aria-expanded="true"`.
    - Mobile drawer element transitions from `translate-x-full` to `translate-x-0`.
  - **Failure Condition**: Hamburger button missing on mobile or does not update `aria-expanded`.

- **`T1-F03-05`**: Mobile Drawer Link Navigation & Auto-Close
  - **Objective**: Verify clicking any navigation link inside open mobile drawer triggers scroll and closes drawer.
  - **Inputs**: Open mobile drawer (`isOpen = true`). Click link to `#about`.
  - **Actions**: Simulate link click.
  - **Expected Assertions**:
    - Drawer state updates to `isOpen = false`.
    - Drawer element transitions back to `translate-x-full`.
    - Scroll target `#about` is triggered.
  - **Failure Condition**: Drawer remains open after navigation link click.

#### Tier 2: Boundary, Corner & Negative Cases (5 Tests)
- **`T2-F03-01`**: Mobile Drawer Body Scroll Lock (Boundary)
  - **Objective**: Verify `document.body` scroll is locked when mobile drawer is open, and restored upon close.
  - **Inputs**: Toggle mobile drawer open, then closed.
  - **Actions**: Inspect `document.body.style.overflow`.
  - **Expected Assertions**:
    - When `isOpen === true`: `document.body.style.overflow === 'hidden'`.
    - When `isOpen === false`: `document.body.style.overflow` is restored to `''` or `'unset'`.
  - **Failure Condition**: Body scroll is not locked while drawer is open, or remains locked after drawer closes.

- **`T2-F03-02`**: Mobile Drawer Escape Key & Focus Restoration (Boundary)
  - **Objective**: Verify pressing `Escape` closes mobile drawer and restores focus to hamburger toggle button.
  - **Inputs**: Open mobile drawer, focus an inner navigation link.
  - **Actions**: Dispatch `Escape` keydown event.
  - **Expected Assertions**:
    - Drawer closes immediately (`isOpen = false`).
    - Active focused element (`document.activeElement`) returns to the hamburger button.
  - **Failure Condition**: Drawer stays open on `Escape` or focus is lost to `document.body`.

- **`T2-F03-03`**: Rapid Hamburger Toggle Spam (Corner)
  - **Objective**: Verify rapidly toggling hamburger button 10 times in 200ms does not produce race condition or stuck state.
  - **Inputs**: Trigger 10 alternating click events at 20ms intervals.
  - **Actions**: Inspect final state.
  - **Expected Assertions**:
    - Final state is deterministically `isOpen === false` (even number of clicks).
    - `aria-expanded === "false"`.
    - No orphaned backdrop or lingering animation classes.
  - **Failure Condition**: Component state gets out of sync with DOM attributes.

- **`T2-F03-04`**: Screen Resize Transition from Mobile to Desktop (Boundary)
  - **Objective**: Verify resizing browser from mobile (375px) to desktop (1200px) while drawer is open cleans up drawer state.
  - **Inputs**: Open drawer at 375px; dispatch `window.resize` event with `window.innerWidth = 1200`.
  - **Actions**: Observe component response.
  - **Expected Assertions**:
    - Mobile drawer closes or hides (`hidden` or `translate-x-full`).
    - Body scroll lock is removed (`overflow !== 'hidden'`).
    - Desktop nav links are visible.
  - **Failure Condition**: Drawer overlay remains visible or body remains locked on desktop.

- **`T2-F03-05`**: ScrollSpy Rapid Jumping & Boundary Zero (Corner)
  - **Objective**: Verify ScrollSpy handles `scrollY = 0` (top edge) and rapid jumping between non-adjacent anchors.
  - **Inputs**: Dispatch scroll events at `scrollY = 0`, then jump directly to bottom anchor (`#contact`).
  - **Actions**: Check active link indicator.
  - **Expected Assertions**:
    - At `scrollY = 0`: Hero or no inner section link is marked active.
    - At `#contact`: Exactly one link (`#contact`) has active indicator.
    - No runtime crash or desynchronized array index.
  - **Failure Condition**: Multiple links retain active class or app throws out-of-bounds error.

---

### Feature 4: Training Programs Section

#### Tier 1: Feature Coverage (5 Tests)
- **`T1-F04-01`**: Render 4 Core Training Disciplines
  - **Objective**: Verify `ProgramsSection` renders cards for all 4 required disciplines from `ORIGINAL_REQUEST.md`.
  - **Inputs**: Mount `ProgramsSection` with data from `src/config/programs.ts`.
  - **Actions**: Query all program card heading elements.
  - **Expected Assertions**:
    - Card 1: "Strength & Powerlifting" (or Strength Training) is present.
    - Card 2: "HIIT & Conditioning" (or Metabolic Conditioning) is present.
    - Card 3: "Bespoke 1-on-1 Personal Training" (or Personal Training) is present.
    - Card 4: "Functional Athletics & Mobility" (or Functional Fitness) is present.
  - **Failure Condition**: Fewer than 4 programs rendered or missing any core discipline.

- **`T1-F04-02`**: Category Filter Tabs Functionality
  - **Objective**: Verify clicking filter tabs dynamically filters displayed programs.
  - **Inputs**: Mount `ProgramsSection`. Available tabs: "All Disciplines", "Strength", "Conditioning", "Personal Coaching", "Functional Movement".
  - **Actions**: Click "Strength" filter tab.
  - **Expected Assertions**:
    - Only programs matching category `"strength"` are visible in DOM.
    - Active filter tab receives highlighted lime styling (`bg-[#C6FF33] text-black`).
    - Clicking "All Disciplines" restores full 4-card list.
  - **Failure Condition**: Filter fails to update visible card list or wrong category items displayed.

- **`T1-F04-03`**: Program Card Metadata & Intensity Meter
  - **Objective**: Verify each program card renders intensity rating meter, duration, and deliverable bullet points.
  - **Inputs**: Inspect individual program card DOM.
  - **Actions**: Check child elements for intensity pips, session duration, and deliverables.
  - **Expected Assertions**:
    - Contains visual intensity meter with 1 to 5 pips/bars.
    - Displays duration label (e.g. `"60 MIN"`, `"75 MIN"`).
    - Renders an unordered list (`<ul>`) with at least 3 deliverable feature items.
  - **Failure Condition**: Missing intensity meter or deliverables list.

- **`T1-F04-04`**: Syllabus Modal Trigger & Detailed Content
  - **Objective**: Verify clicking "View Syllabus" button opens modal with comprehensive curriculum breakdown.
  - **Inputs**: Click "View Syllabus" on "Strength & Powerlifting" card.
  - **Actions**: Query modal container and content.
  - **Expected Assertions**:
    - Modal opens with `role="dialog"`.
    - Modal heading displays `"Strength & Powerlifting Syllabus"`.
    - Renders detailed curriculum breakdown (e.g. Periodization, Movement Screens, Recovery protocols).
  - **Failure Condition**: Modal does not open or lacks detailed curriculum content.

- **`T1-F04-05`**: Syllabus Modal Dismissal
  - **Objective**: Verify syllabus modal closes on close button click or backdrop press.
  - **Inputs**: Open syllabus modal; click close button.
  - **Actions**: Trigger click event.
  - **Expected Assertions**:
    - Modal is removed from DOM or has `hidden` state.
    - Focus returns to the "View Syllabus" trigger button.
  - **Failure Condition**: Modal stays open or focus is lost.

#### Tier 2: Boundary, Corner & Negative Cases (5 Tests)
- **`T2-F04-01`**: Empty Filter Result Fallback (Corner)
  - **Objective**: Verify section displays friendly empty state when a filter produces zero matches.
  - **Inputs**: Trigger filter state with category `"nonexistent-category"`.
  - **Actions**: Inspect rendered DOM.
  - **Expected Assertions**:
    - Displays friendly notice: `"No training programs found for this category."`
    - Does NOT crash, throw `TypeError`, or leave a blank empty screen.
  - **Failure Condition**: Component crashes or renders empty void without user guidance.

- **`T2-F04-02`**: Syllabus Modal Deep Keyboard Focus Trap (Boundary)
  - **Objective**: Verify tabbing within syllabus modal remains trapped inside modal interactive elements.
  - **Inputs**: Open syllabus modal.
  - **Actions**: Press `Tab` repeatedly through all focusable modal elements.
  - **Expected Assertions**:
    - Focus wraps from the last interactive element back to the close button.
    - Background page content cannot receive focus while modal is open.
  - **Failure Condition**: Focus escapes modal to background page.

- **`T2-F04-03`**: Rapid Sequential Modal Triggering (Corner)
  - **Objective**: Verify rapidly clicking "View Syllabus" across different program cards updates modal content without collision.
  - **Inputs**: Click "View Syllabus" on Card 1, then immediately on Card 2, then Card 3.
  - **Actions**: Check active modal content.
  - **Expected Assertions**:
    - Modal reflects Card 3 data accurately.
    - Exactly one modal instance is present in the DOM (no duplicated modal backdrops).
  - **Failure Condition**: Multiple stacked backdrops or stale content displayed.

- **`T2-F04-04`**: Intensity Level Boundary Clamping (Boundary)
  - **Objective**: Verify intensity rating gracefully clamps values outside [1, 5] range.
  - **Inputs**: Pass mock program with `intensity: 0`, and another with `intensity: 10`.
  - **Actions**: Render program cards.
  - **Expected Assertions**:
    - `intensity: 0` clamps to minimum 1 pip.
    - `intensity: 10` clamps to maximum 5 pips.
    - No visual layout breakage or NaN pip count.
  - **Failure Condition**: Renders 0 pips or 10 pips overflowing card container.

- **`T2-F04-05`**: Missing Optional Syllabus Fields (Negative)
  - **Objective**: Verify program card renders cleanly when optional fields (`prerequisites`, `equipmentNotes`) are null or undefined.
  - **Inputs**: Program data object `{ id: 'test', title: 'Test Program', syllabus: null }`.
  - **Actions**: Render component.
  - **Expected Assertions**:
    - Renders without throwing `TypeError: cannot read property of null`.
    - "View Syllabus" button is either disabled or opens modal with "Syllabus details available upon consultation."
  - **Failure Condition**: Unhandled runtime crash on null syllabus.

---

### Feature 5: About the Gym Bento Grid

#### Tier 1: Feature Coverage (5 Tests)
- **`T1-F05-01`**: Bento Grid 4 Core Pillars
  - **Objective**: Verify `AboutSection` renders all 4 required pillars from `ORIGINAL_REQUEST.md`: Equipment, Trainers, Facilities, Community.
  - **Inputs**: Mount `AboutSection`.
  - **Actions**: Query pillar card headings.
  - **Expected Assertions**:
    - Pillar 1: "Olympic-Grade Equipment" (or Equipment).
    - Pillar 2: "Certified Performance Coaches" (or Expert Trainers).
    - Pillar 3: "Contrast Recovery Suites" (or Facilities / Recovery).
    - Pillar 4: "Elite Community Culture" (or Community).
  - **Failure Condition**: Any of the 4 core pillars is missing.

- **`T1-F05-02`**: Asymmetrical Bento Grid Column Spanning (Desktop)
  - **Objective**: Verify desktop layout uses an asymmetrical bento grid (e.g. 8-col / 4-col spanning).
  - **Inputs**: Inspect CSS classes of bento grid cards at desktop breakpoint (`lg:`).
  - **Actions**: Check grid classes on container and card items.
  - **Expected Assertions**:
    - Grid container has `grid grid-cols-1 md:grid-cols-12` (or equivalent 12-column bento system).
    - Pillar 1 (Equipment) has `md:col-span-8` (or `lg:col-span-8`).
    - Pillar 2 (Coaches) has `md:col-span-4` (or `lg:col-span-4`).
    - Pillar 3 (Recovery) has `md:col-span-4` (or `lg:col-span-4`).
    - Pillar 4 (Community) has `md:col-span-8` (or `lg:col-span-8`).
  - **Failure Condition**: Flat uniform grid without bento asymmetry.

- **`T1-F05-03`**: Quantitative Metric Stat Callouts
  - **Objective**: Verify all 4 required quantitative metrics are rendered with high contrast.
  - **Inputs**: Query stat elements in `AboutSection`.
  - **Actions**: Check text content of metric numbers and labels.
  - **Expected Assertions**:
    - Metric 1: `"15,000 SQ FT"` (Facility scale).
    - Metric 2: `"24/7/365"` (Biometric access).
    - Metric 3: `"50+"` (Power & Olympic stations).
    - Metric 4: `"99.2%"` (Member goal attainment rate).
  - **Failure Condition**: Missing any required quantitative metric.

- **`T1-F05-04`**: Dark Industrial Surface & Border Tokens
  - **Objective**: Verify bento cards apply dark surface tokens and subtle violet/white borders.
  - **Inputs**: Inspect computed styles / classes of bento card shells.
  - **Actions**: Check surface background and border classes.
  - **Expected Assertions**:
    - Cards have dark background class `bg-zinc-950/80` or `bg-black/90`.
    - Cards have border class `border border-white/10`.
    - Cards have hover transition to violet or lime border (`hover:border-[#7D39EB]/50` or `hover:border-[#C6FF33]/50`).
  - **Failure Condition**: Unstyled cards or bright white card backgrounds.

- **`T1-F05-05`**: Mobile Responsive Single-Column Stacking
  - **Objective**: Verify bento grid collapses cleanly to a single column on mobile (<768px).
  - **Inputs**: Set viewport width to 375px.
  - **Actions**: Inspect layout computed styles.
  - **Expected Assertions**:
    - Cards stack vertically in a single column (`grid-cols-1`).
    - No card element exceeds 375px width.
    - Zero horizontal overflow (`scrollWidth <= clientWidth`).
  - **Failure Condition**: Multi-column overlap or horizontal clipping on mobile.

#### Tier 2: Boundary, Corner & Negative Cases (5 Tests)
- **`T2-F05-01`**: Zero Horizontal Overflow at 320px (Boundary)
  - **Objective**: Verify bento grid section renders with zero horizontal overflow at minimum 320px viewport width.
  - **Inputs**: Set viewport width to 320px. Mount `AboutSection`.
  - **Actions**: Check `section.scrollWidth` vs `section.clientWidth`.
  - **Expected Assertions**:
    - `section.scrollWidth <= 320`.
    - All card padding and text wrap cleanly within 320px boundary.
  - **Failure Condition**: Horizontal scrollbar appears or `scrollWidth > 320`.

- **`T2-F05-02`**: Dynamic Metric String Localization (Corner)
  - **Objective**: Verify metric component handles localized number strings (e.g. `"1,390 m²"`, `"100+"`) without layout distortion.
  - **Inputs**: Pass custom metric objects with varying string lengths.
  - **Actions**: Inspect metric card rendering.
  - **Expected Assertions**:
    - Text baseline remains aligned.
    - Metric value and unit wrap or scale without clipping adjacent labels.
  - **Failure Condition**: Text overlaps card borders or causes wrapping layout shift.

- **`T2-F05-03`**: High Contrast Mode Compliance (Boundary)
  - **Objective**: Verify bento cards adapt appropriately when `@media (prefers-contrast: more)` is active.
  - **Inputs**: Mock `window.matchMedia('(prefers-contrast: more)').matches = true`.
  - **Actions**: Inspect card styles.
  - **Expected Assertions**:
    - Card surface opacity increases to solid 100% black (`#000000`).
    - Border contrast increases to full opacity white (`#FFFFFF`) or lime (`#C6FF33`).
  - **Failure Condition**: Low-contrast borders retained in high contrast mode.

- **`T2-F05-04`**: Large Content Dynamic Expansion (Edge Case)
  - **Objective**: Verify that injecting a 500-word paragraph into a bento card expands card height gracefully without breaking grid flow.
  - **Inputs**: Inject 500-character description into Pillar 1.
  - **Actions**: Inspect grid layout and sibling card positions.
  - **Expected Assertions**:
    - Grid auto-rows expand to accommodate content height.
    - Sibling cards in the same row align cleanly.
    - No overlapping elements.
  - **Failure Condition**: Text overflows card boundaries or overlaps adjacent cards.

- **`T2-F05-05`**: Screen Reader Accessibility for Metrics (Boundary)
  - **Objective**: Verify quantitative metrics have accessible screen reader announcements.
  - **Inputs**: Query metric elements.
  - **Actions**: Inspect `aria-label` or `<span className="sr-only">` helper text.
  - **Expected Assertions**:
    - Metric `"15,000 SQ FT"` has accessible label explaining full context (e.g. `"15,000 square feet engineered training compound"`).
    - Metric `"24/7/365"` explains `"24 hours a day, 7 days a week biometric access"`.
  - **Failure Condition**: Screen reader announces only isolated numbers without context.

---

### Feature 6: Trainers Section & 3D Tilt Cards

#### Tier 1: Feature Coverage (5 Tests)
- **`T1-F06-01`**: Render 3 Demo Trainer Profiles
  - **Objective**: Verify `TrainersSection` renders all 3 coach profiles from specifications.
  - **Inputs**: Mount `TrainersSection` with data from `src/config/trainers.ts`.
  - **Actions**: Query trainer profile card headings.
  - **Expected Assertions**:
    - Trainer 1: Marcus "Vanguard" Vance (Head of Strength & Powerlifting).
    - Trainer 2: Elena "Apex" Rostova (Director of Functional Athletics & Mobility).
    - Trainer 3: Jaxson "Forge" Reed (Lead Metabolic Conditioning & Endurance Architect).
  - **Failure Condition**: Fewer than 3 trainers rendered or missing required coach names.

- **`T1-F06-02`**: Trainer Credentials & Philosophy Quotes
  - **Objective**: Verify each trainer card displays credentials, specialties, and personal philosophy.
  - **Inputs**: Inspect individual trainer card DOM nodes.
  - **Actions**: Check certifications badges and blockquote elements.
  - **Expected Assertions**:
    - Marcus Vance displays `"CSCS"`, `"USAW Level 2"`.
    - Elena Rostova displays `"DPT"`, `"FMS"`.
    - Jaxson Reed displays `"NASM-PES"`, `"Kettlebell Master"`.
    - Each card includes a quote element (`<blockquote>` or `<p className="italic">`).
  - **Failure Condition**: Missing credentials badges or quotes.

- **`T1-F06-03`**: 3D Tilt Physics Calculations on Pointer Move
  - **Objective**: Verify moving pointer over trainer card calculates dynamic `rotateX` and `rotateY` transforms.
  - **Inputs**: Render `TiltCard` with dimensions 300x400px. Dispatch `mousemove` at `clientX: 75, clientY: 100` (top-left quadrant).
  - **Actions**: Inspect inline style transform attribute on inner container.
  - **Expected Assertions**:
    - Transform contains `rotateX(...)` and `rotateY(...)`.
    - Signs of rotation match physics (tilts inward toward cursor position).
    - Scale is slightly elevated (e.g. `scale3d(1.02, 1.02, 1.02)`).
  - **Failure Condition**: Transform does not update or calculation has wrong mathematical sign.

- **`T1-F06-04`**: Dynamic Radial Sheen Highlight
  - **Objective**: Verify pointer coordinates update a dynamic radial gradient highlight on hover.
  - **Inputs**: Dispatch `mousemove` at `(x: 50%, y: 50%)`.
  - **Actions**: Inspect style of overlay sheen layer.
  - **Expected Assertions**:
    - Sheen element background contains `radial-gradient(circle at 50% 50%, rgba(198, 255, 51, ...) ...)`.
    - Sheen opacity increases from 0 to visible on mouse enter.
  - **Failure Condition**: Sheen position static or missing lime highlight.

- **`T1-F06-05`**: Consultation CTA Action Trigger
  - **Objective**: Verify clicking "Book Consultation" or "Train with [Coach]" triggers navigation to contact form with coach specialty pre-selected.
  - **Inputs**: Click consultation button on Marcus Vance's card.
  - **Actions**: Trigger click event.
  - **Expected Assertions**:
    - Navigates or smooth-scrolls to `#contact`.
    - Target contact form receives coach reference or pre-selects `"personal-training"`.
  - **Failure Condition**: Button click produces no action or fails to scroll.

#### Tier 2: Boundary, Corner & Negative Cases (5 Tests)
- **`T2-F06-01`**: Tilt Angle Boundary Clamping (Boundary)
  - **Objective**: Verify rotation angles are strictly clamped to maximum ±15 degrees even with extreme pointer coordinates.
  - **Inputs**: Dispatch mousemove event at extreme coordinates `(clientX: -500, clientY: -500)`.
  - **Actions**: Calculate resulting `rotateX` and `rotateY`.
  - **Expected Assertions**:
    - `Math.abs(rotateX) <= 15`.
    - `Math.abs(rotateY) <= 15`.
    - Card does not flip over or distort.
  - **Failure Condition**: Rotation angle exceeds ±15 degrees.

- **`T2-F06-02`**: Mouse Leave Reset to Neutral (Corner)
  - **Objective**: Verify card smoothly resets to neutral planar orientation when pointer leaves card bounds.
  - **Inputs**: Hover card to produce active tilt; dispatch `mouseleave` event.
  - **Actions**: Inspect transform style.
  - **Expected Assertions**:
    - Transform resets to `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)` (or `none`).
    - Sheen opacity returns to 0.
  - **Failure Condition**: Card remains tilted or stuck at last mouse coordinates after pointer leaves.

- **`T2-F06-03`**: Touch Device Coarse Pointer Fallback (Boundary)
  - **Objective**: Verify tilt physics are disabled on touch devices with coarse pointers.
  - **Inputs**: Mock `window.matchMedia('(pointer: coarse)').matches = true`. Mount trainer card.
  - **Actions**: Dispatch touch events.
  - **Expected Assertions**:
    - Card does not apply 3D rotation transform.
    - Relies on touch-safe CSS `:active` scale/opacity change.
  - **Failure Condition**: 3D tilt triggers during mobile touch scrolling.

- **`T2-F06-04`**: Prefers Reduced Motion Compliance (Boundary)
  - **Objective**: Verify tilt is locked when `prefers-reduced-motion` is enabled.
  - **Inputs**: Mock `window.matchMedia('(prefers-reduced-motion: reduce)').matches = true`.
  - **Actions**: Dispatch mousemove across card.
  - **Expected Assertions**:
    - Transform remains `rotateX(0deg) rotateY(0deg)`.
    - Card displays subtle static border highlight without movement.
  - **Failure Condition**: Motion occurs despite reduced-motion preference.

- **`T2-F06-05`**: Broken Image Fallback to Stylized Monogram (Negative)
  - **Objective**: Verify card renders stylized SVG monogram fallback when trainer photo URL fails to load.
  - **Inputs**: Set image `src = "/images/trainers/invalid-404.jpg"`.
  - **Actions**: Dispatch `error` event on `<img>` element.
  - **Expected Assertions**:
    - Card renders SVG silhouette / monogram with trainer initials (e.g. `"MV"` for Marcus Vance).
    - Card layout, credentials, and CTA button remain intact.
  - **Failure Condition**: Broken image icon displayed or card layout collapses.

---

### Feature 7: Membership Experience

#### Tier 1: Feature Coverage (5 Tests)
- **`T1-F07-01`**: Render Three Tiered Plans (Starter, Pro, Elite)
  - **Objective**: Verify `MembershipSection` renders 3 distinct tiered cards with correct pricing, taglines, and inclusions.
  - **Inputs**: Mount `MembershipSection` with data from `src/config/membership.ts`.
  - **Actions**: Query membership card elements.
  - **Expected Assertions**:
    - Card 1: Starter Tier ($79/mo) with tagline "Foundational Strength".
    - Card 2: Pro Tier ($149/mo) with tagline "Unrestricted Performance".
    - Card 3: Elite Tier ($249/mo) with tagline "VIP Biomechanical Mastery".
  - **Failure Condition**: Any tier missing or incorrect pricing/tagline.

- **`T1-F07-02`**: Pro Tier Visual Prominence & "MOST POPULAR" Badge
  - **Objective**: Verify the Pro tier is visually emphasized as the recommended plan.
  - **Inputs**: Inspect Pro tier card DOM and classes.
  - **Actions**: Check badge, border, and CTA styling.
  - **Expected Assertions**:
    - Contains badge `"MOST POPULAR"` in `#C6FF33` Acid Lime.
    - Card perimeter has lime glowing border class `border-[#C6FF33]`.
    - CTA button has high-voltage lime styling `bg-[#C6FF33] text-black font-bold`.
  - **Failure Condition**: Pro tier lacks visual distinction or badge.

- **`T1-F07-03`**: Monthly vs Annual Billing Toggle & 20% Discount
  - **Objective**: Verify toggling billing switcher dynamically updates displayed prices with 20% discount.
  - **Inputs**: Mount `MembershipSection` in default monthly mode. Toggle to annual billing.
  - **Actions**: Click annual billing toggle switch.
  - **Expected Assertions**:
    - Starter price updates from `$79` to `$63` / month.
    - Pro price updates from `$149` to `$119` / month.
    - Elite price updates from `$249` to `$199` / month.
    - Annual savings pill ("Save 20%") is highlighted.
    - Toggle button updates `aria-checked="true"`.
  - **Failure Condition**: Prices fail to recalculate or discount is incorrect.

- **`T1-F07-04`**: Interactive Amenities Comparison Matrix
  - **Objective**: Verify amenities matrix renders 16 granular comparison rows across Starter, Pro, and Elite tiers.
  - **Inputs**: Query table/grid in comparison matrix.
  - **Actions**: Count feature comparison rows.
  - **Expected Assertions**:
    - Renders at least 16 granular amenity rows (e.g. 24/7 Access, Cold Plunge, Sauna, Personal Training, Guest Passes).
    - Displays checkmarks (`✓` or icon) and dashes (`—` or icon) indicating inclusion per tier.
    - Starter has restricted access (e.g. standard hours); Pro and Elite have 24/7 access.
  - **Failure Condition**: Fewer than 16 amenity rows or matrix fails to render.

- **`T1-F07-05`**: Tier CTA Preselection Integration
  - **Objective**: Verify clicking a tier CTA passes the selected tier to the contact form.
  - **Inputs**: Click "Claim Pro Access" on Pro card.
  - **Actions**: Simulate click.
  - **Expected Assertions**:
    - Viewport smooth-scrolls to `#contact`.
    - Contact form's `membershipInterest` dropdown pre-selects value `"pro"`.
  - **Failure Condition**: Click does not scroll or does not pre-select the chosen plan.

#### Tier 2: Boundary, Corner & Negative Cases (5 Tests)
- **`T2-F07-01`**: Dynamic Discount Rounding & Precision (Boundary)
  - **Objective**: Verify annual pricing calculation cleanly rounds fractional amounts without floating-point artifacts.
  - **Inputs**: Configure discount rate to 17.5% (resulting in `$79 * 0.825 = 65.175`).
  - **Actions**: Inspect formatted price output.
  - **Expected Assertions**:
    - Price formats as integer `$65` (or `$65.18`), never `$65.17500000000001`.
  - **Failure Condition**: Unformatted float string rendered in DOM.

- **`T2-F07-02`**: Comparison Matrix Collapsible State & Focus Order (Corner)
  - **Objective**: Verify collapsible matrix animates smoothly and preserves logical keyboard focus order.
  - **Inputs**: Mount comparison matrix with collapse trigger button.
  - **Actions**: Click collapse trigger (`aria-expanded="false"` to `"true"`).
  - **Expected Assertions**:
    - `aria-expanded` updates accurately.
    - Matrix content becomes accessible to screen readers and keyboard tab sequence.
    - Triggering collapse again hides matrix and restores focus to toggle button.
  - **Failure Condition**: Focus gets trapped or lost during collapse/expand transition.

- **`T2-F07-03`**: Keyboard Accessibility of Billing Switch (Boundary)
  - **Objective**: Verify billing toggle switch is accessible via keyboard `Space` and `Enter` keys.
  - **Inputs**: Focus billing toggle switch element via `Tab`.
  - **Actions**: Dispatch `keydown` with `key: ' '` (Space), then `key: 'Enter'`.
  - **Expected Assertions**:
    - Each keypress toggles billing state between monthly and annual.
    - `aria-checked` toggles between `"false"` and `"true"`.
  - **Failure Condition**: Toggle only responds to mouse clicks and ignores keyboard.

- **`T2-F07-04`**: Zero / Free Trial Pricing Config Resilience (Negative / Boundary)
  - **Objective**: Verify pricing component handles a zero-dollar tier (`price: 0`) gracefully.
  - **Inputs**: Mock tier with `price: 0`.
  - **Actions**: Render card.
  - **Expected Assertions**:
    - Formats display as `"Free"` or `"$0"` without `NaN` or division by zero error on discount calculations.
  - **Failure Condition**: Renders `NaN`, throws error, or crashes layout.

- **`T2-F07-05`**: Mobile Matrix Horizontal Scrolling / Sticky Headers (Boundary)
  - **Objective**: Verify comparison matrix adapts to narrow mobile viewports (<640px) without text truncation.
  - **Inputs**: Set viewport width to 360px.
  - **Actions**: Inspect comparison matrix table styles.
  - **Expected Assertions**:
    - Matrix container has `overflow-x-auto` or converts to mobile card accordion.
    - Feature row labels remain sticky or readable without overlapping tier columns.
  - **Failure Condition**: Columns compress into unreadable overlapping text.

---

### Feature 8: Gallery Experience

#### Tier 1: Feature Coverage (5 Tests)
- **`T1-F08-01`**: Curated 8-Photo Masonry Grid Rendering
  - **Objective**: Verify `GallerySection` renders 8 curated industrial gym photos in a responsive layout.
  - **Inputs**: Mount `GallerySection` with data from `src/config/gallery.ts`.
  - **Actions**: Query all image elements within the gallery container.
  - **Expected Assertions**:
    - Exactly 8 gallery photo items are rendered in default "All Views" state.
    - Each image container has responsive classes (`w-full`, rounded borders, overflow hidden).
  - **Failure Condition**: Fewer than 8 images rendered or layout broken.

- **`T1-F08-02`**: Category Filter Tabs
  - **Objective**: Verify clicking gallery category tabs filters images based on category tags.
  - **Inputs**: Available tabs: "All Views", "Lifting Platforms", "Cardio & Turf", "Recovery Suite", "Atmosphere".
  - **Actions**: Click "Recovery Suite" filter tab.
  - **Expected Assertions**:
    - Only images tagged with `"recovery"` remain visible.
    - Active tab receives highlighted lime pill styling.
    - Clicking "All Views" restores all 8 photos.
  - **Failure Condition**: Filter tab fails to filter images or wrong category shown.

- **`T1-F08-03`**: WebP Lazy Loading & Skeleton Placeholders
  - **Objective**: Verify gallery images configure lazy loading attributes and skeleton placeholder.
  - **Inputs**: Inspect `<img>` or `<Image>` attributes.
  - **Actions**: Check loading and decoding properties.
  - **Expected Assertions**:
    - Image elements have `loading="lazy"` and `decoding="async"`.
    - Image sources use optimized format (WebP or responsive `srcset`).
    - Skeleton shimmer placeholder class exists while image is loading.
  - **Failure Condition**: Images lack `loading="lazy"` or block initial page load.

- **`T1-F08-04`**: Click-to-Enlarge Lightbox Modal Open
  - **Objective**: Verify clicking any gallery photo opens the full-screen lightbox modal with image and counter.
  - **Inputs**: Click on the 3rd gallery thumbnail.
  - **Actions**: Trigger click event.
  - **Expected Assertions**:
    - Lightbox modal opens with `role="dialog"`.
    - Main modal image displays high-resolution source of 3rd photo.
    - Image counter displays `"3 / 8"` (or `"3 of 8"`).
  - **Failure Condition**: Lightbox does not open or shows wrong image.

- **`T1-F08-05`**: Lightbox Next and Previous Navigation
  - **Objective**: Verify clicking next/previous arrow buttons in lightbox cycles through images sequentially.
  - **Inputs**: Lightbox open at index 2 (Photo 3).
  - **Actions**: Click "Next" button; click "Previous" button.
  - **Expected Assertions**:
    - Clicking "Next" updates active image to index 3 (Photo 4) and counter to `"4 / 8"`.
    - Clicking "Previous" updates active image back to index 2 (Photo 3) and counter to `"3 / 8"`.
  - **Failure Condition**: Navigation buttons fail to update active image.

#### Tier 2: Boundary, Corner & Negative Cases (5 Tests)
- **`T2-F08-01`**: Keyboard Arrow Navigation & Escape Key (Boundary)
  - **Objective**: Verify lightbox navigates on `ArrowLeft` / `ArrowRight` and closes on `Escape`.
  - **Inputs**: Open lightbox at index 3.
  - **Actions**: Dispatch `keydown` with `key: 'ArrowRight'`; dispatch `keydown` with `key: 'Escape'`.
  - **Expected Assertions**:
    - `ArrowRight` advances image to index 4.
    - `Escape` closes the lightbox modal immediately.
  - **Failure Condition**: Keyboard arrows or `Escape` key ignored.

- **`T2-F08-02`**: Array Boundary Wrap-Around (Boundary)
  - **Objective**: Verify lightbox wraps around seamlessly at array boundaries (first to last, last to first).
  - **Inputs**: Open lightbox at index 0 (first image); click "Previous". Open at index 7 (last image); click "Next".
  - **Actions**: Trigger boundary navigation.
  - **Expected Assertions**:
    - Clicking "Previous" at index 0 wraps to index 7 (Photo 8).
    - Clicking "Next" at index 7 wraps to index 0 (Photo 1).
    - No array out-of-bounds error or undefined image source.
  - **Failure Condition**: Negative index error or blank image at boundaries.

- **`T2-F08-03`**: Broken Image 404 Fallback in Gallery (Negative)
  - **Objective**: Verify gallery item handles broken image URL by displaying branded placeholder without crashing grid.
  - **Inputs**: Provide image item with invalid source URL `/images/gallery/missing.jpg`.
  - **Actions**: Dispatch `error` event on thumbnail `<img>`.
  - **Expected Assertions**:
    - Error handler renders branded dark fallback box with camera icon.
    - Grid layout remains intact with proper aspect ratio container.
  - **Failure Condition**: Broken image icon corrupts masonry grid layout.

- **`T2-F08-04`**: Mobile Touch Swipe Navigation in Lightbox (Boundary)
  - **Objective**: Verify touch swipe left advances to next image, touch swipe right goes to previous image.
  - **Inputs**: Open lightbox on touch device.
  - **Actions**: Dispatch `touchstart` at `clientX: 300`, `touchend` at `clientX: 100` (swipe left of 200px).
  - **Expected Assertions**:
    - Advances to next image in sequence.
    - Swipe right (`touchstart: 100`, `touchend: 300`) goes to previous image.
  - **Failure Condition**: Touch swipe produces no navigation or triggers unwanted page scroll.

- **`T2-F08-05`**: Focus Restoration to Origin Thumbnail on Lightbox Close (Corner)
  - **Objective**: Verify keyboard focus returns to the exact thumbnail button that opened the lightbox.
  - **Inputs**: Focus 4th gallery thumbnail via keyboard `Tab`; press `Enter` to open lightbox; press `Escape` to close.
  - **Actions**: Observe `document.activeElement`.
  - **Expected Assertions**:
    - Upon lightbox close, `document.activeElement` is restored to the 4th thumbnail button.
  - **Failure Condition**: Focus jumps to `document.body` or resets to top of page.

---

### Feature 9: Testimonials Section

#### Tier 1: Feature Coverage (5 Tests)
- **`T1-F09-01`**: Render 3 Fictional Demo Testimonials
  - **Objective**: Verify `TestimonialsSection` renders all 3 specified client profiles from `ORIGINAL_REQUEST.md`.
  - **Inputs**: Mount `TestimonialsSection` with data from `src/config/testimonials.ts`.
  - **Actions**: Query testimonial author elements.
  - **Expected Assertions**:
    - Testimonial 1: David K. (Competitive Powerlifter & Software Architect).
    - Testimonial 2: Dr. Samantha M. (Orthopedic Surgeon & Marathon Finisher).
    - Testimonial 3: Liam T. (Tech Founder & Amateur Boxer).
  - **Failure Condition**: Fewer than 3 testimonials rendered or wrong client names.

- **`T1-F09-02`**: Mandatory Fictional Demo Disclaimer Badge
  - **Objective**: Verify prominent section disclaimer badge is rendered at the top of the section.
  - **Inputs**: Query badge element at top of `TestimonialsSection`.
  - **Actions**: Inspect text content and styling.
  - **Expected Assertions**:
    - Badge text contains: `FICTIONAL DEMO TESTIMONIALS — FOR SALES DEMONSTRATION PURPOSES`.
    - Badge is prominently positioned above testimonial cards.
    - Styled with visible accent border or badge styling.
  - **Failure Condition**: Mandatory demo badge is missing or altered.

- **`T1-F09-03`**: Inline Demo Profile Labels
  - **Objective**: Verify each testimonial card includes an explicit demo client indicator.
  - **Inputs**: Inspect individual testimonial card metadata.
  - **Actions**: Query inline profile labels.
  - **Expected Assertions**:
    - Each card displays `(Demo Client Profile)` or equivalent explicit fictional marker adjacent to client credentials.
  - **Failure Condition**: Testimonial card claims to be a real customer without demo label.

- **`T1-F09-04`**: 5-Star Visual Rating in Acid Lime
  - **Objective**: Verify each testimonial displays 5 star icons in `#C6FF33` Acid Lime.
  - **Inputs**: Query star icon elements within each card.
  - **Actions**: Count star icons and inspect fill/color classes.
  - **Expected Assertions**:
    - Each card renders exactly 5 star icons.
    - Stars have fill color `#C6FF33` (or `text-[#C6FF33] fill-[#C6FF33]`).
    - Contains accessibility label `aria-label="5 out of 5 stars"`.
  - **Failure Condition**: Missing stars, wrong star count, or incorrect color.

- **`T1-F09-05`**: Quantifiable Performance Metric Callouts
  - **Objective**: Verify each testimonial prominently displays the client's quantifiable achievement.
  - **Inputs**: Query metric badge elements within testimonial cards.
  - **Actions**: Check text content of metric callouts.
  - **Expected Assertions**:
    - David K. displays `"+55 LBS DEADLIFT PR"`.
    - Dr. Samantha M. displays `"SUB-3:15 MARATHON PR"`.
    - Liam T. displays `"12% VO2 MAX INCREASE"`.
  - **Failure Condition**: Missing performance metric callouts.

#### Tier 2: Boundary, Corner & Negative Cases (5 Tests)
- **`T2-F09-01`**: Integrity Mode Compliance Assertion (Negative)
  - **Objective**: Verify test suite fails immediately if any testimonial lacks the demo disclaimer marker.
  - **Inputs**: Inject test testimonial without `(Demo Client Profile)` label.
  - **Actions**: Run integrity validation rule.
  - **Expected Assertions**:
    - Validator flags compliance violation error: `"Demo disclaimer missing on testimonial"`.
  - **Failure Condition**: Unmarked testimonials pass validation silently.

- **`T2-F09-02`**: Rating Score Boundary Clamping (Boundary)
  - **Objective**: Verify rating renderer handles edge scores (0, fractional, >5) by clamping cleanly to [1, 5].
  - **Inputs**: Test cases: `rating: 0`, `rating: 4.8`, `rating: 7`.
  - **Actions**: Inspect rendered star count.
  - **Expected Assertions**:
    - `rating: 0` clamps to 1 star.
    - `rating: 7` clamps to 5 stars.
    - `rating: 4.8` renders 5 stars or 4 filled + 1 partial, with clean accessible text.
  - **Failure Condition**: Renders more than 5 stars or crashes with negative star count.

- **`T2-F09-03`**: Long Quote Card Height Equalization (Corner)
  - **Objective**: Verify cards in grid maintain equal heights when one testimonial contains a 400-character quote.
  - **Inputs**: Inject 400-character quote into Testimonial 1.
  - **Actions**: Inspect grid layout styling.
  - **Expected Assertions**:
    - Card container uses flex column layout (`h-full flex flex-col justify-between`).
    - Author and metric badges remain pinned to card bottom.
    - Adjacent cards match height without visual distortion.
  - **Failure Condition**: Cards have mismatched misaligned bottoms in row.

- **`T2-F09-04`**: Mobile Swipe / Carousel Edge Boundaries (Boundary)
  - **Objective**: Verify that if testimonials render as mobile swipe cards, swiping past boundaries does not displace container.
  - **Inputs**: Set viewport to 375px; attempt swipe left on last card.
  - **Actions**: Inspect scroll / translate position.
  - **Expected Assertions**:
    - Scroll position is bounded by container max-width; no blank space revealed.
  - **Failure Condition**: Uncontrolled horizontal offset reveals white/black void.

- **`T2-F09-05`**: Screen Reader Semantic Quote Markup (Boundary)
  - **Objective**: Verify testimonials use semantic `<blockquote>` markup with proper attribution.
  - **Inputs**: Query DOM hierarchy of testimonial card.
  - **Actions**: Inspect HTML tags.
  - **Expected Assertions**:
    - Quote text enclosed in semantic `<blockquote>`.
    - Author information enclosed in `<figcaption>` or `<cite>` element.
  - **Failure Condition**: Quotes rendered in plain `<div>` without semantic quotation markup.

---

### Feature 10: Final Conversion CTA & Footer

#### Tier 1: Feature Coverage (5 Tests)
- **`T1-F10-01`**: Cinematic Conversion Banner Headline & Styling
  - **Objective**: Verify `FinalCtaSection` renders full-bleed dark container with violet gradient mesh and headline.
  - **Inputs**: Mount `FinalCtaSection`.
  - **Actions**: Inspect section layout, background gradient, and headline text.
  - **Expected Assertions**:
    - Headline renders exact copy: `"FORGE YOUR LEGACY. STEP ONTO THE PLATFORM."`.
    - Container features `#7D39EB` violet gradient glow and `#C6FF33` lime accents.
    - Supporting copy mentions membership cap: `"Limited to 350 active memberships..."`.
  - **Failure Condition**: Missing headline, incorrect copy, or missing gradient background.

- **`T1-F10-02`**: Dual Action Conversion Buttons
  - **Objective**: Verify section renders primary CTA "Claim Complimentary 3-Day Pass" and secondary CTA "Direct WhatsApp Inquiry".
  - **Inputs**: Query action buttons in `FinalCtaSection`.
  - **Actions**: Check button text, icons, and styling.
  - **Expected Assertions**:
    - Primary CTA: `"Claim Complimentary 3-Day Pass"` with `#C6FF33` lime background and black text.
    - Secondary CTA: `"Direct WhatsApp Inquiry"` with border and WhatsApp icon.
  - **Failure Condition**: Missing either CTA button or wrong styling.

- **`T1-F10-03`**: Three Trust Assurance Pills
  - **Objective**: Verify all 3 trust assurance badges are rendered below the conversion action buttons.
  - **Inputs**: Query trust pills in `FinalCtaSection`.
  - **Actions**: Check text content of assurance pills.
  - **Expected Assertions**:
    - Pill 1: `"No Long-Term Lock-In Required"`.
    - Pill 2: `"Instant Biometric Keycard Setup"`.
    - Pill 3: `"Complimentary Biomechanical Assessment"`.
  - **Failure Condition**: Missing any of the 3 required assurance pills.

- **`T1-F10-04`**: Comprehensive Footer Operational Hours & Contacts
  - **Objective**: Verify `Footer` renders operating hours, facility location, and navigation links.
  - **Inputs**: Mount `Footer` with data from `src/config/site.ts`.
  - **Actions**: Query footer columns.
  - **Expected Assertions**:
    - Displays hours: `"Mon-Sun: 24/7 Biometric Access"`, `"Staffed Coaching: 06:00 - 22:00"`.
    - Displays facility location (e.g. `"IRONFORGE Compound, Industrial Quarter"`).
    - Contains links to all major website sections.
    - Displays brand emblem / logo lockup.
  - **Failure Condition**: Missing operational hours or contact columns.

- **`T1-F10-05`**: Mandatory Demo Mode Footer Disclaimer
  - **Objective**: Verify footer includes required legal demonstration disclaimer copy.
  - **Inputs**: Query legal disclaimer text at bottom of `Footer`.
  - **Actions**: Check text content.
  - **Expected Assertions**:
    - Text contains: `"IRONFORGE FITNESS is a fictional demonstration brand engineered by expert digital architects to showcase high-performance 3D commercial web solutions for gym and fitness enterprise owners."`
    - Has copyright notice with current year.
  - **Failure Condition**: Mandatory demo notice omitted from footer.

#### Tier 2: Boundary, Corner & Negative Cases (5 Tests)
- **`T2-F10-01`**: Primary CTA Smooth Scroll to Contact Form (Boundary)
  - **Objective**: Verify clicking "Claim Complimentary 3-Day Pass" scrolls to `#contact` and focuses the name field.
  - **Inputs**: Click primary CTA button in `FinalCtaSection`.
  - **Actions**: Monitor scroll target and active focus.
  - **Expected Assertions**:
    - Smooth scroll initiated toward `#contact`.
    - First input field (`fullName` / `name`) in contact form receives focus.
  - **Failure Condition**: Button click fails to scroll or fails to focus contact form.

- **`T2-F10-02`**: WhatsApp Secondary CTA URL Construction (Boundary)
  - **Objective**: Verify secondary WhatsApp CTA generates valid URL pointing to `wa.me` with encoded message.
  - **Inputs**: Click WhatsApp CTA button.
  - **Actions**: Inspect generated `href` attribute.
  - **Expected Assertions**:
    - `href` starts with `https://wa.me/`.
    - Contains URL-encoded query parameter `text=Hello%20IRONFORGE%20FITNESS...`.
    - Target is `_blank` with `rel="noopener noreferrer"`.
  - **Failure Condition**: Invalid WhatsApp URL format or missing security rel attributes.

- **`T2-F10-03`**: Footer Responsive Multi-Column Stacking (Boundary)
  - **Objective**: Verify multi-column footer collapses cleanly to single column on mobile (<768px).
  - **Inputs**: Set viewport width to 375px.
  - **Actions**: Inspect footer column layout.
  - **Expected Assertions**:
    - Footer columns stack vertically with adequate spacing (`space-y-8`).
    - Links have touch-friendly target size ($\ge 44\text{px}$ touch height/area).
    - Zero horizontal overflow.
  - **Failure Condition**: Footer columns clip or overlap on small screens.

- **`T2-F10-04`**: Missing SiteConfig Contact Info Fallback (Negative)
  - **Objective**: Verify footer renders sensible fallback placeholders if `siteConfig.contact` fields are empty.
  - **Inputs**: Mock `siteConfig` with `phone: ""`, `address: ""`.
  - **Actions**: Render footer.
  - **Expected Assertions**:
    - Renders `"Contact details available upon inquiry"` or placeholder rather than empty string or `undefined`.
    - Does not crash or throw unhandled `TypeError`.
  - **Failure Condition**: Unhandled crash or literal `"undefined"` text displayed.

- **`T2-F10-05`**: Keyboard Tab Sequence & Focus Rings Across Footer Links (Boundary)
  - **Objective**: Verify all footer links and social icons are sequentially focusable via keyboard with visible focus rings.
  - **Inputs**: Tab through footer elements via keyboard.
  - **Actions**: Check focus indicators.
  - **Expected Assertions**:
    - Every link receives visible lime focus ring `focus-visible:ring-2 focus-visible:ring-[#C6FF33]`.
    - Logical top-to-bottom, left-to-right tab sequence.
  - **Failure Condition**: Keyboard traps or invisible focus states.

---

## 6. Caveats

1. **Client vs Server Boundaries in Next.js 15 App Router**:
   - Interactive components (`Navbar`, `TiltCard`, `LightboxModal`, `ProgramsSection`, `MembershipSection`) require `'use client'` directives. The test specifications test both rendered HTML structure and client-side event interactions.
2. **Touch vs Mouse Coordinates**:
   - 3D tilt tests specify that `(pointer: coarse)` media queries bypass mousemove calculations to avoid performance degradation on mobile devices.
3. **Tailwind CSS v4 CSS-First Theme Architecture**:
   - Tailwind v4 does not use `tailwind.config.js`. Theme tokens must be verified through computed CSS custom properties (`--color-brand-*`) and `@theme` definitions in `src/app/globals.css`.
4. **Environment Isolation**:
   - The test specifications are designed for opaque-box execution using the zero-dependency Node.js test runner at `tests/runner.js` with DOM simulation helpers (`tests/helpers/dom.js`).

---

## 7. Conclusion

We have completed the specification mining for **Features 1 through 10** of IRONFORGE FITNESS.
A total of **100 complete, rigorous test specifications** have been formulated:
- **50 Tier 1 Feature Coverage Tests**: Formulating complete happy-path functional requirements, DOM structures, brand color tokens, ARIA roles, and component contracts.
- **50 Tier 2 Boundary, Corner & Negative Tests**: Formulating edge conditions, touch bypasses, reduced-motion preferences, keyboard traps, extreme viewports (320px), corrupt inputs, and integrity mode constraints.

All specifications are fully documented with explicit objectives, inputs, actions, exact assertions, and failure conditions, ready for direct encoding by the test implementation team.

---

## 8. Verification Method

To verify these test specifications against the codebase and test runner:

1. **Test Runner Execution**:
   ```bash
   node tests/runner.js
   ```
   *Expected Result*: Once implemented, the 100 test specifications across Features 1-10 in `tests/tier1/` and `tests/tier2/` execute cleanly with exit code 0.

2. **TypeScript Strict Type Check**:
   ```bash
   npx tsc --noEmit
   ```
   *Expected Result*: Exits with code 0 and zero type errors.

3. **Production Build**:
   ```bash
   npm run build
   ```
   *Expected Result*: Next.js 15 App Router builds successfully with zero lint or bundling errors.
