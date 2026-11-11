# Handoff Report: Test Specifications for Features 11 through 20 (IRONFORGE FITNESS)

**Agent**: `e2e_spec_miner_2`  
**Parent Agent**: `8f2266cd-6cdb-4a40-8676-4eca916aaa22`  
**State Folder**: `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\e2e_spec_miner_2`  
**Date**: 2026-11-11T08:16:30Z  
**Type**: Hard Handoff  

---

## 1. Observation

### 1.1 Specification Sources Examined
1. **`ORIGINAL_REQUEST.md`** (`c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\ORIGINAL_REQUEST.md`):
   - **R1 (Lines 13-15)**: *"Deliver a continuous, high-performance Three.js 3D experience designed with React Three Fiber and @react-three/drei inside a dark industrial gym environment featuring overhead and accent lighting using the exact four-colour palette (#000000 Black, #7D39EB Violet, #C6FF33 Lime, #FFFFFF White). Do not substitute static images for core 3D experiences. The hero must feature a realistic 3D athletic figure in a powerful pose, subtle camera response to pointer movement, smooth cinematic reveal, accessible HTML text overlays, and a WebGL fallback with an optimized static hero image."*
   - **R2 (Lines 16-18)**: *"Implement GSAP ScrollTrigger to orchestrate smooth, multi-scene camera movements across 5 narrative scenes (The Beginning, Strength, Performance, Discipline, and Your Next Level) without abrupt hijacking, respecting prefers-reduced-motion and keyboard navigation. Include an interactive 3D equipment showcase (dumbbell, barbell, weight plates, training bench) with smooth drag-to-rotate interaction, subtle floating animations, and dynamic lighting. All 3D models and media assets must be properly licensed for commercial website projects, sourced or generated using optimized GLB models and procedural 3D fallbacks."*
   - **R4 (Lines 29-31)**: *"Build a floating transparent navbar with smooth section navigation and mobile drawer menu. Implement a validated contact enquiry form (name, phone, email, membership interest, message) with loading, success, and error states, operating in demo mode with configurable business details, along with a configurable WhatsApp enquiry link."*
   - **R5 (Lines 32-34)**: *"Engineer the site using Next.js 15 App Router, React 19, TypeScript strict mode, and Tailwind CSS v4. Ensure mobile-first performance with adaptive rendering, optimized GLB models, lazy-loading/Suspense for 3D scenes, instancing, asset disposal, reduced particle/shadow complexity on mobile, zero horizontal overflow, and full accessibility (ARIA, semantic headings, visible focus states). Verify responsive layouts and interactions across desktop, tablet, and mobile. Verification requires running production build (`npm run build`), strict TypeScript type-checking, linting, and browser testing."*
   - **Acceptance Criteria (Lines 37-57)**:
     - Genuine Three.js/R3F 3D environment without console errors, 4-color brand system maintained.
     - 3D hero scene with athletic figure, dynamic lighting, accessible HTML headline copy.
     - ScrollTrigger drives smooth 5-scene camera transitions and equipment showcase.
     - Interactive 3D equipment supports drag-to-rotate and smooth floating animation.
     - WebGL fallback renders clean static fallback layout when WebGL is unavailable.
     - Contact form validates inputs, displays loading/success/error states, and indicates demo mode.
     - WhatsApp button links to configured business contact placeholder.
     - Zero horizontal overflow across mobile, tablet, and desktop.
     - Adaptive DPR, texture optimization, dynamic/lazy loading.
     - Production build (`npm run build`) completes cleanly with zero TypeScript or lint errors.
     - Reduced motion media query (`prefers-reduced-motion`) disables intense camera motions gracefully.

2. **`PROJECT.md`** (`c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\PROJECT.md`):
   - Features 11 to 20 defined in Feature Inventory (Lines 39-48).
   - Milestones M1 to M5 defined (Lines 50-58).
   - Global Design Tokens, Camera narrative state contract, Equipment item contract, and Form status contract defined (Lines 65-117).
   - Source code layout defined (Lines 120-180).

3. **`explorer_survey_2/handoff.md`** & **`explorer_survey_3/handoff.md`**:
   - Detailed specifications for R3F single persistent canvas, WebGL fallback mechanics, 4-color lighting rig (#000000, #7D39EB, #C6FF33, #FFFFFF), Catmull-Rom spline camera decoupled interpolation, OrbitControls equipment interaction, procedural 3D fallbacks, deep memory disposal, contact form state machine, and WhatsApp parameterized link builder.

4. **`e2e_test_orchestrator/SCOPE.md`** & **`TEST_INFRA.md`**:
   - Standard test execution harness: Node.js zero-dependency runner (`node tests/runner.js`).
   - Assertion library requirements (`assert.js`).
   - Test tier definitions: Tier 1 (Feature Coverage), Tier 2 (Boundary & Corner Cases).

---

## 2. Logic Chain

1. **Assigned Scope**: Features 11 through 20 represent the interactive form/messaging system (F11), core 3D WebGL rendering pipeline (F12, F13, F14, F15, F16), accessibility and keyboard navigation (F17), mobile hardening & GPU lifecycle (F18), production build verification (F19), and E2E test harness execution (F20).
2. **Testing Granularity Requirement**:
   - For each feature, exactly 5 Tier 1 Feature Coverage tests (happy path, functional expectations, exact assertions) = 50 Tier 1 tests.
   - For each feature, exactly 5 Tier 2 Boundary, Corner, and Negative tests (extreme viewports, WebGL failure, reduced motion, malformed inputs, error recovery) = 50 Tier 2 tests.
   - Total required tests: 100 test specifications.
3. **Requirement Mapping**:
   - Each test is explicitly mapped back to requirements (R1, R2, R4, R5, or AC) to ensure complete traceability.
   - Assertions are specified with exact expected DOM states, ARIA attributes, mathematical vectors, hex codes, or process exit codes.

---

## 3. Features Discovered & Edge Cases

### 3.1 Features Discovered Table
| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 11 | Forms & Messaging | Contact Form & WhatsApp Integration | 5-state enquiry form with phone/email validation, demo mode badge, and parameterized WhatsApp URL generator | Name, Phone, Email, Tier, Message, Click | State change (idle->validating->submitting->success), WA link | Inline validation errors, error alert banner | ORIGINAL_REQUEST §R4, PROJECT #11, Survey 3 |
| 12 | 3D Infrastructure | 3D Canvas & WebGL Fallback Infrastructure | Persistent R3F Canvas with dynamic SSR-safe mounting, adaptive DPR, WebGL detection, and static image fallback | Viewport dimensions, WebGL context, DPR | Fixed Canvas element, rendered 3D scene / Fallback picture | Graceful unmount, renders `<FallbackHeroImage />` without crash | ORIGINAL_REQUEST §R1, PROJECT #12, Survey 2 |
| 13 | 3D Atmosphere | Dark Industrial Gym Environment & Lighting | 4-color lighting rig (#000000, #7D39EB, #C6FF33, #FFFFFF), textured rubber floor, and floating chalk dust particles | 3D scene coordinates, light intensities | Shaded industrial environment, drifting particles | Procedural fallback on missing textures, particle clamping | ORIGINAL_REQUEST §R1, PROJECT #13, Survey 2 |
| 14 | 3D Hero Scene | 3D Athletic Hero Figure & Reveal Sequence | Muscular sculpt in grounded power stance, dual rim lighting, 4-phase cinematic reveal, and pointer parallax | Mouse pointer (x, y), reveal timeline | Rotating figure mesh, spotlight strobe, text fade-in | Clamped pointer range, GLB fetch fallback to procedural sculpt | ORIGINAL_REQUEST §R1, PROJECT #14, Survey 2 |
| 15 | Camera Animation | GSAP ScrollTrigger 5-Scene Camera Narrative | 5 narrative camera waypoints along Catmull-Rom spline decoupled into R3F useFrame via normalized scroll progress | Scroll position (0.0 to 1.0) | Interpolated camera position `[X,Y,Z]` & lookAt vector | Normalized clamping to `[0.0, 1.0]`, RAF delta dampening | ORIGINAL_REQUEST §R2, PROJECT #15, Survey 2 |
| 16 | 3D Interaction | Interactive 3D Equipment Showcase | 4 gym equipment items (Barbell, Dumbbell, Plates, Bench) with OrbitControls drag-to-rotate, levitation, and hotspots | Drag pointer gestures, item selection, hotspot clicks | Rotated mesh, hovering harmonic oscillation, spec tooltip | Clamped polar angles (π/3 to 2π/3), cancel stale loads | ORIGINAL_REQUEST §R2, PROJECT #16, Survey 2 |
| 17 | Accessibility | Motion Accessibility & Keyboard Navigation | `prefers-reduced-motion` camera locking, static cross-fades, visible focus rings, and keyboard navigation | Media query matches, Tab / Arrow keys, Esc key | Locked camera `[0, 2.2, 8.0]`, focused elements, modal close | Traps focus within active dialog, prevents camera snapping | ORIGINAL_REQUEST §R2, §R5, PROJECT #17, Survey 2, 3 |
| 18 | Mobile Hardening | Mobile-First Performance & Layout Hardening | Zero horizontal overflow across viewports, touch target tuning, DPR clamping, and GPU memory disposal | Viewports (320px-2560px), touch events, component unmount | Clean 1-column mobile reflow, disposed GPU buffers | Clamps DPR to 1.3, prevents horizontal scrollbar | ORIGINAL_REQUEST §R5, PROJECT #18, Survey 1, 2, 3 |
| 19 | Build & Tooling | Production Build & Lint Verification | Next.js 15 production build (`npm run build`), strict TypeScript type-checking (`tsc --noEmit`), and ESLint compliance | Source code tree, configs | Production static/dynamic route artifacts, exit code 0 | Non-zero exit code, compiler/linter error output | ORIGINAL_REQUEST §R5, PROJECT #19, Survey 1 |
| 20 | Testing & Quality | E2E Testing Suite & Coverage Verification | Zero-dependency Node.js test harness (`tests/runner.js`) verifying 100% test coverage across all tiers | Test files, mock environments | Colorized console log, summary JSON, exit code 0 | Traps unhandled rejections, non-zero exit on fail | ORIGINAL_REQUEST §AC, PROJECT #20, SCOPE.md |

---

### 3.2 Edge Cases Table
| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Feature 11 | Malformed email without domain extension (e.g. `user@ironforge`) | Validation error appears: "Please enter a valid email address", submit disabled. |
| 2 | Feature 11 | Extreme name length (>100 characters) or single character | Rejected by regex `/^[a-zA-Z\s'-]{2,50}$/`, displays character constraint error. |
| 3 | Feature 11 | Simulated network interruption during enquiry submission | Form transitions to `error` state, shows retry button, preserves entered user text. |
| 4 | Feature 12 | WebGL context loss event (`webglcontextlost`) fired mid-render | Handler calls `event.preventDefault()`, safely unmounts R3F, displays static fallback graphic. |
| 5 | Feature 12 | Device pixel ratio reporting extreme value (`devicePixelRatio = 4.0`) | Adaptive DPR logic clamps to `1.8` on desktop and `1.3` on mobile, preventing VRAM overflow. |
| 6 | Feature 12 | Container resized to 0x0px during tab transition | Canvas handles zero aspect ratio gracefully without `NaN` in camera projection matrix. |
| 7 | Feature 13 | High density particle simulation on low-power mobile CPU | Automatically throttles chalk dust particle count from 350 to 100 motes. |
| 8 | Feature 13 | Missing industrial floor texture asset | Procedural PBR material fallback engages, maintaining `#080808` rubber matting appearance. |
| 9 | Feature 14 | External athletic figure GLB model network timeout (>3.0s) | Instant fallback to self-contained procedural anatomical sculpt with identical pose. |
| 10 | Feature 14 | Rapid mouse pointer coordinate spikes (e.g. cursor exits window at `x = 5.0`) | Pointer offset is clamped to `[-1.0, 1.0]`, damped rotation prevents figure disorientation. |
| 11 | Feature 15 | Violent scroll wheel fling from top to bottom in <100ms | Catmull-Rom lerp dampens camera motion, prevents camera clipping or inverted orientation. |
| 12 | Feature 15 | Browser window resized mid-scroll during Scene 3 | ScrollTrigger recalculates waypoint trigger offsets without snapping camera to origin. |
| 13 | Feature 16 | Multi-touch pinch gesture attempted on equipment showcase | OrbitControls rejects pinch/pan gestures, maintaining pure single-axis orbital rotation. |
| 14 | Feature 16 | Dragging equipment model past vertical polar limit | Rotation clamped strictly between `π/3` (60°) and `2π/3` (120°), preventing inversion. |
| 15 | Feature 16 | Rapidly switching between Barbell, Dumbbell, Plates, Bench (<50ms) | Pending asset loads are aborted, active mesh disposed, selected mesh mounts cleanly. |
| 16 | Feature 17 | User toggles OS `prefers-reduced-motion` setting mid-session | Media query listener halts active camera interpolation and locks to static vantage point `[0, 2.2, 8.0]`. |
| 17 | Feature 17 | Tabbing forward past the last interactive element in Mobile Drawer | `useFocusTrap` intercepts focus and loops back to the drawer close button. |
| 18 | Feature 18 | Narrow mobile viewport (320px iPhone SE) | Layout reflows to 1-column stack, zero horizontal scrollbar (`clientWidth === innerWidth`). |
| 19 | Feature 18 | Dynamic browser chrome expansion/collapse on mobile scroll | Sections use `min-h-[100dvh]` or padding, preventing visual layout jumping (CLS). |
| 20 | Feature 19 | Omission of `'use client'` on interactive component | Next.js build compiler halts with descriptive error regarding client-only hook usage. |
| 21 | Feature 20 | Asynchronous test execution timeout exceeded | Runner terminates hanging test after 5000ms with timeout diagnostic, exits non-zero. |

---

## 4. Complete Test Specifications: Features 11 through 20

### Feature 11: Contact Form & WhatsApp Integration

#### Tier 1: Feature Coverage (5 Tests)
- **`TEST-T1-11-01`**: **Valid Contact Enquiry Submission Flow**
  - *Target*: `src/components/forms/ContactForm.tsx`
  - *Preconditions*: Form is mounted in DOM, state is `idle`.
  - *Input*: Full Name: `"Marcus Thorne"`, Phone: `"+1 (555) 234-5678"`, Email: `"marcus.thorne@example.com"`, Membership Interest: `"pro"`, Preferred Contact: `"whatsapp"`, Message: `"Interested in Olympic weightlifting coaching."`
  - *Action*: User types inputs and clicks `button[type="submit"]`.
  - *Expected Assertions*:
    - Form enters `submitting` state: submit button displays loading spinner, `aria-busy="true"`, inputs disabled.
    - After 1.2s simulated latency, form enters `success` state.
    - Confirmation container renders with text: `"Thank you, Marcus Thorne!"` and `"Your inquiry for the PRO membership has been logged."`.
    - Verification that demo disclaimer is displayed in success card.

- **`TEST-T1-11-02`**: **Permanent Demo Mode Notice Display**
  - *Target*: `src/components/forms/ContactForm.tsx`
  - *Preconditions*: Component is rendered.
  - *Input*: Default page view.
  - *Action*: Inspect DOM above form container.
  - *Expected Assertions*:
    - Element with `role="status"` or `aria-live="polite"` exists.
    - Text contains: `"DEMO MODE ACTIVE"` and explains that submissions are simulated for sales demonstration.
    - Element styles use brand accent border (`border-[#7D39EB]` or `border-[#C6FF33]`).

- **`TEST-T1-11-03`**: **Form Reset After Successful Submission**
  - *Target*: `src/components/forms/ContactForm.tsx`
  - *Preconditions*: Form is currently in `success` state following submission.
  - *Input*: Click on `"Submit Another Inquiry"` reset button.
  - *Action*: Trigger click event on reset button.
  - *Expected Assertions*:
    - Form state transitions back to `idle`.
    - All input values are cleared (`fullName === ""`, `phone === ""`, `email === ""`, `message === ""`).
    - Input fields are re-enabled (`disabled === false`).
    - Validation error messages are absent.

- **`TEST-T1-11-04`**: **Parameterized WhatsApp URL Builder Verification**
  - *Target*: `src/lib/utils.ts` or `src/components/forms/WhatsAppButton.tsx` (`buildWhatsAppUrl`)
  - *Preconditions*: Utility function imported.
  - *Input*: `buildWhatsAppUrl({ phone: '+1 (555) 987-6543', tier: 'elite', name: 'Elena Drake' })`
  - *Action*: Execute function.
  - *Expected Assertions*:
    - Return value starts with `"https://wa.me/15559876543"`.
    - Decoded URL search param contains: `"Hello IRONFORGE FITNESS! I am interested in joining the ELITE membership tier. My name is Elena Drake."`.
    - All non-numeric characters removed from telephone number in path.

- **`TEST-T1-11-05`**: **Floating Quick-Action WhatsApp Badge Rendering**
  - *Target*: `src/components/forms/WhatsAppButton.tsx`
  - *Preconditions*: Root layout mounted.
  - *Input*: Default desktop/mobile viewport.
  - *Action*: Query `a[aria-label="Direct WhatsApp Inquiry"]`.
  - *Expected Assertions*:
    - Element is positioned with CSS classes `fixed bottom-6 right-6 z-40`.
    - Element has `href` matching `https://wa.me/...`.
    - Contains visible SVG WhatsApp icon and pulsing lime ring animation.
    - Target is `_blank` with `rel="noopener noreferrer"`.

#### Tier 2: Boundary, Corner & Negative Tests (5 Tests)
- **`TEST-T2-11-01`**: **Empty Form Submission Rejection**
  - *Target*: `src/components/forms/ContactForm.tsx`
  - *Preconditions*: Form mounted with blank fields.
  - *Input*: Click `button[type="submit"]` without entering any characters.
  - *Action*: Trigger submission.
  - *Expected Assertions*:
    - Form does NOT transition to `submitting` or `success`.
    - Inline error spans render for Name, Phone, and Email.
    - `aria-invalid="true"` set on empty required inputs.
    - Focus automatically moves to the first invalid field (`fullName`).

- **`TEST-T2-11-02`**: **Malformed Email Pattern Rejection**
  - *Target*: `src/components/forms/ContactForm.tsx`
  - *Preconditions*: Valid Name and Phone populated.
  - *Input*: Test inputs: `["plainaddress", "missing@domain", "@nodomain.com", "user@domain.c", "user with spaces@test.com"]`.
  - *Action*: Type each value into email input and blur.
  - *Expected Assertions*:
    - Email input receives `aria-invalid="true"`.
    - Error message displays: `"Please enter a valid email address"`.
    - Submit button click fails validation and prevents submission.

- **`TEST-T2-11-03`**: **Invalid Phone Number Boundary Rejection**
  - *Target*: `src/components/forms/ContactForm.tsx`
  - *Preconditions*: Form mounted.
  - *Input*: Test inputs: `["123"`, `"abcdefgh"`, `"+"` alone, `"123456789012345678901234567890"` (exceeding 25 chars)].
  - *Action*: Input values and trigger validation.
  - *Expected Assertions*:
    - Inputs fail `/^\+?[0-9\s-()]{7,20}$/`.
    - Phone input receives `border-red-500` / `border-rose-500` and inline error text.
    - Submission is blocked.

- **`TEST-T2-11-04`**: **Name Length Boundary Values (1 Char & >50 Chars)**
  - *Target*: `src/components/forms/ContactForm.tsx`
  - *Preconditions*: Form mounted.
  - *Input*: 
    - Input A: `"A"` (single character).
    - Input B: `"A".repeat(51)` (51 characters).
  - *Action*: Test both inputs against name validator.
  - *Expected Assertions*:
    - Input A triggers error: `"Name must be at least 2 characters"`.
    - Input B triggers error: `"Name cannot exceed 50 characters"`.
    - Valid name `"Jo"` (2 chars) and `"A".repeat(50)` pass validation cleanly.

- **`TEST-T2-11-05`**: **Simulated Network Error Recovery & Data Retention**
  - *Target*: `src/components/forms/ContactForm.tsx`
  - *Preconditions*: Form populated with valid data; mock network is set to force rejection.
  - *Input*: Click submit.
  - *Action*: Mock API throws `new Error("Network connection dropped")`.
  - *Expected Assertions*:
    - Form enters `error` state.
    - Error banner appears with retry instructions.
    - Previously entered values in `fullName`, `phone`, `email`, and `message` remain completely intact in inputs (zero data loss).
    - Submit button changes to `"Retry Submission"`.

---

### Feature 12: 3D Canvas & WebGL Fallback Infrastructure

#### Tier 1: Feature Coverage (5 Tests)
- **`TEST-T1-12-01`**: **Persistent Canvas Fixed Mounting & Layering**
  - *Target*: `src/components/canvas/GymCanvas.tsx`
  - *Preconditions*: Root layout rendered.
  - *Input*: Browser window with WebGL support.
  - *Action*: Query HTML canvas element.
  - *Expected Assertions*:
    - Outer container has classes `fixed inset-0 pointer-events-none z-0`.
    - `HTMLCanvasElement` exists in DOM with width and height matching viewport.
    - Content sections wrapper has `relative z-10`.

- **`TEST-T1-12-02`**: **SSR-Safe Dynamic Import & Skeleton Loader**
  - *Target*: `src/app/page.tsx` or layout
  - *Preconditions*: Server-side rendering pass (Node.js environment without `window`).
  - *Input*: Next.js App Router pre-rendering.
  - *Action*: Inspect rendered SSR HTML markup.
  - *Expected Assertions*:
    - WebGL canvas does NOT attempt to initialize on server (zero `window is not defined` errors).
    - Placeholder `<CanvasLoaderFallback />` renders with `#000000` background and brand glow lines.
    - Client hydration smoothly mounts R3F Canvas without hydration mismatch warnings.

- **`TEST-T1-12-03`**: **WebGL Capability Detection Execution**
  - *Target*: `src/lib/webglSupport.ts` (`isWebGLAvailable`)
  - *Preconditions*: Environment with WebGL context support.
  - *Input*: `isWebGLAvailable()` execution.
  - *Action*: Function evaluates `document.createElement('canvas').getContext('webgl')`.
  - *Expected Assertions*:
    - Returns boolean `true`.
    - Canvas component proceeds with Three.js WebGLRenderer initialization.

- **`TEST-T1-12-04`**: **Adaptive DPR Desktop Configuration**
  - *Target*: `src/components/canvas/GymCanvas.tsx`
  - *Preconditions*: Desktop viewport (width ≥ 1024px, `window.devicePixelRatio = 2.0`).
  - *Input*: Canvas initialization.
  - *Action*: Inspect R3F Canvas `dpr` prop and WebGLRenderer configuration.
  - *Expected Assertions*:
    - `dpr` evaluates to `Math.min(2.0, 1.8) === 1.8`.
    - Tone mapping is configured to `THREE.ACESFilmicToneMapping`.
    - `toneMappingExposure` is set to `1.1`.

- **`TEST-T1-12-05`**: **Static Fallback Image Rendering When WebGL Unsupported**
  - *Target*: `src/components/canvas/WebGLDetector.tsx` & `FallbackHeroImage.tsx`
  - *Preconditions*: Browser or headless environment where WebGL is unavailable (`isWebGLAvailable() === false`).
  - *Input*: Mount GymCanvas wrapper.
  - *Action*: Evaluate DOM output.
  - *Expected Assertions*:
    - R3F Canvas is not mounted.
    - `<FallbackHeroImage />` renders responsive `<picture>` with WebP/AVIF hero graphic.
    - Pure CSS radial glow elements in `#7D39EB` and `#C6FF33` render above background.
    - Zero console exceptions thrown.

#### Tier 2: Boundary, Corner & Negative Tests (5 Tests)
- **`TEST-T2-12-01`**: **WebGL Context Loss Event (`webglcontextlost`) Handling**
  - *Target*: `src/components/canvas/GymCanvas.tsx`
  - *Preconditions*: Active Three.js scene running on canvas.
  - *Input*: Dispatch synthetic `webglcontextlost` event to canvas element.
  - *Action*: `canvas.dispatchEvent(new Event('webglcontextlost'))`.
  - *Expected Assertions*:
    - Event listener executes `event.preventDefault()` (prevents browser default crash).
    - Canvas state machine transitions to `contextLost` / `fallback`.
    - Static fallback hero image mounts seamlessly in place of crashed canvas.
    - Console warns cleanly without uncaught exceptions.

- **`TEST-T2-12-02`**: **WebGL Context Creation Exception Trap**
  - *Target*: `src/lib/webglSupport.ts` (`isWebGLAvailable`)
  - *Preconditions*: `canvas.getContext` is overridden to throw `new Error("GPU process crashed")`.
  - *Input*: Execute `isWebGLAvailable()`.
  - *Action*: Function execution under fatal exception.
  - *Expected Assertions*:
    - Function catches exception in `try/catch` block.
    - Returns `false` rather than re-throwing.
    - Application continues executing without crashing.

- **`TEST-T2-12-03`**: **Zero-Dimension Canvas Resizing Handling**
  - *Target*: `src/components/canvas/GymCanvas.tsx`
  - *Preconditions*: Active R3F Canvas.
  - *Input*: Parent window or container resized to `0px x 0px` (e.g. iframe hidden).
  - *Action*: Trigger resize event.
  - *Expected Assertions*:
    - Aspect ratio calculation avoids division by zero (`aspect = width / (height || 1)`).
    - Camera projection matrix does NOT contain `NaN` or `Infinity`.
    - Three.js render loop continues without crashing.

- **`TEST-T2-12-04`**: **Extreme High-DPR Clamping on 4K / Retina Displays**
  - *Target*: `src/components/canvas/GymCanvas.tsx`
  - *Preconditions*: Window simulated with `window.devicePixelRatio = 3.5` (or 4.0).
  - *Input*: Canvas initialization on mobile/tablet.
  - *Action*: Inspect effective pixel ratio passed to renderer.
  - *Expected Assertions*:
    - Desktop DPR clamped strictly to `1.8`.
    - Mobile DPR clamped strictly to `1.3`.
    - Render target buffer dimensions do not exceed GPU memory thresholds.

- **`TEST-T2-12-05`**: **Rapid Canvas Mount/Unmount Cycle Memory Safety**
  - *Target*: `src/components/canvas/GymCanvas.tsx`
  - *Preconditions*: Test environment capable of mounting React components.
  - *Input*: Rapidly mount, unmount, and re-mount `<GymCanvas>` 5 times in 250ms.
  - *Action*: Execute lifecycle transitions.
  - *Expected Assertions*:
    - WebGL context is cleanly released on each unmount.
    - Browser does NOT emit warning `"Too many active WebGL contexts"`.
    - Memory footprint remains stable after cycles.

---

### Feature 13: Dark Industrial Gym Environment & Lighting

#### Tier 1: Feature Coverage (5 Tests)
- **`TEST-T1-13-01`**: **Exact 4-Color Brand Lighting Palette Verification**
  - *Target*: `src/components/canvas/GymEnvironment.tsx`
  - *Preconditions*: 3D Scene initialized.
  - *Input*: Traverse Three.js scene lights (`scene.traverse(obj => ...)`).
  - *Action*: Inspect all `Light` object colors.
  - *Expected Assertions*:
    - All light hex colors belong strictly to the 4-color set:
      - Crisp White: `#FFFFFF` (Overhead spotlight)
      - Electric Violet: `#7D39EB` (Dual rim/kicker lights)
      - Acid Lime: `#C6FF33` (Specular fill / floor guide lines)
      - Deep Obsidian: `#000000` (Background clear color & fog)
    - Zero foreign hex colors present in lighting definitions.

- **`TEST-T1-13-02`**: **Overhead Industrial High-Bay Spotlight Configuration**
  - *Target*: `src/components/canvas/GymEnvironment.tsx`
  - *Preconditions*: Scene mounted.
  - *Input*: Query overhead spotlight instance.
  - *Action*: Verify spotlight properties.
  - *Expected Assertions*:
    - Type is `THREE.SpotLight`.
    - Position equals `[0, 11, 2]`.
    - Color is `#FFFFFF`.
    - Intensity is between `35` and `45` (nominal `40`).
    - Penumbra is `0.65` and `castShadow` is `true`.

- **`TEST-T1-13-03`**: **Cavernous Industrial Fog Configuration**
  - *Target*: `src/components/canvas/GymEnvironment.tsx`
  - *Preconditions*: Scene mounted.
  - *Input*: Inspect `scene.fog`.
  - *Action*: Verify fog object type and properties.
  - *Expected Assertions*:
    - `scene.fog` is an instance of `THREE.FogExp2`.
    - Color equals `0x000000` (`#000000`).
    - Density parameter is in the range `[0.030, 0.040]` (nominal `0.035`).

- **`TEST-T1-13-04`**: **Floating Chalk Dust Particle System Initialization**
  - *Target*: `src/components/canvas/DustParticles.tsx`
  - *Preconditions*: 3D Environment mounted.
  - *Input*: Query `InstancedMesh` or `Points` in scene.
  - *Action*: Inspect particle count and geometry attributes.
  - *Expected Assertions*:
    - Particle instance count is exactly `350` (on desktop).
    - Buffer attributes contain `position`, with points constrained within overhead light cone.
    - Particle material has `transparent: true` and `opacity <= 0.4`.

- **`TEST-T1-13-05`**: **Heavy Industrial Gym Floor Mesh Architecture**
  - *Target*: `src/components/canvas/GymEnvironment.tsx`
  - *Preconditions*: Scene mounted.
  - *Input*: Query floor mesh at `y = 0`.
  - *Action*: Inspect geometry and material properties.
  - *Expected Assertions*:
    - Geometry plane dimensions are at least `60 x 60` units.
    - Material base color is charcoal/obsidian `#080808`.
    - Roughness is `0.85` and metalness is `0.15` (rubber matting spec).
    - Embedded laser guide lines exist with emissive color `#C6FF33` or `#7D39EB`.

#### Tier 2: Boundary, Corner & Negative Tests (5 Tests)
- **`TEST-T2-13-01`**: **Procedural Fallback on Missing Floor Texture**
  - *Target*: `src/components/canvas/GymEnvironment.tsx`
  - *Preconditions*: Mock texture loader to fail or simulate 404 for normal map.
  - *Input*: Initialize floor mesh.
  - *Action*: Evaluate material fallback state.
  - *Expected Assertions*:
    - Floor does not turn into default Three.js magenta/black error texture.
    - Material falls back to procedural standard PBR shading with `#080808` base.
    - Scene renders cleanly without unhandled texture load promise rejections.

- **`TEST-T2-13-02`**: **Particle Count Throttling on Low-End Mobile Devices**
  - *Target*: `src/components/canvas/DustParticles.tsx`
  - *Preconditions*: Mobile user agent or `isMobile === true`.
  - *Input*: Initialize DustParticles component.
  - *Action*: Inspect instanced count.
  - *Expected Assertions*:
    - Particle count is automatically clamped from 350 down to `100` (or `0` if battery saver active).
    - GPU draw calls and vertex overhead reduced by >60%.

- **`TEST-T2-13-03`**: **Light Intensity Clamping & Tone Mapping Protection**
  - *Target*: `src/components/canvas/GymEnvironment.tsx`
  - *Preconditions*: Spotlight intensity temporarily set to extreme value `150.0`.
  - *Input*: Render frame through `ACESFilmicToneMapping`.
  - *Action*: Sample render output pixels.
  - *Expected Assertions*:
    - Render does NOT clip to harsh blown-out white across colored surfaces.
    - Violet `#7D39EB` and Lime `#C6FF33` specular highlights retain color saturation due to ACES tonemapper curve.

- **`TEST-T2-13-04`**: **Floor Mesh Frustum Culling Bounding Box Stability**
  - *Target*: `src/components/canvas/GymEnvironment.tsx`
  - *Preconditions*: Camera positioned at low angle looking across ground plane.
  - *Input*: Move camera along spline waypoints.
  - *Action*: Verify `floorMesh.visible` and frustum culling.
  - *Expected Assertions*:
    - Floor mesh bounding box / sphere is properly computed.
    - Floor does not prematurely flicker out or disappear during high-pitch camera tilts.

- **`TEST-T2-13-05`**: **Unauthorized Foreign Color Uniform Detection**
  - *Target*: `src/components/canvas/GymEnvironment.tsx`
  - *Preconditions*: Test harness injects color `#FF0000` (Red) or `#00FF00` (Standard Green) into lighting config.
  - *Input*: Validate against `BRAND_COLORS` contract.
  - *Action*: Check theme validator.
  - *Expected Assertions*:
    - Validator identifies foreign color as non-compliant.
    - Replaces with closest brand color (`#7D39EB` or `#C6FF33`) and logs lint violation.

---

### Feature 14: 3D Athletic Hero Figure & Reveal

#### Tier 1: Feature Coverage (5 Tests)
- **`TEST-T1-14-01`**: **Anatomical Power Stance Sculpt Rendering**
  - *Target*: `src/components/canvas/HeroFigure.tsx`
  - *Preconditions*: Hero scene mounted.
  - *Input*: Query athletic hero mesh group in scene.
  - *Action*: Inspect mesh hierarchy and pose orientation.
  - *Expected Assertions*:
    - Hero group contains torso, deltoid, arm, and leg segments in grounded bilateral stance.
    - Mesh position centered at `[0, 0, 0]` facing positive Z direction.
    - Casts soft shadow on industrial gym floor.

- **`TEST-T1-14-02`**: **Gunmetal Obsidian Material & Dual Rim Lighting Response**
  - *Target*: `src/components/canvas/HeroFigure.tsx`
  - *Preconditions*: Hero figure rendered under dual rim lights.
  - *Input*: Inspect figure material properties.
  - *Action*: Read `roughness` and `metalness`.
  - *Expected Assertions*:
    - `roughness` equals `0.32` (±0.05).
    - `metalness` equals `0.82` (±0.05).
    - Shading reflects `#7D39EB` on left deltoid/lat and `#C6FF33` on right torso edge.

- **`TEST-T1-14-03`**: **4-Phase Cinematic Reveal Timeline Execution**
  - *Target*: `src/components/canvas/HeroFigure.tsx`
  - *Preconditions*: Page initial load at scroll position 0.
  - *Input*: Timeline starts at $t = 0$.
  - *Action*: Monitor lighting intensity and camera glide over 2.8 seconds.
  - *Expected Assertions*:
    - $t \in [0.0, 0.4]$: Scene in darkness, ambient intensity $\approx 0.05$.
    - $t \in [0.4, 1.2]$: Overhead spotlight pulses twice, reaching intensity 40.
    - $t \in [0.8, 2.4]$: Camera position translates smoothly from `[0, 4.2, 11.5]` to `[0, 2.0, 7.2]`.
    - $t \in [1.8, 2.8]$: HTML overlay headline opacity animates from 0 to 1.

- **`TEST-T1-14-04`**: **Damped Pointer Parallax Movement in useFrame**
  - *Target*: `src/components/canvas/HeroFigure.tsx`
  - *Preconditions*: Cinematic reveal complete, pointer at `x = 0.5, y = 0.5`.
  - *Input*: Dispatch mouse move event.
  - *Action*: Observe `heroGroup.rotation.y` and `heroGroup.rotation.x` across frames.
  - *Expected Assertions*:
    - Rotation smoothly interpolates toward `targetRotY = 0.5 * 0.16 = 0.08` rad.
    - Rotation interpolates toward `targetRotX = -0.5 * 0.08 = -0.04` rad.
    - Damping uses `THREE.MathUtils.damp` with factor 3.5, producing organic ease.

- **`TEST-T1-14-05`**: **Accessible Semantic HTML Headline Overlay**
  - *Target*: `src/components/sections/HeroOverlay.tsx`
  - *Preconditions*: Hero section mounted.
  - *Input*: Query DOM for hero headings.
  - *Action*: Inspect HTML structure.
  - *Expected Assertions*:
    - Semantic `<h1>` element exists containing: `"FORGE YOUR INNER BEAST"`.
    - CTA buttons exist: `"Explore Programs"` and `"Claim 3-Day Pass"`.
    - HTML overlay is selectable, indexable, and accessible to screen readers (`aria-hidden="false"`).

#### Tier 2: Boundary, Corner & Negative Tests (5 Tests)
- **`TEST-T2-14-01`**: **GLB Model Fetch Timeout Fallback to Procedural Sculpt**
  - *Target*: `src/components/canvas/HeroFigure.tsx`
  - *Preconditions*: External GLB network request delayed beyond 3000ms or rejected with 404.
  - *Input*: Component mount.
  - *Action*: Trigger asset load failure.
  - *Expected Assertions*:
    - Component automatically switches to internal procedural anatomical sculpt.
    - Scene renders without blank screen or broken mesh placeholder.
    - Console logs informational fallback warning without uncaught promise rejection.

- **`TEST-T2-14-02`**: **Pointer Parallax Extreme Coordinate Clamping**
  - *Target*: `src/components/canvas/HeroFigure.tsx`
  - *Preconditions*: Mouse event dispatches out-of-bounds coordinates (e.g. `x = 12.5, y = -8.0` due to multi-monitor setup).
  - *Input*: `state.pointer.x = 12.5; state.pointer.y = -8.0;`
  - *Action*: Execute `useFrame` callback.
  - *Expected Assertions*:
    - Pointer coordinates are clamped to `[-1.0, 1.0]`.
    - Maximum rotation does NOT exceed `±0.16` rad on Y and `±0.08` rad on X.
    - Figure does not invert or turn backwards.

- **`TEST-T2-14-03`**: **Immediate User Scroll Interruption During Reveal**
  - *Target*: `src/components/canvas/HeroFigure.tsx` & `CameraController.tsx`
  - *Preconditions*: Page loads, reveal is at $t = 0.2s$ (Phase 1).
  - *Input*: User immediately scrolls page down to Section 2.
  - *Action*: ScrollTrigger triggers camera repositioning.
  - *Expected Assertions*:
    - Reveal animation safely terminates or jumps to settled state.
    - Camera gracefully transitions to Scene 2 waypoint without snapping or jitter.
    - Headline overlay immediately resolves to full visibility.

- **`TEST-T2-14-04`**: **Touch Device Parallax Neutralization**
  - *Target*: `src/components/canvas/HeroFigure.tsx`
  - *Preconditions*: Touchscreen device (`window.matchMedia('(pointer: coarse)').matches`).
  - *Input*: User touches and drags finger on screen.
  - *Action*: Check hero rotation response.
  - *Expected Assertions*:
    - Mouse parallax calculations are bypassed.
    - Hero figure rotation remains stable at neutral `(0, 0, 0)`, preventing disorienting spins on touch scrolls.

- **`TEST-T2-14-05`**: **Shader Antialiasing Stability Under High Resolution (4K)**
  - *Target*: `src/components/canvas/HeroFigure.tsx`
  - *Preconditions*: Viewport rendered at 3840 x 2160.
  - *Input*: Inspect specular rim edges.
  - *Action*: Check for high-frequency shader shimmering or moiré.
  - *Expected Assertions*:
    - Specular rim highlights render smoothly without stepped pixel crawling or aliasing artifacts.

---

### Feature 15: GSAP ScrollTrigger 5-Scene Camera Narrative

#### Tier 1: Feature Coverage (5 Tests)
- **`TEST-T1-15-01`**: **5 Narrative Waypoints Exact Spatial Definition**
  - *Target*: `src/lib/cameraPath.ts`
  - *Preconditions*: Waypoints array exported.
  - *Input*: Inspect `CAMERA_WAYPOINTS` definition.
  - *Action*: Compare coordinates and targets for all 5 scenes.
  - *Expected Assertions*:
    - Scene 1 (*The Beginning*): Pos `[0.0, 2.2, 7.5]`, Target `[0.0, 1.8, 0.0]`.
    - Scene 2 (*Strength*): Pos `[-3.4, 1.4, 3.6]`, Target `[-0.6, 0.9, 0.1]`.
    - Scene 3 (*Performance*): Pos `[3.6, 2.2, 4.0]`, Target `[0.7, 1.3, -0.6]`.
    - Scene 4 (*Discipline*): Pos `[0.2, 3.9, 2.6]`, Target `[0.0, 0.7, 0.0]`.
    - Scene 5 (*Your Next Level*): Pos `[0.0, 1.3, 9.2]`, Target `[0.0, 3.2, -3.2]`.

- **`TEST-T1-15-02`**: **Decoupled Scroll Progress Lerp in useFrame**
  - *Target*: `src/components/canvas/CameraController.tsx`
  - *Preconditions*: GSAP ScrollTrigger initialized.
  - *Input*: ScrollTrigger `onUpdate` called with `self.progress = 0.5`.
  - *Action*: Observe how camera coordinates update.
  - *Expected Assertions*:
    - GSAP updates a scalar ref (`scrollProgressRef.current = 0.5`) without modifying camera directly.
    - R3F `useFrame` evaluates Catmull-Rom spline at 0.5.
    - Camera position lerps via exponential damping `camera.position.lerp(targetPos, 1 - Math.exp(-4.5 * delta))`.
    - Movement occurs in sync with GPU refresh rate.

- **`TEST-T1-15-03`**: **Continuous Smooth Scrubbing Velocity Tracking**
  - *Target*: `src/components/canvas/CameraController.tsx`
  - *Preconditions*: Page scroll container mounted.
  - *Input*: ScrollTrigger configuration object.
  - *Action*: Read `scrub` configuration.
  - *Expected Assertions*:
    - `scrub` value is set between `1.0` and `1.5` seconds.
    - Zero scroll snapping or hijacking attributes applied to native document scrolling.

- **`TEST-T1-15-04`**: **Camera LookAt Target Smooth Interpolation**
  - *Target*: `src/components/canvas/CameraController.tsx`
  - *Preconditions*: Scrolling from Scene 1 to Scene 2.
  - *Input*: Progress transitions from 0.0 to 0.25.
  - *Action*: Sample `currentLookAt` vector during interpolation.
  - *Expected Assertions*:
    - Vector moves smoothly from `[0.0, 1.8, 0.0]` toward `[-0.6, 0.9, 0.1]`.
    - Camera orientation remains stable without gimbal lock or abrupt flips.

- **`TEST-T1-15-05`**: **Scroll Progress Forward and Backward Trajectory Symmetry**
  - *Target*: `src/components/canvas/CameraController.tsx`
  - *Preconditions*: Page scrolled from progress 0.0 to 1.0, then back to 0.0.
  - *Input*: Forward scroll followed by reverse scroll.
  - *Action*: Compare camera position at progress = 0.5 in forward vs reverse.
  - *Expected Assertions*:
    - Camera position at progress = 0.5 matches within `±0.01` units regardless of scroll direction.
    - No persistent spatial drift or spline hysteresis.

#### Tier 2: Boundary, Corner & Negative Tests (5 Tests)
- **`TEST-T2-15-01`**: **Violent High-Velocity Scroll Scrubbing Recovery**
  - *Target*: `src/components/canvas/CameraController.tsx`
  - *Preconditions*: Camera at Scene 1.
  - *Input*: Scrollbar dragged instantly to page bottom ($progress = 1.0$) in < 50ms.
  - *Action*: Observe camera interpolation across subsequent frames.
  - *Expected Assertions*:
    - Exponential lerp prevents camera from snapping with infinite velocity.
    - Camera traverses path smoothly to Scene 5 coordinates.
    - No `NaN` values produced in camera position or projection matrices.

- **`TEST-T2-15-02`**: **Viewport Resize Recalibration Mid-Scroll**
  - *Target*: `src/components/canvas/CameraController.tsx`
  - *Preconditions*: User scrolled to Scene 3 (progress = 0.5).
  - *Input*: Browser window resized from 1920x1080 to 768x1024.
  - *Action*: Trigger window `resize` event.
  - *Expected Assertions*:
    - ScrollTrigger triggers `ScrollTrigger.refresh()`.
    - Camera aspect ratio updates immediately.
    - Camera focal point remains locked on Hex Dumbbells without teleporting.

- **`TEST-T2-15-03`**: **Negative and Overscroll Progress Clamping**
  - *Target*: `src/components/canvas/CameraController.tsx`
  - *Preconditions*: Elastic bounce scroll on macOS / iOS causing progress < 0.0 or > 1.0.
  - *Input*: ScrollTrigger reports `progress = -0.12` or `progress = 1.08`.
  - *Action*: Evaluate Catmull-Rom spline evaluator input.
  - *Expected Assertions*:
    - Progress is clamped strictly to `[0.0, 1.0]`.
    - Spline evaluator does NOT extrapolate beyond terminal waypoints.

- **`TEST-T2-15-04`**: **Catmull-Rom Spline Tangent Singularity Protection**
  - *Target*: `src/lib/cameraPath.ts`
  - *Preconditions*: Spline mathematical curve definition.
  - *Input*: Evaluate curve at boundary inflection points ($t = 0.0, 0.25, 0.5, 0.75, 1.0$).
  - *Action*: Check first derivative (velocity vector).
  - *Expected Assertions*:
    - Tangent vectors are non-zero and finite across all points.
    - Zero division or singular matrix inversions.

- **`TEST-T2-15-05`**: **Background Tab Inactivity & RAF Delta Warping Trap**
  - *Target*: `src/components/canvas/CameraController.tsx`
  - *Preconditions*: User scrolls page, then switches browser tabs for 10 seconds.
  - *Input*: Return to tab, triggering `useFrame` with high accumulated delta ($\Delta t = 10.0s$).
  - *Action*: Execute frame update.
  - *Expected Assertions*:
    - Delta is clamped to `Math.min(delta, 0.1)` inside `useFrame`.
    - Camera does not warp erratically or overshoot target.

---

### Feature 16: Interactive 3D Equipment Showcase

#### Tier 1: Feature Coverage (5 Tests)
- **`TEST-T1-16-01`**: **4 Equipment Models Selection and Mounting**
  - *Target*: `src/components/canvas/EquipmentShowcase.tsx`
  - *Preconditions*: Equipment showcase section active in Scene 2/3.
  - *Input*: Select equipment tabs: `"barbell"`, `"dumbbell"`, `"plates"`, `"bench"`.
  - *Action*: User switches between tabs.
  - *Expected Assertions*:
    - Corresponding 3D model mounts in showcase scene:
      - Barbell: 2.2m Olympic bar with rotating sleeves and dual bumper plates.
      - Dumbbell: 32.5kg pro-hex rubber dumbbell with knurled handle.
      - Plates: 450mm calibrated competition plate with `#C6FF33` rim.
      - Bench: Heavy-duty 3-point frame with carbon-weave vinyl upholstery.
    - Previous equipment mesh is cleanly unmounted.

- **`TEST-T1-16-02`**: **Drag-to-Rotate OrbitControls Interaction**
  - *Target*: `src/components/canvas/EquipmentShowcase.tsx`
  - *Preconditions*: Dumbbell model mounted.
  - *Input*: Mouse pointer down at $(x_1, y_1)$, drag to $(x_2, y_1)$ by +100px.
  - *Action*: Dispatch pointer events on showcase canvas.
  - *Expected Assertions*:
    - Mesh rotates smoothly around the Y-axis following cursor movement.
    - OrbitControls parameters: `enableZoom={false}`, `enablePan={false}`, `enableDamping={true}`.
    - Auto-rotation temporarily pauses (`isIdle = false`).

- **`TEST-T1-16-03`**: **Auto-Rotation Resumption After Idle Delay**
  - *Target*: `src/components/canvas/EquipmentShowcase.tsx`
  - *Preconditions*: User finishes drag interaction and releases pointer.
  - *Input*: No pointer interaction for 2500ms.
  - *Action*: Advance timer by 2.5 seconds.
  - *Expected Assertions*:
    - `isIdle` state transitions to `true`.
    - Model resumes smooth auto-rotation at speed `0.5`.
    - Resumption is eased smoothly via damping factor `0.06`.

- **`TEST-T1-16-04`**: **Harmonic Floating Levitation Oscillation**
  - *Target*: `src/components/canvas/EquipmentShowcase.tsx`
  - *Preconditions*: Model resting in showcase scene.
  - *Input*: Clock elapsed time $t$ advancing in `useFrame`.
  - *Action*: Monitor mesh Y position over time.
  - *Expected Assertions*:
    - Mesh position oscillates according to $y(t) = y_0 + 0.07 \cdot \sin(1.6t)$.
    - Pitch and roll exhibit secondary micro-oscillations ($\cos(1.1t) \cdot 0.035$).
    - Zero cumulative positional drift over 60 seconds of rendering.

- **`TEST-T1-16-05`**: **Interactive 3D Specification Hotspots**
  - *Target*: `src/components/canvas/EquipmentShowcase.tsx`
  - *Preconditions*: Barbell model rendered.
  - *Input*: Click on `#C6FF33` hotspot badge positioned on barbell sleeve.
  - *Action*: Trigger click event on hotspot.
  - *Expected Assertions*:
    - Specification popover opens displaying: `"215,000 PSI Tensile Strength Steel"` and diamond knurling details.
    - Popover has accessible ARIA label and close button.

#### Tier 2: Boundary, Corner & Negative Tests (5 Tests)
- **`TEST-T2-16-01`**: **Multi-Touch Pinch/Zoom Gesture Rejection**
  - *Target*: `src/components/canvas/EquipmentShowcase.tsx`
  - *Preconditions*: Touchscreen device rendering equipment showcase.
  - *Input*: User touches with two fingers and attempts a pinch-to-zoom gesture.
  - *Action*: Dispatch `touchstart` and `touchmove` with two touches.
  - *Expected Assertions*:
    - Camera distance does NOT change (`enableZoom={false}`).
    - Camera does NOT translate laterally (`enablePan={false}`).
    - Showcase maintains fixed scale and framing.

- **`TEST-T2-16-02`**: **Polar Angle Rotation Boundary Enforcement**
  - *Target*: `src/components/canvas/EquipmentShowcase.tsx`
  - *Preconditions*: User dragging model vertically to flip it upside down.
  - *Input*: Upward drag of +500px.
  - *Action*: Inspect OrbitControls polar angle $\theta$.
  - *Expected Assertions*:
    - $\theta$ is clamped between `minPolarAngle = Math.PI / 3` (60°) and `maxPolarAngle = 2 * Math.PI / 3` (120°).
    - Model cannot be flipped upside down or viewed from disorienting extreme angles.

- **`TEST-T2-16-03`**: **Rapid Equipment Item Tab Cycling (<50ms)**
  - *Target*: `src/components/canvas/EquipmentShowcase.tsx`
  - *Preconditions*: Equipment showcase mounted.
  - *Input*: Rapidly click tabs: Barbell -> Dumbbell -> Plates -> Bench in 150ms.
  - *Action*: Rapid state dispatch.
  - *Expected Assertions*:
    - No duplicate or orphaned meshes remain in the scene graph.
    - Only the final selected model (Bench) remains mounted.
    - All unmounted geometries and materials are disposed cleanly.

- **`TEST-T2-16-04`**: **Occluded Hotspot Click Protection**
  - *Target*: `src/components/canvas/EquipmentShowcase.tsx`
  - *Preconditions*: Model rotated so that hotspot marker is behind the 3D mesh.
  - *Input*: Click on screen coordinates corresponding to the occluded hotspot.
  - *Action*: Raycaster evaluation.
  - *Expected Assertions*:
    - Raycaster detects model mesh occlusion before hotspot plane.
    - Hotspot tooltip does NOT activate when obscured behind geometry.

- **`TEST-T2-16-05`**: **Levitation Physics Stability Under Dropped Frame Delays**
  - *Target*: `src/components/canvas/EquipmentShowcase.tsx`
  - *Preconditions*: Frame rate artificially stalled for 500ms ($\Delta t = 0.5s$).
  - *Input*: Next `useFrame` execution.
  - *Action*: Check levitation offset calculation.
  - *Expected Assertions*:
    - Levitation uses absolute elapsed clock time (`state.clock.getElapsedTime()`) rather than accumulated delta Euler integration.
    - Mesh position remains bounded within $[-0.07, +0.07]$ meters, preventing geometry explosion.

---

### Feature 17: Motion Accessibility & Keyboard Navigation

#### Tier 1: Feature Coverage (5 Tests)
- **`TEST-T1-17-01`**: **`prefers-reduced-motion` Media Query Detection**
  - *Target*: `src/hooks/usePrefersReducedMotion.ts`
  - *Preconditions*: Browser media feature `(prefers-reduced-motion: reduce)` set to `true`.
  - *Input*: Hook execution.
  - *Action*: Read hook output.
  - *Expected Assertions*:
    - Hook returns `true`.
    - React components consume flag and disable continuous motion transforms.

- **`TEST-T1-17-02`**: **3D Camera Path Locking Under Reduced Motion**
  - *Target*: `src/components/canvas/CameraController.tsx`
  - *Preconditions*: `prefers-reduced-motion: reduce` is active.
  - *Input*: User scrolls through the 5 narrative sections.
  - *Action*: Inspect camera position coordinates.
  - *Expected Assertions*:
    - Camera position remains locked at static vantage point `[0.0, 2.2, 8.0]`.
    - Camera does NOT swoop, roll, or lerp along the Catmull-Rom spline.
    - Zero motion sickness trigger for sensitive users.

- **`TEST-T1-17-03`**: **Static Cross-Fade Scene Transition Replacement**
  - *Target*: `src/components/sections/HeroOverlay.tsx` and content wrappers
  - *Preconditions*: `prefers-reduced-motion: reduce` is active.
  - *Input*: Scroll between sections.
  - *Action*: Inspect transition CSS styles.
  - *Expected Assertions*:
    - Heavy transform animations are replaced with gentle opacity cross-fades (`opacity: 0` to `opacity: 1` over 0.5s).
    - `motion-reduce:transform-none` and `motion-reduce:transition-none` applied.

- **`TEST-T1-17-04`**: **Accessible Keyboard Section Navigation**
  - *Target*: `src/components/navigation/Navbar.tsx` & document keyboard listener
  - *Preconditions*: Page focused.
  - *Input*: Press `ArrowDown` or `PageDown` keys.
  - *Action*: Dispatch keyboard events.
  - *Expected Assertions*:
    - Scroll position smoothly advances to the next section landmark anchor.
    - ScrollTrigger progress updates without camera desynchronization.
    - Active nav link indicator updates to reflect the active section.

- **`TEST-T1-17-05`**: **Visible Focus Rings & Skip to Content Link**
  - *Target*: `src/app/globals.css` & `src/components/ui/Button.tsx`
  - *Preconditions*: Page loaded, user presses `Tab` key.
  - *Input*: Tab through page elements.
  - *Action*: Inspect focused DOM elements.
  - *Expected Assertions*:
    - First focusable element is `"Skip to content"` link targeting `#main-content`.
    - Every interactive button, link, and input receives high-contrast focus ring:
      `focus-visible:ring-2 focus-visible:ring-[#C6FF33] focus-visible:ring-offset-2 focus-visible:ring-offset-black`.
    - Focus outline contrast exceeds 7:1 against deep black background.

#### Tier 2: Boundary, Corner & Negative Tests (5 Tests)
- **`TEST-T2-17-01`**: **Dynamic Mid-Session Reduced Motion Preference Change**
  - *Target*: `src/hooks/usePrefersReducedMotion.ts`
  - *Preconditions*: User starts with reduced-motion disabled, then enables it in OS mid-session.
  - *Input*: Dispatch `change` event on `window.matchMedia('(prefers-reduced-motion: reduce)')`.
  - *Action*: Observe component reactions.
  - *Expected Assertions*:
    - Hook dynamically updates state to `true` without page reload.
    - Ongoing camera animations halt immediately.
    - Tilt cards immediately flatten to 0 degrees rotation.

- **`TEST-T2-17-02`**: **Focus Trap in Mobile Drawer & Lightbox Modal**
  - *Target*: `src/hooks/useFocusTrap.ts`
  - *Preconditions*: Mobile drawer opened (`isOpen === true`).
  - *Input*: User presses `Tab` while focus is on the last element in the drawer.
  - *Action*: Dispatch `keydown` with key `"Tab"`.
  - *Expected Assertions*:
    - Focus is prevented from escaping to background page elements.
    - Focus wraps back to the first focusable element (close button).
    - Pressing `Shift+Tab` on first element wraps focus to the last element.

- **`TEST-T2-17-03`**: **Escape Key Dismissal Hierarchy**
  - *Target*: `src/components/ui/LightboxModal.tsx` & `MobileDrawer.tsx`
  - *Preconditions*: Both a modal dialog and background drawer are open.
  - *Input*: Press `Escape` key once.
  - *Action*: Dispatch keydown event.
  - *Expected Assertions*:
    - Only the topmost overlay (Lightbox Modal) closes.
    - Mobile drawer remains in its previous state until a second Escape is pressed.
    - Focus returns to the trigger button that launched the modal.

- **`TEST-T2-17-04`**: **Rapid Tab Key Traversal Through 3D Scene Anchors**
  - *Target*: `src/components/sections/`
  - *Preconditions*: User rapidly holds down `Tab` key to traverse 20+ links.
  - *Input*: Continuous rapid tab events.
  - *Action*: Observe focus scroll behavior.
  - *Expected Assertions*:
    - Browser smoothly scrolls viewport to keep focused element within view.
    - Focus indicator is never truncated or clipped outside container bounds.
    - 3D camera does not jitter or throw projection exceptions.

- **`TEST-T2-17-05`**: **High Contrast Mode Style Preservation**
  - *Target*: `src/app/globals.css`
  - *Preconditions*: Windows High Contrast mode (`forced-colors: active`) enabled.
  - *Input*: Inspect interactive element borders and focus rings.
  - *Action*: Check computed CSS.
  - *Expected Assertions*:
    - Buttons and inputs utilize `outline: 2px solid ButtonText` or system highlight colors.
    - Text and icon elements remain readable without disappearing into background.

---

### Feature 18: Mobile-First Performance & Layout Hardening

#### Tier 1: Feature Coverage (5 Tests)
- **`TEST-T1-18-01`**: **Zero Horizontal Overflow Across Standard Mobile Viewports**
  - *Target*: Entire document DOM (`src/app/layout.tsx` & all sections)
  - *Preconditions*: Browser viewport set to mobile widths: `375px` (iPhone), `390px` (iPhone 14), `414px` (Plus).
  - *Input*: Full page render.
  - *Action*: Evaluate `document.documentElement.scrollWidth <= window.innerWidth`.
  - *Expected Assertions*:
    - Horizontal scroll width equals client width (`scrollWidth === clientWidth`).
    - `window.scrollX` remains 0 at all times.
    - No horizontal scroll bar rendered.

- **`TEST-T1-18-02`**: **Touch Target Minimum Dimension Compliance (44x44px)**
  - *Target*: All interactive components (Navbar hamburger, CTAs, tabs, form inputs, close buttons)
  - *Preconditions*: Mobile viewport active.
  - *Input*: Query all `button`, `a`, `input`, and `select` elements.
  - *Action*: Inspect bounding client rect (`getBoundingClientRect()`).
  - *Expected Assertions*:
    - Every interactive touch target has minimum width $\ge 44\text{px}$ and minimum height $\ge 44\text{px}$ (or equivalent touch padding).
    - Meets WCAG 2.5.5 and Apple HIG touch target guidelines.

- **`TEST-T1-18-03`**: **Mobile DPR Clamping (Capped at 1.3)**
  - *Target*: `src/components/canvas/GymCanvas.tsx`
  - *Preconditions*: Mobile device with Retina display (`devicePixelRatio = 3.0`).
  - *Input*: Canvas initialization on mobile viewport (width < 768px).
  - *Action*: Inspect active DPR setting passed to Three.js renderer.
  - *Expected Assertions*:
    - DPR is clamped strictly to `[1, 1.3]`.
    - GPU fragment shading load reduced by >50% compared to native 3x DPR.
    - Frame rate maintains 60fps on mobile hardware.

- **`TEST-T1-18-04`**: **Single-Column Responsive Grid Reflow**
  - *Target*: `src/components/sections/` (Programs, About Bento Grid, Trainers, Membership)
  - *Preconditions*: Viewport width < 768px.
  - *Input*: Inspect computed CSS grid and flex structures.
  - *Action*: Check grid template columns.
  - *Expected Assertions*:
    - Multi-column desktop grids collapse to a clean 1-column vertical stack (`grid-cols-1`).
    - About bento grid elements reflow vertically with consistent `gap-6`.
    - No cards compressed below readable width.

- **`TEST-T1-18-05`**: **GPU Resource Disposal on Component Unmount**
  - *Target*: `src/lib/utils.ts` (`deepDispose`) & 3D components
  - *Preconditions*: 3D component mounted with meshes, geometries, materials, and textures.
  - *Input*: Trigger React component unmount (`root.unmount()`).
  - *Action*: Spy on `geometry.dispose()`, `material.dispose()`, and `texture.dispose()`.
  - *Expected Assertions*:
    - `deepDispose` traverses scene graph.
    - `.dispose()` is invoked for all child geometries, materials, and textures.
    - WebGL memory is reclaimed, preventing memory leaks in single-page navigation.

#### Tier 2: Boundary, Corner & Negative Tests (5 Tests)
- **`TEST-T2-18-01`**: **Extreme Narrow Viewport (320px iPhone SE) Verification**
  - *Target*: Complete DOM layout
  - *Preconditions*: Viewport dimensions set to `320px x 568px`.
  - *Input*: Render all 7 content sections.
  - *Action*: Check for text truncations, badge overlaps, and horizontal overflow.
  - *Expected Assertions*:
    - `document.documentElement.scrollWidth === 320`.
    - Typography scales down gracefully via responsive clamp utilities (`text-2xl sm:text-4xl`).
    - Action buttons stack vertically if horizontal width is insufficient.

- **`TEST-T2-18-02`**: **Ultra-Wide Viewport (2560px 4K) Container Constriction**
  - *Target*: All section wrappers (`max-w-6xl`, `max-w-7xl`)
  - *Preconditions*: Viewport width set to `2560px`.
  - *Input*: Render page.
  - *Action*: Inspect computed width of content containers.
  - *Expected Assertions*:
    - Content is centered horizontally with margin auto (`mx-auto`).
    - Maximum width is constrained to `1152px` - `1280px` (`max-w-6xl` or `max-w-7xl`).
    - Line lengths remain readable (between 60 and 80 characters per line).

- **`TEST-T2-18-03`**: **Dynamic Mobile Address Bar Height Resizing (100dvh Simulation)**
  - *Target*: Section vertical dimensions
  - *Preconditions*: Mobile browser dynamically toggling address bar (height varies between 600px and 660px).
  - *Input*: Dispatch window resize events simulating dynamic address bar collapse.
  - *Action*: Measure section heights and layout shifts.
  - *Expected Assertions*:
    - Sections use `min-h-[100dvh]` and vertical padding rather than hard `h-screen`.
    - Cumulative Layout Shift (CLS) score remains < 0.05.
    - No visual jumping or jerking during touch scroll.

- **`TEST-T2-18-04`**: **Repeated Multi-Section Remount Memory Leak Test**
  - *Target*: React DOM & 3D Canvas
  - *Preconditions*: Test runner with heap memory tracking.
  - *Input*: Mount and unmount the complete page tree 10 consecutive times.
  - *Action*: Measure heap memory delta after garbage collection.
  - *Expected Assertions*:
    - JavaScript heap memory growth remains < 5MB across cycles.
    - Three.js WebGLRenderer instances properly cleaned up.
    - Zero orphaned event listeners on `window` or `document`.

- **`TEST-T2-18-05`**: **Post-Processing Pass Disabling on Mobile Devices**
  - *Target*: `src/components/canvas/GymCanvas.tsx`
  - *Preconditions*: Mobile device detected or `dpr < 1.5`.
  - *Input*: Canvas initialization.
  - *Action*: Inspect post-processing pipeline.
  - *Expected Assertions*:
    - Heavy bloom and chromatic aberration post-processing passes are disabled.
    - Emissive neon effects utilize direct shader emissive values + radial CSS glows.
    - Maintains target 60fps rendering without GPU overheating.

---

### Feature 19: Production Build & Lint Verification

#### Tier 1: Feature Coverage (5 Tests)
- **`TEST-T1-19-01`**: **Next.js 15 Production Build Success**
  - *Target*: Root project build command
  - *Preconditions*: All source code, configs, and assets in place.
  - *Input*: Execute `npm run build` in root workspace.
  - *Action*: Wait for Next.js App Router compiler to finish.
  - *Expected Assertions*:
    - Command exits with process code `0`.
    - Next.js outputs valid `.next` production build directory.
    - All routes (static and dynamic) compiled without errors.

- **`TEST-T1-19-02`**: **Strict TypeScript Type Checking (`tsc --noEmit`)**
  - *Target*: TypeScript compiler (`tsconfig.json`)
  - *Preconditions*: TypeScript config has `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`.
  - *Input*: Execute `npx tsc --noEmit`.
  - *Action*: Type-check all files in `src/`.
  - *Expected Assertions*:
    - Command exits with process code `0`.
    - Zero type diagnostics or compilation errors emitted.

- **`TEST-T1-19-03`**: **ESLint Static Analysis Clean Compliance**
  - *Target*: ESLint configuration (`eslint.config.mjs`)
  - *Preconditions*: Project linter configured.
  - *Input*: Execute `npm run lint`.
  - *Action*: Run ESLint across `src/`.
  - *Expected Assertions*:
    - Command exits with process code `0`.
    - Zero ESLint errors.
    - Zero ESLint warnings.

- **`TEST-T1-19-04`**: **App Router Client Directive Compliance**
  - *Target*: All interactive components in `src/components/`
  - *Preconditions*: Production build analysis.
  - *Input*: Scan files using React hooks (`useState`, `useEffect`, `useRef`) or event listeners.
  - *Action*: Verify presence of `'use client'` directive at line 1.
  - *Expected Assertions*:
    - Every component containing hooks explicitly declares `'use client'`.
    - No Next.js server/client component boundary violation warnings.

- **`TEST-T1-19-05`**: **Tailwind CSS v4 Theme Token Compilation**
  - *Target*: `src/app/globals.css` and compiled CSS
  - *Preconditions*: Tailwind v4 with `@theme` directive.
  - *Input*: Inspect generated CSS output bundle.
  - *Action*: Verify brand token variables.
  - *Expected Assertions*:
    - CSS bundle contains exact brand hex values: `#000000`, `#7D39EB`, `#C6FF33`, `#FFFFFF`.
    - Utility classes `bg-[#000000]`, `text-[#7D39EB]`, `border-[#C6FF33]`, etc. properly generated.

#### Tier 2: Boundary, Corner & Negative Tests (5 Tests)
- **`TEST-T2-19-01`**: **Strict Type Violation Trapping in Site Config**
  - *Target*: `src/config/site.ts`
  - *Preconditions*: Injected type error (e.g. passing a number where `string` is required in `SiteConfig`).
  - *Input*: Execute `npx tsc --noEmit`.
  - *Action*: Type check compiler output.
  - *Expected Assertions*:
    - Compiler catches error and halts with non-zero exit code.
    - Error message accurately identifies file, line number, and mismatched property.

- **`TEST-T2-19-02`**: **Server Component Hook Misuse Rejection**
  - *Target*: Next.js build compiler
  - *Preconditions*: Deliberately omit `'use client'` from a component importing `useState`.
  - *Input*: Execute `npm run build`.
  - *Action*: Evaluate build failure.
  - *Expected Assertions*:
    - Next.js build compiler fails with explicit diagnostic: `"You're importing a component that needs useState. It only works in a Client Component..."`.
    - Exit code is non-zero, preventing broken production deployments.

- **`TEST-T2-19-03`**: **Unused Variable and Dead Code Prohibition**
  - *Target*: ESLint ruleset
  - *Preconditions*: Inject unused variable `const unusedVariable = 42;` into a component.
  - *Input*: Execute `npm run lint`.
  - *Action*: Evaluate linter output.
  - *Expected Assertions*:
    - ESLint flags `@typescript-eslint/no-unused-vars`.
    - Non-zero exit code returned.

- **`TEST-T2-19-04`**: **Circular Dependency Graph Prevention**
  - *Target*: Project module graph
  - *Preconditions*: Module import relationship check.
  - *Input*: Analyze import paths across `src/components/`, `src/config/`, and `src/lib/`.
  - *Action*: Detect cyclic imports.
  - *Expected Assertions*:
    - Graph is a directed acyclic graph (DAG).
    - Zero circular dependency warnings during Next.js chunk optimization.

- **`TEST-T2-19-05`**: **Zero Environment Secret Leakage During Static Export**
  - *Target*: Built production artifacts in `.next/`
  - *Preconditions*: Production build complete.
  - *Input*: Grep built client JS bundles for private environment variable keys.
  - *Action*: Search for pattern `API_SECRET` or private credentials.
  - *Expected Assertions*:
    - Client bundles contain zero private server secrets.
    - Only public variables prefixed with `NEXT_PUBLIC_` exist in client bundles.

---

### Feature 20: E2E Testing Suite & Coverage Verification

#### Tier 1: Feature Coverage (5 Tests)
- **`TEST-T1-20-01`**: **Node.js Test Runner Zero-Dependency Execution**
  - *Target*: `tests/runner.js`
  - *Preconditions*: Node.js v25+ installed in environment.
  - *Input*: Execute `node tests/runner.js`.
  - *Action*: Run master test harness.
  - *Expected Assertions*:
    - Runs cleanly using Node.js built-ins without requiring external test frameworks (Jest/Mocha).
    - Exits with process code `0` when all tests pass.

- **`TEST-T1-20-02`**: **Assertion Library Core Functions Verification**
  - *Target*: `tests/helpers/assert.js`
  - *Preconditions*: Assertion module imported.
  - *Input*: Test assertions `equal`, `deepEqual`, `match`, `throws`, `includes`, `truthy`, `falsy`.
  - *Action*: Execute each assertion with passing inputs.
  - *Expected Assertions*:
    - All assertions succeed silently without throwing.
    - Detailed, formatted error thrown only when condition fails.

- **`TEST-T1-20-03`**: **Tier 1 Feature Coverage Suite Aggregation**
  - *Target*: `tests/tier1/`
  - *Preconditions*: All 20 Tier 1 test suites implemented (Features 1 to 20).
  - *Input*: Execute Tier 1 suite.
  - *Action*: Inspect aggregated test counts.
  - *Expected Assertions*:
    - Total Tier 1 test count equals exactly `100` (5 tests per feature * 20 features).
    - 100% of Tier 1 tests pass.

- **`TEST-T1-20-04`**: **Process Exit Code Semantics on Success**
  - *Target*: `tests/runner.js`
  - *Preconditions*: Complete test run with 0 failures.
  - *Input*: `node tests/runner.js`
  - *Action*: Inspect shell exit code `$LASTEXITCODE` in PowerShell.
  - *Expected Assertions*:
    - Exit code is strictly `0`.

- **`TEST-T1-20-05`**: **Structured JSON Summary Report Generation**
  - *Target*: `tests/runner.js`
  - *Preconditions*: Test execution completed.
  - *Input*: Inspect generated test report file or stdout JSON summary block.
  - *Action*: Parse JSON report.
  - *Expected Assertions*:
    - JSON is valid and contains keys: `timestamp`, `durationMs`, `totalTests`, `passed`, `failed`, `skipped`, `suites`.
    - `failed === 0` and `totalTests >= 200` (Tiers 1 & 2).

#### Tier 2: Boundary, Corner & Negative Tests (5 Tests)
- **`TEST-T2-20-01`**: **Deliberate Test Failure Reporting & Non-Zero Exit Code**
  - *Target*: `tests/runner.js`
  - *Preconditions*: Inject a test with intentional failure: `assert.equal(1, 2)`.
  - *Input*: Run test suite.
  - *Action*: Observe console output and exit code.
  - *Expected Assertions*:
    - Runner logs failed test name and full stack trace.
    - Process exits with non-zero exit code (`1`).
    - Failure count increments to `1`.

- **`TEST-T2-20-02`**: **Asynchronous Test Timeout Trapping (5000ms Limit)**
  - *Target*: `tests/runner.js`
  - *Preconditions*: Test function creates an unresolved promise `new Promise(() => {})`.
  - *Input*: Run test suite with 5000ms timeout configured.
  - *Action*: Wait 5.0 seconds.
  - *Expected Assertions*:
    - Runner catches timeout and terminates test execution.
    - Test marked as FAILED with message: `"Test exceeded timeout of 5000ms"`.
    - Suite proceeds to execute remaining tests without hanging indefinitely.

- **`TEST-T2-20-03`**: **Unhandled Promise Rejection Trap**
  - *Target*: `tests/runner.js`
  - *Preconditions*: Test function triggers `Promise.reject(new Error("Async unhandled"))` without await or catch.
  - *Input*: Run suite.
  - *Action*: Evaluate process behavior.
  - *Expected Assertions*:
    - Runner traps `unhandledRejection` via process event listener.
    - Logs diagnostic and marks enclosing test suite as failed without crashing test runner process.

- **`TEST-T2-20-04`**: **Malformed JSON Reporter Recovery Under Piped Output**
  - *Target*: `tests/runner.js`
  - *Preconditions*: Runner executed in CI pipe: `node tests/runner.js | Tee-Object -FilePath test.log`.
  - *Input*: Standard output redirect.
  - *Action*: Verify stream flushing.
  - *Expected Assertions*:
    - JSON summary block is written to disk intact without truncated lines or buffer interleaving.

- **`TEST-T2-20-05`**: **Test Idempotency & Zero Flakiness Verification**
  - *Target*: Complete test suite
  - *Preconditions*: Clean workspace.
  - *Input*: Execute `node tests/runner.js` 3 times consecutively in the same session.
  - *Action*: Compare output metrics across all 3 runs.
  - *Expected Assertions*:
    - Pass count is 100% identical across all 3 runs.
    - Zero flaky test failures or execution order dependencies.

---

## 5. Caveats

1. **Procedural Geometry vs External GLB Assets**:
   - The specifications cover both high-fidelity procedural Three.js fallbacks and external `.glb` models. When external GLB assets are added, they must be tested with fallback timeouts to ensure zero dependency on network connectivity.
2. **WebGL Testing in Headless Node.js Environments**:
   - In automated Node.js test runners where native GPU WebGL contexts are absent, tests for Features 12, 13, 14, 15, and 16 should utilize either mock WebGL contexts (`tests/helpers/webgl.js`) or headless GL to verify mathematical and state machine transitions.
3. **Tailwind CSS v4 Configuration**:
   - Tailwind v4 uses CSS-first configuration via `@theme` in `globals.css` rather than `tailwind.config.js`. Build verification tests must assert that brand color classes compile directly from the `@theme` definitions.
4. **Demo Mode Operational Scope**:
   - All contact forms and interactive actions operate in sales demonstration mode. Form submissions simulate realistic processing with a 1.2s delay and reveal success confirmation cards, without executing third-party external API requests.

---

## 6. Conclusion

1. **Exhaustive Test Specifications Produced**:
   - Exactly **50 Tier 1 Feature Coverage tests** (5 tests per feature for Features 11 through 20) formulated with precise inputs, actions, and exact assertions.
   - Exactly **50 Tier 2 Boundary, Corner, and Negative tests** (5 tests per feature for Features 11 through 20) covering WebGL context loss, reduced motion accessibility, extreme viewports (320px to 2560px), malformed inputs, error recovery, and process timeouts.
   - Grand total: **100 test specifications**.
2. **Zero Code Implemented**:
   - In strict compliance with the Specification Miner role, no production source code has been authored or altered.
3. **Requirement Traceability**:
   - 100% of requirements in `ORIGINAL_REQUEST.md` (R1 through R5) and Acceptance Criteria for Features 11-20 are accounted for and verified.

---

## 7. Verification Method

To independently verify the completeness and compliance of these test specifications:

1. **Verify Test Specification Counts**:
   Inspect this file to confirm exactly 50 Tier 1 tests (`TEST-T1-11-01` to `TEST-T1-20-05`) and 50 Tier 2 tests (`TEST-T2-11-01` to `TEST-T2-20-05`):
   ```powershell
   Get-Content -Path ".agents\teamwork\e2e_spec_miner_2\handoff.md" | Select-String -Pattern "TEST-T1-" | Measure-Object
   Get-Content -Path ".agents\teamwork\e2e_spec_miner_2\handoff.md" | Select-String -Pattern "TEST-T2-" | Measure-Object
   ```
   *Expected Result*: Count = 50 for Tier 1, Count = 50 for Tier 2.

2. **Verify 5-Component Structure**:
   Inspect sections 1 (Observation), 2 (Logic Chain), 5 (Caveats), 6 (Conclusion), 7 (Verification Method) along with mandatory Spec Miner tables in Section 3.

3. **Invalidation Conditions**:
   This specification handoff is invalidated if:
   - Any test is missing explicit inputs, actions, or expected assertions.
   - Any of Features 11 through 20 contains fewer than 5 Tier 1 or fewer than 5 Tier 2 tests.
   - The brand 4-color palette is violated or substituted with non-compliant colors.
   - WebGL fallback or reduced-motion test cases are omitted.
