# Handoff Report — E2E Explorer 3: Test Runner Architecture, Tier 3 Cross-Feature & Tier 4 Scenarios

## 1. Observation

### 1.1 Project Context & Runtime Baseline
- **Workspace Directory**: `c:\Users\Admin\Desktop\GYM website 1`
- **State Folder**: `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\e2e_explorer_3`
- **Runtime Environment**: Node.js `v25.8.0`, NPM `11.11.0`, Windows 11 PowerShell.
- **Project Structure**: Greenfield Next.js 15 App Router (`next: ^15.2.0`), React 19 (`react: ^19.0.0`), Three.js (`three: ^0.187.0`), React Three Fiber (`@react-three/fiber: ^9.8.2`), Drei (`@react-three/drei: ^10.7.9`), GSAP (`gsap: ^3.15.1`, `@gsap/react: ^2.1.2`), Tailwind CSS v4 (`tailwindcss: ^4.3.5`, `@tailwindcss/postcss: ^4.3.5`).
- **Inspection of `package.json`**: No external browser testing frameworks (Playwright, Cypress, Puppeteer) or test runners (Jest, Vitest, Mocha) are listed in `dependencies` or `devDependencies`.
- **Primary Directives**:
  - `ORIGINAL_REQUEST.md` line 9: *"The team must NOT: copy code from existing open-source projects for core logic; run external scripts or delegate execution to other tools"*.
  - `ORIGINAL_REQUEST.md` line 55: *"Production build (`npm run build`) completes cleanly with zero TypeScript or lint errors"*.
  - `ORIGINAL_REQUEST.md` line 57: *"Browser testing confirms functional interactions and clean console output across desktop, tablet, and mobile viewports"*.
  - `e2e_test_orchestrator/TEST_INFRA.md` lines 5–6: *"Deterministic and Environment-Agnostic: Test harness runs cleanly with Node.js built-ins (`node tests/runner.js`), requiring no external binaries or internet connectivity, but capable of verifying DOM structures, WebGL capability fallbacks, CSS theme variables, regex form patterns, and multi-step user workflows."*

### 1.2 Target Deliverables Required
1. **Test Runner Architecture**: Design for `tests/runner.js` and `tests/helpers/` utilities (`assert.js`, `dom.js`, `webgl.js`, `state.js`, `scroll.js`) enabling fast, deterministic, opaque-box testing without external network dependencies.
2. **Tier 3 Cross-Feature Interaction Specifications**: At least 20 test specifications covering major pairwise and multi-module interactions across navigation, scroll, 3D scene, forms, modals, responsive viewports, and accessibility states.
3. **Tier 4 Real-World Application Scenarios**: At least 10 end-to-end prospect user journeys simulating realistic gym owners, fitness leads, mobile visitors, low-spec devices, and accessibility users.

---

## 2. Logic Chain

### 2.1 Test Runner Architecture & Helper Utilities

#### 2.1.1 Runner Philosophy & Design Principles
1. **Zero External Dependencies**: The test runner must execute with vanilla Node.js (`node tests/runner.js`) using built-in modules (`node:path`, `node:fs`, `node:util`, `node:events`). This eliminates dependency installation risks, version drift, and network failures.
2. **Opaque-Box Requirement**: Tests interact exclusively with exposed public interfaces: simulated DOM elements, rendered HTML output, event dispatchers, form submission handlers, public configuration objects (`siteConfig`), and WebGL context lifecycle hooks. Internal component state is never monkey-patched.
3. **Deterministic & Blazing Fast**: In-memory test execution completes in < 2.0 seconds for the entire multi-tier test suite (>230 tests), enabling instantaneous feedback during development and CI.
4. **Structured Output & Exit Semantics**:
   - ANSI colored terminal output with pass/fail counts, hierarchical tier summaries, and microsecond timings.
   - Machine-readable TAP (Test Anything Protocol) or JSON output summary (`test-results.json`).
   - Process exit code `0` on 100% pass, non-zero (`1`) on any failure.
5. **Per-Test Timeout & Failure Isolation**: Each test runs in an async wrapper with a configurable timeout (default 3000ms). Uncaught promise rejections or timeout breaches fail only the affected test without crashing the runner process.

#### 2.1.2 Directory Structure
```
tests/
├── runner.js                 # Master test execution engine, discovery, reporter & CLI
├── helpers/
│   ├── assert.js             # Lightweight robust assertion library with deep equality & diffs
│   ├── dom.js                # Opaque-box virtual DOM tree simulator, query engine & event system
│   ├── webgl.js              # WebGL 1/2 context mock, capability detection & context lost simulator
│   ├── state.js              # State transition validator (FSM verifier for forms, drawers, modals)
│   ├── scroll.js             # GSAP ScrollTrigger progress simulator & Catmull-Rom spline evaluator
│   └── mock.js               # Timer mocks, window.matchMedia & responsive viewport resizer
├── tier1/                    # Features 1–20 Coverage Tests (100 tests)
├── tier2/                    # Features 1–20 Boundary & Corner Tests (100 tests)
├── tier3/                    # Tier 3 Cross-Feature Interaction Tests (24 tests)
└── tier4/                    # Tier 4 Real-World Application Scenarios (10 tests)
```

#### 2.1.3 Master Runner Engine (`tests/runner.js`) Design
The runner provides a familiar BDD/TDD interface (`describe`, `test` / `it`, `beforeAll`, `afterAll`, `beforeEach`, `afterEach`):
```javascript
// Architecture Specification: tests/runner.js
class TestSuite {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.beforeAllHooks = [];
    this.afterAllHooks = [];
    this.beforeEachHooks = [];
    this.afterEachHooks = [];
  }
  // Registers tests and lifecycle hooks
}

class TestRunner {
  constructor(options = {}) {
    this.suites = [];
    this.filter = options.filter || null; // e.g. --tier=3 or --filter="Equipment"
    this.timeoutMs = options.timeout || 3000;
    this.stats = { total: 0, passed: 0, failed: 0, skipped: 0, durationMs: 0 };
    this.results = [];
  }
  // Discovers files in tests/tier*/**/*.test.js
  // Runs tests sequentially or with controlled concurrency
  // Aggregates results by tier and prints formatted ANSI summary
  // Writes test-results.json and sets process.exitCode
}
```

#### 2.1.4 Helper Utilities Architecture

##### A. `tests/helpers/assert.js`
Zero-dependency assertion suite with detailed failure diffs:
- `assert(condition, message)`: Fails if condition is falsy.
- `equal(actual, expected, message)`: Strict equality (`===`).
- `notEqual(actual, expected, message)`: Strict inequality (`!==`).
- `deepEqual(actual, expected, message)`: Recursive deep structural equality for objects, arrays, and Maps.
- `match(string, regex, message)`: Regular expression pattern match.
- `notMatch(string, regex, message)`: Inverse pattern match.
- `includes(collection, item, message)`: Checks array inclusion, string substring, or Set membership.
- `throws(fn, expectedError, message)`: Asserts synchronous function throws matching error.
- `rejects(asyncFn, expectedError, message)`: Asserts Promise rejects with matching error.
- `closeTo(actual, expected, delta = 0.001, message)`: Essential for 3D coordinates, DPR clamping, and spline interpolation tolerance.
- `truthy(value, message)` / `falsy(value, message)`: Boolean coercion checks.

##### B. `tests/helpers/dom.js`
In-memory virtual DOM and opaque-box query simulator:
- **Element Node Interface**:
  - `tagName`, `id`, `className`, `classList` (`add`, `remove`, `contains`, `toggle`).
  - `attributes` Map with `getAttribute(name)`, `setAttribute(name, val)`, `hasAttribute(name)`, `removeAttribute(name)`.
  - `dataset` mapping for `data-*` attributes.
  - `style` object tracking CSS inline rules.
  - Form properties: `value`, `checked`, `disabled`, `name`, `type`, `validity`.
  - Content properties: `textContent`, `innerHTML`, `children`, `parentElement`.
- **Query Engine**:
  - `querySelector(selector)` and `querySelectorAll(selector)` supporting tag selectors, classes (`.btn-primary`), IDs (`#contact-form`), attribute selectors (`[aria-expanded="true"]`, `[data-tier="pro"]`, `[type="email"]`), and hierarchical chains (`nav .nav-link.active`).
- **Event Dispatcher**:
  - `addEventListener(type, listener, options)`, `removeEventListener(type, listener)`.
  - `dispatchEvent(event)` with event bubbling, `preventDefault()`, and `stopPropagation()`.
  - Syntactic convenience helpers: `click(el)`, `input(el, value)`, `change(el, value)`, `keydown(el, key, code)`, `focus(el)`, `blur(el)`, `submit(formEl)`.
- **Window & Viewport Simulation**:
  - Configurable `window.innerWidth`, `window.innerHeight`, `window.devicePixelRatio`.
  - `window.scrollTo({ top, behavior })` updating `window.scrollY` and `document.documentElement.scrollTop`.
  - `window.matchMedia(query)` supporting `(prefers-reduced-motion: reduce)`, `(min-width: 768px)`, `(orientation: portrait)`.

##### C. `tests/helpers/webgl.js`
Deterministic WebGL 1.0 and 2.0 context simulator:
- **Mock Context Factory**: `createMockWebGLContext(version = 2, options = {})`
  - Supports standard parameters: `antialias`, `alpha`, `powerPreference`, `depth`, `stencil`.
  - Simulates context loss via synthetic `WEBGL_lose_context` extension (`loseContext()`, `restoreContext()`).
  - Emits `webglcontextlost` and `webglcontextrestored` events on canvas.
  - Verifies WebGL capability detection against `src/lib/webglSupport.ts` (e.g., when `getContext('webgl2')` returns `null` or throws).

##### D. `tests/helpers/state.js`
Finite State Machine (FSM) Transition Verifier:
- Tracks current state, permitted transitions, and history.
- Built-in schemas for:
  - `ContactForm`: `idle` -> `validating` -> `submitting` -> `success` / `error`.
  - `ModalDialog`: `closed` -> `opening` -> `open` (focus trapped) -> `closing` -> `closed` (focus restored).
  - `MobileDrawer`: `closed` -> `open` (body scroll locked) -> `closed` (body scroll restored).
  - `EquipmentShowcase`: `barbell` <-> `dumbbell` <-> `plates` <-> `bench`.

##### E. `tests/helpers/scroll.js`
GSAP ScrollTrigger & Spline Simulation:
- Normalizes scroll position $Y$ into progress $p \in [0.0, 1.0]$.
- Catmull-Rom Spline Waypoint Evaluator: Given 5 camera waypoints (Beginning, Strength, Performance, Discipline, Next Level), calculates exact 3D camera position $[x, y, z]$ and target $[tx, ty, tz]$ at any scroll progress.
- Respects `prefers-reduced-motion`: When active, spline lerp is bypassed and camera transitions snap or remain stationary.

---

### 2.2 Tier 3: Cross-Feature Interaction Test Specifications (24 Specifications)

The following 24 specifications cover pairwise and multi-module interactions across all 20 inventoried features:

#### Spec T3-01: Navbar Anchor Navigation Click -> Smooth Scroll -> 3D Camera Waypoint Synchronized Transition
- **Features Tested**: Feature 3 (Navbar) + Feature 15 (GSAP 5-Scene Camera Narrative) + Feature 12 (3D Canvas)
- **Pre-conditions**: Page loaded at top (`scrollY = 0`, progress = 0.0), camera at Scene 1 (The Beginning).
- **Test Steps**:
  1. Locate desktop navigation link `<a href="#programs" class="nav-link">`.
  2. Simulate user click on link.
  3. Verify `event.preventDefault()` called for smooth scroll orchestration.
  4. Advance simulated scroll position to `#programs` offset (e.g., `scrollY = 1200px`).
  5. Sample camera narrative controller at scroll progress $p \approx 0.25$.
- **Expected Assertions**:
  - `window.scrollY` equals `#programs` target top offset.
  - Active waypoint ID transitions from `'beginning'` to `'strength'`.
  - Camera position coordinates match Catmull-Rom waypoint 2 within $\pm 0.05$ units.
  - Navbar link for `#programs` acquires active state (`text-[#C6FF33]` and active indicator pill).

#### Spec T3-02: ScrollSpy Scroll Tracking -> Navbar Active Indicator & 3D Spline Progress Sync
- **Features Tested**: Feature 3 (Navbar ScrollSpy) + Feature 15 (GSAP Camera Narrative)
- **Pre-conditions**: Page rendered with 7 content sections positioned at incremental vertical offsets.
- **Test Steps**:
  1. Trigger scroll events incrementing `scrollY` through 25%, 50%, 75%, and 100% of document height.
  2. At each threshold, query the active navigation pill in the navbar and the camera waypoint in the 3D scene.
- **Expected Assertions**:
  - At 25% scroll: `#programs` is active in navbar; camera target points to Training Arena.
  - At 50% scroll: `#trainers` is active in navbar; camera target points to Performance Stage.
  - At 75% scroll: `#membership` is active in navbar; camera target points to Discipline Area.
  - At 100% scroll: `#contact` / Final CTA is active; camera target points to Next Level Gateway.
  - Exactly one navbar link possesses `aria-current="page"` or `data-active="true"` at any instant.

#### Spec T3-03: Membership Tier Card CTA Click ("SELECT PRO") -> Contact Form Prefill & Focus
- **Features Tested**: Feature 7 (Membership Experience) + Feature 11 (Contact Form)
- **Pre-conditions**: User views Membership Section with Starter, Pro, and Elite cards. Contact form is at `idle` state.
- **Test Steps**:
  1. Click CTA button inside Pro tier card: `<button data-tier-select="pro">SELECT PRO</button>`.
  2. Verify smooth scroll or focus shift to `#contact` section.
  3. Inspect `<select id="membership-interest">` inside Contact Form.
- **Expected Assertions**:
  - `document.querySelector('#membership-interest').value` equals `'pro'`.
  - Contact form `<section id="contact">` receives focus or is scrolled into view.
  - Pro tier selection badge is visually highlighted in the form prefill indicator.
  - Form status remains `idle` with no erroneous validation triggers.

#### Spec T3-04: Membership Tier Select ("ELITE") -> Contact Form Prefill with Lime Accent Highlight
- **Features Tested**: Feature 7 (Membership) + Feature 11 (Contact Form) + Feature 1 (Design Tokens)
- **Pre-conditions**: User at Membership section.
- **Test Steps**:
  1. Click CTA button inside Elite tier card: `<button data-tier-select="elite">JOIN ELITE</button>`.
  2. Inspect the contact form's interest selector and dynamic heading.
- **Expected Assertions**:
  - `document.querySelector('#membership-interest').value` equals `'elite'`.
  - A contextual pill badge appears above form: "Selected Plan: ELITE VIP".
  - The badge applies Acid Lime styling (`bg-[#C6FF33] text-black font-bold`).
  - Switching selection manually in form dropdown cleanly removes or updates the pill badge.

#### Spec T3-05: Equipment Showcase Tab Switch (Barbell -> Dumbbell) -> 3D Model Swap & Hotspots Update
- **Features Tested**: Feature 16 (3D Equipment Showcase) + Feature 2 (UI Primitives)
- **Pre-conditions**: Equipment Showcase rendered with initial apparatus "Olympic Barbell & Bumpers" loaded.
- **Test Steps**:
  1. Assert current active tab is `'barbell'` with 2 knurl/collar hotspots rendered.
  2. Simulate user click on tab button: `<button data-equipment-tab="dumbbell">Pro-Hex Dumbbell</button>`.
  3. Observe apparatus transition animation and metadata update.
- **Expected Assertions**:
  - Active tab attribute updates to `'dumbbell'`.
  - Previous barbell 3D geometry and material buffers invoke `.dispose()`.
  - Active 3D apparatus model instance updates to Dumbbell (32.5kg).
  - Specification panel DOM updates: Weight displays `"32.5 KG"`, Material displays `"Cast Iron & Urethane"`.
  - Hotspots collection updates to 2 dumbbell-specific coordinates (`handle-grip`, `urethane-head`).

#### Spec T3-06: Equipment Showcase Hotspot Click -> Detail Callout Expansion & OrbitControls Focus
- **Features Tested**: Feature 16 (Interactive Equipment) + Feature 2 (UI Primitives)
- **Pre-conditions**: Dumbbell apparatus active in showcase.
- **Test Steps**:
  1. Locate 3D interactive hotspot element: `<button data-hotspot-id="handle-grip">`.
  2. Click the hotspot button.
  3. Verify callout overlay visibility and camera target adjustment.
- **Expected Assertions**:
  - Callout popover mounts with `role="region"` and `aria-label="Knurled Grip Specification"`.
  - Callout text includes `"Medium-depth diamond knurl for non-slip grip without hand tear"`.
  - Camera focus target animates smoothly toward the handle coordinate $[0, 0, 0]$.
  - Clicking outside or pressing Escape dismisses callout and restores default camera framing.

#### Spec T3-07: Mobile Drawer Open -> Viewport Resize to Desktop -> Drawer Auto-Dismiss & Navbar State Restoration
- **Features Tested**: Feature 3 (Mobile Drawer & Navbar) + Feature 18 (Mobile-First Hardening)
- **Pre-conditions**: Viewport set to mobile width (390px, mobile portrait).
- **Test Steps**:
  1. Click hamburger toggle button `<button aria-label="Open navigation menu">`.
  2. Verify Mobile Drawer mounts: `aria-expanded="true"`, drawer has class `translate-x-0`.
  3. Simulate viewport resize to desktop width: `window.innerWidth = 1280px`, dispatch `'resize'` event.
- **Expected Assertions**:
  - Mobile drawer immediately unmounts or acquires `aria-hidden="true"` / `hidden`.
  - Hamburger button state resets to `aria-expanded="false"`.
  - `document.body.style.overflow` resets from `'hidden'` back to `''` (scroll unlocked).
  - Desktop navigation pill bar becomes visible without style corruption or double render.

#### Spec T3-08: Mobile Drawer Open -> Body Scroll Lock Enforcement -> Nav Link Click -> Drawer Close & Scroll Unlock
- **Features Tested**: Feature 3 (Mobile Drawer) + Feature 18 (Layout Hardening)
- **Pre-conditions**: Viewport at 390px.
- **Test Steps**:
  1. Open mobile drawer via toggle.
  2. Verify `document.body.style.overflow === 'hidden'`.
  3. Click internal drawer navigation link: `<a href="#trainers" class="drawer-nav-link">TRAINERS</a>`.
- **Expected Assertions**:
  - Drawer slide-out transition triggers close (`translate-x-full`).
  - `document.body.style.overflow` is restored to `''` allowing scroll.
  - Page scrolls smoothly to `#trainers`.
  - Focus is placed on `#trainers` section header for keyboard accessibility.

#### Spec T3-09: Contact Form Valid Submission in Demo Mode -> Feedback Notification & Form Reset
- **Features Tested**: Feature 11 (Contact Form) + Feature 2 (UI Primitives)
- **Pre-conditions**: User navigates to `#contact` section. `siteConfig.demoMode === true`.
- **Test Steps**:
  1. Fill form fields:
     - Name: `"Sarah Connor"`
     - Phone: `"+1 (555) 839-2001"`
     - Email: `"sarah@sky.net"`
     - Membership: `"pro"`
     - Message: `"Interested in heavy lifting coaching."`
  2. Click submit button `<button type="submit">SEND ENQUIRY</button>`.
  3. Verify transient `submitting` state (spinner visible, button disabled).
  4. Wait for simulated async resolution (400ms).
- **Expected Assertions**:
  - Form status transitions: `idle` -> `submitting` -> `success`.
  - Success banner mounts displaying: `"Enquiry Received (Demo Mode)"`.
  - Notice text explains: `"In production, this enquiry alerts the IRONFORGE membership team."`.
  - Form fields reset to empty defaults.
  - "Submit Another Enquiry" button restores form to `idle` state on click.

#### Spec T3-10: Contact Form Validation Error -> Red/Violet Border -> Corrective Typing Clears Error in Real-time
- **Features Tested**: Feature 11 (Contact Form) + Feature 2 (UI Primitives) + Feature 1 (Design Tokens)
- **Pre-conditions**: Contact form is empty at `idle` state.
- **Test Steps**:
  1. Enter invalid email: `"sarah-invalid-email"`.
  2. Click submit button without filling required Name.
  3. Verify error messages and invalid input styling.
  4. User types valid Name `"Sarah"` and valid Email `"sarah@example.com"`.
- **Expected Assertions**:
  - Name input acquires `aria-invalid="true"` and error message `"Full name is required"`.
  - Email input acquires `aria-invalid="true"` and error message `"Please enter a valid email address"`.
  - Border highlights change to error state (`border-red-500` or `border-[#7D39EB]`).
  - As user types valid email, `aria-invalid` becomes `"false"` and error message unmounts without requiring re-submission.

#### Spec T3-11: 3D Equipment OrbitControls Drag -> Scroll Passthrough Prevention -> Idle Levitation Resumption
- **Features Tested**: Feature 16 (3D Equipment) + Feature 18 (Mobile Touch & Layout)
- **Pre-conditions**: 3D Equipment Showcase apparatus rendered in interactive viewport zone.
- **Test Steps**:
  1. Simulate pointerdown on equipment canvas overlay at $(x=200, y=300)$.
  2. Dispatch pointermove to $(x=280, y=300)$ simulating horizontal rotation drag.
  3. Verify OrbitControls active state.
  4. Dispatch pointerup.
  5. Advance simulation clock by 1000ms.
- **Expected Assertions**:
  - Pointer drag updates model rotation angle $\theta_y$.
  - Page vertical scroll does not fire during pointer drag (`touch-action: none` / `e.preventDefault()`).
  - When pointer released, harmonic levitation equation ($y = y_0 + A \cdot \sin(\omega t)$) seamlessly resumes from current rotation offset without discontinuity.

#### Spec T3-12: Reduced Motion Toggle -> GSAP 5-Scene Camera Narrative Switches to Instant Waypoint Cuts
- **Features Tested**: Feature 15 (GSAP Camera Narrative) + Feature 17 (Motion Accessibility)
- **Pre-conditions**: Page rendered with default smooth spline camera interpolation.
- **Test Steps**:
  1. Trigger media query change: `window.matchMedia('(prefers-reduced-motion: reduce)')` fires with `matches = true`.
  2. Scroll from `scrollY = 0` to `scrollY = 2400px` (crossing from Scene 1 to Scene 3).
- **Expected Assertions**:
  - GSAP camera spline smoothing duration drops to `0` or uses gentle cross-fade.
  - Camera does not execute 3D sweeping parabolic Catmull-Rom rotation.
  - Camera snaps directly to target waypoint coordinates $[x_3, y_3, z_3]$.
  - Section text content fades in immediately without parallax translate lag.

#### Spec T3-13: Reduced Motion Active -> Trainer 3D Tilt Cards Disable Perspective Transform & Retain Flat Hover
- **Features Tested**: Feature 6 (Trainers Tilt Cards) + Feature 17 (Motion Accessibility)
- **Pre-conditions**: `prefers-reduced-motion: reduce` is enabled.
- **Test Steps**:
  1. Locate Trainer 1 TiltCard: `<div class="tilt-card" data-trainer="marcus">`.
  2. Dispatch pointermove across card surface from corner $(10, 10)$ to center $(150, 200)$.
- **Expected Assertions**:
  - `transform: perspective(...) rotateX(...) rotateY(...)` is NOT applied to card element.
  - Card retains static planar transform (`transform: none` or subtle `translateY(-4px)`).
  - High-contrast border highlight `#C6FF33` remains fully active on hover/focus.
  - Trainer credentials, certifications, and bio remain 100% readable.

#### Spec T3-14: WebGL Context Loss (`webglcontextlost`) -> Instant Fallback to Static Hero Graphic & CSS Glows
- **Features Tested**: Feature 12 (WebGL Fallback) + Feature 14 (3D Hero Figure)
- **Pre-conditions**: 3D Canvas actively rendering Hero athletic figure.
- **Test Steps**:
  1. Obtain active WebGL context and trigger synthetic context loss event:
     `canvas.dispatchEvent(new Event('webglcontextlost'))`.
  2. Observe WebGL capability detector and UI DOM updates.
- **Expected Assertions**:
  - `event.preventDefault()` is executed to permit WebGL context recovery if available.
  - `isWebGLAvailable` state flag flips to `false`.
  - Fixed background canvas unmounts or is hidden via `opacity-0 pointer-events-none`.
  - Fallback hero container mounts `<div class="webgl-fallback-hero">`.
  - Fallback renders optimized static hero visual with layered CSS radial glows in `#7D39EB` and `#C6FF33`.
  - No uncaught JavaScript exceptions or infinite render loops occur.

#### Spec T3-15: WebGL Context Restored (`webglcontextrestored`) -> 3D Scene Re-initialization & Fallback Disposal
- **Features Tested**: Feature 12 (WebGL Fallback) + Feature 14 (Hero Figure) + Feature 18 (GPU Memory Disposal)
- **Pre-conditions**: Application is running in WebGL fallback mode following Spec T3-14.
- **Test Steps**:
  1. Dispatch `webglcontextrestored` event on canvas.
  2. Observe state change and scene rebuilding.
- **Expected Assertions**:
  - `isWebGLAvailable` flips back to `true`.
  - Fallback hero graphic is cleanly unmounted from DOM.
  - Three.js WebGLRenderer re-compiles shader programs and re-binds geometries.
  - Athletic Hero figure and lighting rig re-render at correct viewport dimensions.

#### Spec T3-16: Training Program Card Syllabus Modal Open -> Focus Trap Activated -> Escape Key Closes Modal
- **Features Tested**: Feature 4 (Programs Section) + Feature 2 (Lightbox/Modal UI) + Feature 17 (Accessibility)
- **Pre-conditions**: User scrolled to Training Programs section.
- **Test Steps**:
  1. Click syllabus button on Strength Training card: `<button data-syllabus-for="strength">VIEW SYLLABUS</button>`.
  2. Verify Syllabus Modal opens: `role="dialog"`, `aria-modal="true"`.
  3. Attempt to Tab through interactive elements.
  4. Press `Escape` keyboard key.
- **Expected Assertions**:
  - Modal overlay mounts with `aria-labelledby="modal-title-strength"`.
  - Tab navigation cycles exclusively among elements inside the modal (Close button, Curriculum links, Download button).
  - Tabbing past the last modal element wraps focus back to the first.
  - Pressing `Escape` closes the modal immediately.
  - Focus returns cleanly to the triggering "VIEW SYLLABUS" button.

#### Spec T3-17: Gallery Item Click -> Lightbox Modal Open -> Left/Right Arrow Navigation -> Counter Update
- **Features Tested**: Feature 8 (Gallery Experience) + Feature 2 (Lightbox Modal) + Feature 17 (Keyboard Navigation)
- **Pre-conditions**: Gallery masonry loaded with 6 facility photos.
- **Test Steps**:
  1. Click thumbnail button for Image 1 (Powerlifting Platform): `<button data-gallery-index="0">`.
  2. Verify Lightbox mounts with high-resolution image 1 and counter `"1 / 6"`.
  3. Dispatch `keydown` event with key `'ArrowRight'`.
  4. Dispatch `keydown` event with key `'ArrowLeft'`.
- **Expected Assertions**:
  - On `'ArrowRight'`: Active image switches to Image 2 (Dumbbell Bay); counter updates to `"2 / 6"`.
  - On `'ArrowLeft'`: Active image switches back to Image 1; counter updates to `"1 / 6"`.
  - Image element includes valid descriptive `alt` attribute.
  - Lightbox image transition is smooth with zero layout shift.

#### Spec T3-18: Gallery Lightbox Open -> Background Scroll Lock -> Backdrop Click Dismiss -> Scroll Position Preserved
- **Features Tested**: Feature 8 (Gallery) + Feature 2 (Lightbox) + Feature 18 (Layout Hardening)
- **Pre-conditions**: User scrolled page down to Gallery section (`scrollY = 3400px`).
- **Test Steps**:
  1. Click gallery item to open Lightbox.
  2. Verify `document.body.style.overflow === 'hidden'`.
  3. Dispatch click on the semi-transparent modal backdrop: `<div data-lightbox-backdrop="true">`.
- **Expected Assertions**:
  - Lightbox modal unmounts.
  - `document.body.style.overflow` returns to `''`.
  - `window.scrollY` remains strictly at `3400px` (no jumping to top of page).

#### Spec T3-19: Membership Billing Switcher (Monthly <-> Annual) -> 20% Discount Math & Price Display Sync
- **Features Tested**: Feature 7 (Membership Experience) + Feature 2 (UI Primitives)
- **Pre-conditions**: Membership section rendered. Default billing cycle is Monthly.
- **Test Steps**:
  1. Record baseline prices: Starter = $49/mo, Pro = $89/mo, Elite = $149/mo.
  2. Click billing toggle switch: `<button role="switch" id="billing-cycle-toggle">`.
  3. Observe price updates and discount badge.
  4. Click toggle switch again to revert to Monthly.
- **Expected Assertions**:
  - Toggle switch attribute `aria-checked` flips from `"false"` to `"true"`.
  - A discount badge appears: `"SAVE 20% WITH ANNUAL BILLING"`.
  - Displayed prices recalculate to annual equivalent with 20% discount:
    - Starter: $39/mo (billed annually as $468/yr).
    - Pro: $71/mo (billed annually as $852/yr).
    - Elite: $119/mo (billed annually as $1,428/yr).
  - Toggling back to Monthly restores $49, $89, $149 without rounding errors or string corruption.

#### Spec T3-20: WhatsApp Button Click -> Generates Parameterized URL with Pre-selected Membership Tier & Source
- **Features Tested**: Feature 11 (WhatsApp Integration) + Feature 7 (Membership) + Feature 10 (Final CTA)
- **Pre-conditions**: `siteConfig.whatsappNumber = "15554766367"`. User has clicked "SELECT ELITE" tier card.
- **Test Steps**:
  1. Locate WhatsApp direct action link: `<a data-whatsapp-button="true">`.
  2. Inspect the generated `href` attribute.
  3. Simulate click and verify URL format.
- **Expected Assertions**:
  - `href` starts with `"https://wa.me/15554766367?text="`.
  - Decoded query string text contains: `"Hi IRONFORGE FITNESS, I am interested in the Elite membership tier."`.
  - Link contains security attributes: `target="_blank"` and `rel="noopener noreferrer"`.

#### Spec T3-21: Hero CTA Click ("START YOUR TRANSFORMATION") -> Smooth Scroll to Membership & Pro Card Pulse
- **Features Tested**: Feature 14 (Hero Figure) + Feature 7 (Membership Experience) + Feature 2 (UI Primitives)
- **Pre-conditions**: Page at top.
- **Test Steps**:
  1. Click primary hero button: `<a href="#membership" class="btn-primary">START YOUR TRANSFORMATION</a>`.
  2. Advance scroll position to `#membership`.
- **Expected Assertions**:
  - `window.scrollY` scrolls to `#membership` offset.
  - Pro Membership card (marked "MOST POPULAR") receives a momentary accent glow/pulse animation in `#C6FF33`.
  - Card focus ring activates for keyboard users.

#### Spec T3-22: Viewport Orientation / DPR Change -> Adaptive DPR Re-clamping & Buffer Resize
- **Features Tested**: Feature 12 (3D Canvas) + Feature 18 (Mobile Hardening)
- **Pre-conditions**: Running on mobile viewport (width: 390px, height: 844px, `window.devicePixelRatio = 3.0`).
- **Test Steps**:
  1. Assert initial canvas DPR is clamped to `1.3` (per mobile performance rule: `min(dpr, 1.3)`).
  2. Simulate orientation change to landscape (width: 844px, height: 390px).
  3. Dispatch `'resize'` event.
- **Expected Assertions**:
  - Three.js WebGLRenderer `.setSize(844, 390)` is called.
  - Renderer `.setPixelRatio(1.3)` remains clamped, preventing GPU memory bloat.
  - Camera aspect ratio updates to $844 / 390 \approx 2.164$ and `.updateProjectionMatrix()` is invoked.
  - Zero horizontal overflow on page (`document.documentElement.scrollWidth === 844`).

#### Spec T3-23: Keyboard Tab Navigation Cycle -> 3D Canvas Focus Bypass (`tabindex="-1"`) -> Skip Link Jump
- **Features Tested**: Feature 3 (Navbar) + Feature 17 (Accessibility) + Feature 14 (Hero)
- **Pre-conditions**: User focuses page via Tab key.
- **Test Steps**:
  1. First Tab press: Verify Skip to Main Content link becomes visible and focused.
  2. Press Enter on Skip Link.
  3. Verify focus lands on `#main-content`.
  4. Tab forward to inspect background Canvas element.
- **Expected Assertions**:
  - Skip link has `href="#main-content"` and acquires visible focus ring `#C6FF33`.
  - Background `<canvas>` element possesses `tabindex="-1"` and `aria-hidden="true"`, preventing invisible focus trapping.
  - Keyboard focus navigates logically from Skip link to Navbar links to Main Content interactive elements.

#### Spec T3-24: Final CTA "CLAIM 1-DAY PASS" Click -> Opens Contact Modal with Trial Pre-selected & Demo Notice
- **Features Tested**: Feature 10 (Final CTA) + Feature 11 (Contact Form) + Feature 2 (Modal Primitives)
- **Pre-conditions**: User at bottom of page at Final CTA section.
- **Test Steps**:
  1. Click CTA button: `<button data-cta-action="trial-pass">CLAIM FREE 1-DAY PASS</button>`.
  2. Inspect the opened enquiry modal dialog.
- **Expected Assertions**:
  - Modal mounts with title: `"Claim Your 1-Day VIP Pass"`.
  - Contact form interest dropdown defaults to `'personal-training'` or `'trial-pass'`.
  - Demo mode badge is prominent: `"IRONFORGE DEMO — No payment or credit card required"`.
  - Form validation, submission, and confirmation execute cleanly inside the modal.

---

### 2.3 Tier 4: Real-World Application Scenario Specifications (10 Journeys)

#### Scenario T4-SCN-01: Prospect Gym Owner VIP Desktop Evaluation Tour
- **Persona**: Marcus Sterling, owner of a 3-location boutique gym chain evaluating the IRONFORGE website design to commission a custom 3D web platform for his clubs.
- **Environment**: Desktop Chrome, 1920x1080 resolution, high-performance GPU, full WebGL 2.0 support.
- **Journey Workflow**:
  1. **Hero Experience**: Lands on homepage. Observes cinematic 1.2s spotlight strobe and athletic figure reveal. Tests subtle mouse parallax response across deltoids and chalk dust particles. Verifies exact 4-color palette adherence (#000000, #7D39EB, #C6FF33, #FFFFFF).
  2. **Scroll Narrative Journey**: Initiates continuous mousewheel scroll down. Observes GSAP ScrollTrigger camera gliding along Catmull-Rom spline through 5 distinct scenes:
     - *Scene 1 (The Beginning)*: Athletic Hero stance.
     - *Scene 2 (Strength)*: Transition to Training Programs arena.
     - *Scene 3 (Performance)*: Focus shifts to lifting platform and Equipment Showcase.
     - *Scene 4 (Discipline)*: Camera frames trainer coaching stations and membership tier pedestals.
     - *Scene 5 (Your Next Level)*: Convergence onto illuminated iron archway and conversion portal.
  3. **3D Equipment Showcase Testing**: Pauses at Equipment Showcase. Switches tabs between Barbell, Dumbbell, Plates, and Bench. Clicks interactive hotspots to inspect callout details. Drags Dumbbell 360 degrees to evaluate OrbitControls responsiveness.
  4. **Bento Grid & Trainer Credibility**: Inspects 4-cell Bento Grid (Equipment, Trainers, Facilities, Community). Hovers over 3 trainer profiles to verify smooth 3D card tilt physics and certifications.
  5. **Membership & Commercial Transparency**: Compares Starter, Pro, Elite tiers. Toggles annual discount. Verifies that placeholder demo pricing is clear and professional.
  6. **Footer & Sales Attribution**: Scrolls to Footer. Confirms demo mode disclaimer, operating hours, and sales showcase attribution ("Designed for Premium Fitness Brands").
- **Verification Assertions**:
  - Zero console errors or warnings throughout full page lifecycle.
  - 60 FPS maintained during 3D camera spline animations.
  - All brand contrast ratios meet or exceed WCAG AAA standards.
  - Interactive 3D OrbitControls smoothly captures and releases pointer events.

#### Scenario T4-SCN-02: High-Intent Member Lead Discovery to Contact Submission
- **Persona**: Elena Rostova, competitive powerlifter seeking a serious training facility with calibrated competition plates and certified strength coaching.
- **Environment**: Desktop/Laptop 1440x900, trackpad scrolling.
- **Journey Workflow**:
  1. **Landing & Intent**: Lands on site. Immediately notices headline "FORGE YOUR INNER BEAST" and stats bar ("24/7 ACCESS", "OLYMPIC GRADE", "ZERO COMPROMISE").
  2. **Direct Navigation**: Clicks "MEMBERSHIP" link in floating glass navbar. Page smoothly scrolls to `#membership`.
  3. **Plan Evaluation**:
     - Reviews Starter ($49), Pro ($89 - Most Popular), Elite ($149).
     - Clicks billing toggle to "Annual" -> Prices update to $39, $71, $119 with "SAVE 20%" badge.
     - Checks comparison matrix: verifies that "Calibrated Competition Plates", "Coaching Consultations", and "24/7 Turf Access" are included in Pro and Elite.
  4. **Enquiry Conversion**:
     - Clicks "SELECT PRO" CTA button on Pro card.
     - Page smooth-scrolls to Contact Form; interest dropdown automatically displays `'pro'`.
     - Elena enters: Name: `"Elena Rostova"`, Phone: `"+1 (555) 234-5678"`, Email: `"elena.lifts@example.com"`, Message: `"Looking to train for USAPL nationals. Would like to tour the barbell platforms."`.
     - Clicks "SEND ENQUIRY".
  5. **Feedback Loop**:
     - Button displays loading spinner and disables double-clicks.
     - 400ms later, success card mounts with checkmark icon and text: `"Enquiry Received! Thank you Elena, a coach will reach out within 2 hours."`.
     - Prominent tag: `"DEMO MODE: Form submission verified successfully without external email dispatch."`.
- **Verification Assertions**:
  - Contact form fields validate input strings using correct regexes.
  - Interest prefill matches clicked tier without manual user intervention.
  - Success state displays within < 500ms without full page reload.
  - Form state resets cleanly when navigating away or clicking "Send Another".

#### Scenario T4-SCN-03: Mobile Smartphone Visitor Touch Journey (iOS Safari / Android Chrome)
- **Persona**: Liam, 24-year-old fitness enthusiast browsing the gym website from his iPhone 15 Pro while on the commute.
- **Environment**: Mobile viewport (390x844px), DPR 3.0, touch input, mobile network latency.
- **Journey Workflow**:
  1. **Initial Mobile Render**: Page loads in mobile portrait. Canvas detects mobile device pixel ratio and clamps rendering DPR to 1.3 to conserve battery and GPU memory.
  2. **Horizontal Overflow Check**: Verifies that page does not wobble or scroll horizontally (`scrollWidth === clientWidth === 390px`).
  3. **Mobile Drawer Navigation**:
     - Taps floating hamburger menu icon on right side of top navigation bar.
     - Mobile drawer slides in from right with Electric Violet glowing border.
     - Taps "PROGRAMS" nav link.
     - Drawer automatically closes; page scrolls smoothly to `#programs`.
  4. **Touch Interactions**:
     - Swipes horizontally through Training Programs carousel/cards.
     - Taps "HIIT & CONDITIONING" card to view modal detail view.
     - Reads program syllabus, heart rate zones, and session schedule.
     - Taps backdrop overlay or "Close" icon to dismiss modal.
  5. **Quick-Action WhatsApp Conversion**:
     - Taps floating quick-action WhatsApp button positioned at bottom-right of mobile screen (`bottom-6 right-6`).
     - Verifies device attempts to launch WhatsApp with pre-filled message text.
- **Verification Assertions**:
  - Mobile drawer maintains strict focus trapping and restores body scroll upon close.
  - Clamped DPR (1.3) prevents mobile WebGL context crash or frame drop.
  - All touch targets have minimum dimensions of $44 \times 44$ px per Apple Human Interface Guidelines.
  - Floating WhatsApp icon stays within safe viewport boundaries without obscuring primary content.

#### Scenario T4-SCN-04: Low-Spec Hardware / WebGL-Disabled Hardware Fallback Journey
- **Persona**: David, visiting from a corporate desktop with disabled hardware acceleration or an older browser where WebGL is unavailable.
- **Environment**: Chrome/Firefox with WebGL flag disabled (`canvas.getContext('webgl') === null`).
- **Journey Workflow**:
  1. **Detection & Zero-Crash Safeguard**: Browser loads page. `src/lib/webglSupport.ts` executes capability detection. Detects WebGL context creation returns `null`.
  2. **Graceful Fallback Activation**:
     - Avoids mounting R3F `<Canvas>` to prevent browser error modal or fatal uncaught WebGL errors.
     - Mounts `<FallbackHeroImage />` with optimized static visual of athletic figure.
     - Applies rich CSS radial gradients (`radial-gradient(circle, #7D39EB 0%, transparent 70%)` and `#C6FF33` edge glow) to recreate atmospheric rim lighting.
  3. **Showcase Fallback**:
     - Equipment Showcase detects 2D mode and renders interactive high-resolution multi-view image gallery of Barbell, Dumbbell, Plates, and Bench with full specifications and interactive tabs.
  4. **Content & Functional Completeness**:
     - All 7 HTML content sections (Programs, About, Trainers, Membership, Gallery, Testimonials, Contact) remain 100% interactive, responsive, and functional.
     - User fills out contact form and submits enquiry without degradation.
- **Verification Assertions**:
  - Zero uncaught exceptions in console (`TypeError: Cannot read properties of null (reading 'getContext')`).
  - Fallback hero image has `alt="IRONFORGE Athletic Figure in Industrial Gym"` and renders above fold.
  - Form validation, navigation links, and modals function identically to WebGL-enabled mode.

#### Scenario T4-SCN-05: Accessibility-First & Reduced Motion Journey (Screen Reader + Keyboard Only)
- **Persona**: Jordan, athlete with vestibular sensitivity who uses keyboard navigation and screen reader software with `prefers-reduced-motion: reduce` OS setting.
- **Environment**: Desktop with keyboard only (no mouse/pointer), OS setting `prefers-reduced-motion: reduce`, NVDA/VoiceOver screen reader semantics.
- **Journey Workflow**:
  1. **Skip Navigation**:
     - Presses `Tab` key upon page load.
     - "Skip to main content" link becomes visible with high-contrast Acid Lime border (`focus:ring-2 focus:ring-[#C6FF33]`).
     - Presses `Enter` -> Focus moves directly to `<main id="main-content">`.
  2. **Reduced Motion Verification**:
     - ScrollTrigger detects `prefers-reduced-motion: reduce`.
     - Intense 3D camera spline rotation and zoom are disabled.
     - As user scrolls/tabs down, sections appear with simple, gentle opacity transitions rather than dynamic physical swoops.
  3. **Accessible Keyboard Navigation**:
     - Tabs through Navigation links (`Home`, `Programs`, `About`, `Trainers`, `Equipment`, `Membership`, `Gallery`, `Contact`).
     - Each active focus state produces an unambiguous 2px solid `#C6FF33` ring with 16.5:1 contrast against black background.
  4. **Trainer Cards Interaction**:
     - Tabs into Trainer section.
     - TiltCard 3D perspective tilt (`rotateX`, `rotateY`) is suppressed to prevent disorientation.
     - Trainer details (Certifications, Speciality) are announced via accessible semantic markup (`<h3>`, `<ul>`, `<li>`).
  5. **Modal & Lightbox Accessibility**:
     - Tabs into Gallery, presses `Enter` on image.
     - Lightbox modal announces `role="dialog"` and `aria-label="Gallery Image Lightbox"`.
     - Background content receives `aria-hidden="true"`.
     - Uses Left/Right arrow keys to cycle images.
     - Presses `Escape` -> Modal closes and keyboard focus returns strictly to the thumbnail button.
- **Verification Assertions**:
  - 100% of interactive elements are reachable and operable via keyboard.
  - Zero focus traps outside of intentionally modal dialogs.
  - All images include descriptive `alt` text; all icon-only buttons include `aria-label`.
  - Color is never used as the sole indicator of state (icons and text labels accompany color changes).

#### Scenario T4-SCN-06: Equipment Enthusiast Deep 3D Apparatus Exploration Journey
- **Persona**: Jax, strength coach and gym equipment reviewer analyzing the technical specifications of IRONFORGE's commercial hardware.
- **Environment**: Desktop 2560x1440, precision mouse.
- **Journey Workflow**:
  1. **Navigate to Showcase**: Scrolls to Equipment Showcase section ("INDUSTRIAL HARDWARE // BUILT TO LAST").
  2. **Barbell Deep Dive**:
     - Active item: "Olympic Barbell & Bumpers".
     - Inspects specs: Shaft diameter (28mm), tensile strength (215,000 PSI), bushing/bearing hybrid collars.
     - Clicks Hotspot 1 (Knurl) -> Reads callout on Volcano Knurl pattern.
     - Clicks Hotspot 2 (Sleeve) -> Reads callout on Hard Chrome finish.
  3. **Dumbbell Inspection & OrbitControls Manipulation**:
     - Clicks tab "Pro-Hex Dumbbell".
     - Barbell model smoothly unmounts and Dumbbell model mounts without stutter.
     - Uses left-click drag to rotate Dumbbell horizontally and vertically.
     - Observes dynamic specular reflections on the urethane head highlighting brand color accents (#7D39EB rim light and #C6FF33 kicker).
     - Verifies OrbitControls clamps polar angle (`minPolarAngle: 0.2`, `maxPolarAngle: Math.PI / 2 + 0.1`) so camera cannot clip below the rubber gym floor.
  4. **Plates & Commercial Bench**:
     - Switches to "Calibrated Competition Plates (25kg)" -> Observes Olympic color coding with red/violet rim and chrome hub.
     - Switches to "Commercial Workout Bench" -> Inspects 11-gauge steel frame and 7 backrest incline positions.
  5. **Memory Leak Prevention Verification**:
     - Cycles through all 4 equipment items multiple times.
     - Verifies GPU draw calls and heap memory remain stable via Three.js `.dispose()` lifecycle management.
- **Verification Assertions**:
  - Model transitions execute cleanly within 300ms.
  - OrbitControls drag gesture never triggers parent page scroll.
  - Continuous harmonic levitation continues seamlessly when mouse drag ends.
  - Previous geometries, textures, and materials are properly garbage collected.

#### Scenario T4-SCN-07: Visual Explorer Facility & Community Gallery Browsing Journey
- **Persona**: Chloe, yoga and functional fitness athlete interested in gym ambiance, cleanliness, natural lighting, and community culture.
- **Environment**: iPad / Tablet 1024x768 (touch and pointer).
- **Journey Workflow**:
  1. **Gallery Arrival**: Scrolls to Gallery Experience section.
  2. **Masonry Layout & Lazy Loading**:
     - Observes responsive 3-column masonry grid.
     - Images outside initial viewport render low-weight placeholder blur before lazy loading high-res assets via `IntersectionObserver`.
  3. **Category Filtering**:
     - Default filter is "All" (6 photos displayed).
     - Taps "Functional Turf" filter pill -> Non-matching photos transition out (`opacity-0 scale-95`); matching functional area photos smoothly rearrange into grid.
     - Taps "Recovery & Lounge" -> Displays sauna, cold plunge, and protein bar facilities.
  4. **Fullscreen Lightbox Browsing**:
     - Taps cold plunge facility photo.
     - Fullscreen lightbox opens with dark obsidian backdrop (`bg-black/95 backdrop-blur-md`).
     - Reads caption: `"Contrast Therapy Suite: 3°C Cold Plunge & 90°C Finnish Sauna"`.
     - Swipes left on touch screen to advance to next photo.
     - Taps "Close" (X) button at top-right to exit lightbox.
- **Verification Assertions**:
  - Lazy loading prevents offscreen image network requests until user scrolls within 300px threshold.
  - Category filtering correctly filters DOM elements with zero layout flicker.
  - Lightbox handles touch swipe gestures and touch dismissal cleanly.
  - Body scroll lock prevents background scrolling while lightbox is active.

#### Scenario T4-SCN-08: Direct VIP Lead WhatsApp Conversion Pipeline Journey
- **Persona**: Tariq, busy tech entrepreneur seeking 1-on-1 executive strength coaching with Head Coach Marcus Vance.
- **Environment**: Mobile Android Chrome (Samsung Galaxy S24, 412x915px).
- **Journey Workflow**:
  1. **Trainer Discovery**:
     - Scrolls directly to Trainers section.
     - Reads Coach Marcus Vance's profile: "Head Strength Coach / CSCS / 12+ Years Experience".
     - Reviews specialty: "Executive Strength & Metabolic Conditioning".
  2. **WhatsApp Action Trigger**:
     - Taps "BOOK CONSULTATION WITH MARCUS" button on Marcus's card.
  3. **Parameter Construction & Intent Preservation**:
     - Conversion handler intercepts click.
     - Encodes pre-filled query string:
       `https://wa.me/15554766367?text=Hi%20IRONFORGE,%20I'd%20like%20to%20book%20a%20Personal%20Training%20consultation%20with%20Marcus%20Vance.`
     - Launches WhatsApp protocol or external web link with `target="_blank"` and `rel="noopener noreferrer"`.
  4. **Floating Action Backup**:
     - Taps floating WhatsApp pill at bottom-right of page.
     - Verifies generic greeting link is generated: `"Hi IRONFORGE FITNESS, I have an enquiry about your membership."`.
- **Verification Assertions**:
  - WhatsApp phone number is cleanly formatted in international E.164 without hyphens, brackets, or leading plus.
  - URI encoding safely handles special characters, commas, and apostrophes.
  - Click event fires analytics/telemetry callback before navigating.

#### Scenario T4-SCN-09: Contact Form Validation Recovery & Demo Lead Submission Flow
- **Persona**: Samantha, prospective member who makes multiple input mistakes before successfully registering for a gym tour.
- **Environment**: Desktop Firefox, 1920x1080.
- **Journey Workflow**:
  1. **Initial Submission Attempt (Empty Form)**:
     - Scrolls to `#contact` section.
     - Leaves all fields empty and clicks "SEND ENQUIRY".
     - Client-side validation halts submission.
     - All 4 required fields (Name, Phone, Email, Message) display inline error tags.
     - Form container announces `"Form contains 4 errors. Please review the highlighted fields."` via `aria-live="polite"`.
     - First invalid input (Name) automatically receives keyboard focus.
  2. **Invalid Data Entry (Partial Correction)**:
     - Enters Name: `"Samantha Wright"`. Error clears on blur.
     - Enters invalid Phone: `"abcd"` -> Error displays `"Please enter a valid phone number (e.g. +1 555-0199)"`.
     - Enters invalid Email: `"samantha@"` -> Error displays `"Please enter a complete email address"`.
     - Types Message: `"Looking for a morning pass."`.
     - Clicks "SEND ENQUIRY" -> Submission halted due to remaining Phone and Email errors.
  3. **Complete Correction & Submission**:
     - Corrects Phone: `"+1-555-482-9102"`. Phone error clears.
     - Corrects Email: `"samantha.wright@example.com"`. Email error clears.
     - Selects Membership Interest: `"Starter ($49/mo)"`.
     - Clicks "SEND ENQUIRY".
  4. **Submission Cycle**:
     - Button enters loading state: spinner renders, text reads `"SENDING ENQUIRY..."`, button is disabled against double submit.
     - Simulated network delay completes (500ms).
     - Form transitions to success view: animated checkmark with Acid Lime border, headline `"Enquiry Dispatched!"`, subtext `"Welcome Samantha, our team will contact you shortly."`.
     - Demo mode pill is rendered prominently: `"DEMO MODE ACTIVE: No actual email transmitted."`.
- **Verification Assertions**:
  - Validation rules execute purely on client without server roundtrips.
  - Error messages meet WCAG contrast guidelines and have `role="alert"`.
  - Double-clicking submit button while loading triggers exactly ONE submission.
  - Demo mode notice is unambiguous and prevents user confusion.

#### Scenario T4-SCN-10: Full-Site Narrative Scroll-Through Experience (Hero to Footer CTA)
- **Persona**: First-time visitor experiencing the complete interactive storytelling narrative of IRONFORGE FITNESS from the opening hero reveal to the final footer CTA.
- **Environment**: Full HD Desktop (1920x1080), 60Hz display, continuous mousewheel scroll.
- **Journey Workflow**:
  1. **Act 1: The Beginning (Hero)**:
     - Loads page at `scrollY = 0`.
     - Atmospheric reveal: Spotlight strobes, dark industrial floor illuminates, athletic figure power stance resolves.
     - Brand headline: `"FORGE YOUR INNER BEAST // IRONFORGE FITNESS"`.
  2. **Act 2: Strength (Programs)**:
     - User scrolls to 20% mark.
     - Camera eases into training floor.
     - Programs grid reveals 4 disciplines: Strength Training, HIIT & Conditioning, Personal Training, Functional Fitness.
     - Hovering cards triggers subtle electric violet glow.
  3. **Act 3: Performance (About & Equipment)**:
     - User scrolls to 45% mark.
     - Camera tracks to center lifting platform.
     - Bento Grid showcases gym facilities, community, and certified trainers.
     - Equipment Showcase presents 3D Barbell, Dumbbell, Plates, and Bench with interactive rotation.
  4. **Act 4: Discipline (Trainers & Membership)**:
     - User scrolls to 70% mark.
     - Camera pulls back to high-bay vantage point.
     - 3 Trainer tilt cards display coaches Marcus, Anya, and Liam with credentials and quotes.
     - Membership section displays Starter, Pro, and Elite tiers with monthly/annual billing switch.
  5. **Act 5: Your Next Level (Testimonials & Final CTA)**:
     - User scrolls to 100% mark.
     - Camera locks onto illuminated iron doorway portal at rear of gym.
     - 3 demo member testimonials display verified 5-star ratings.
     - Final conversion banner invites user to `"CLAIM YOUR 1-DAY VIP PASS"`.
     - Footer provides operating hours (Mon-Fri 05:00-23:00, Sat-Sun 06:00-22:00), social links, and demo attribution.
- **Verification Assertions**:
  - Catmull-Rom spline camera transitions smoothly through all 5 waypoints without hitching or camera clipping.
  - ScrollSpy keeps navigation links in sync with viewport position at all scroll offsets.
  - Zero layout thrashing or cumulative layout shift (CLS < 0.05).
  - Background 3D canvas and foreground HTML content layers remain perfectly decoupled.

---

## 3. Caveats

1. **Headless vs Real Browser Execution**:
   - The zero-dependency test runner (`tests/runner.js` + `tests/helpers/*`) simulates DOM, events, and WebGL contexts in pure Node.js memory. This guarantees ultra-fast (<2s) and 100% deterministic execution on any machine without installing massive browser binaries (e.g. Chromium 300MB).
   - Real browser visual layout engines (CSS grid subpixel reflows, font metrics, GPU rasterization) are not executed by Node.js. Visual layout and build verification are corroborated via `npm run build` (Next.js production build) and strict TypeScript checking (`tsc --noEmit`).
2. **WebGL Shader Execution**:
   - The WebGL helper mock (`tests/helpers/webgl.js`) verifies WebGL context allocation, parameter configuration, extension presence, capability detection, and context loss/recovery events. It does not execute raw GPU GLSL vertex/fragment shading on real GPU silicon.
3. **Scroll & Physics Simulation**:
   - GSAP ScrollTrigger and Catmull-Rom camera curves are evaluated mathematically using simulated normalized scroll progress ($p \in [0.0, 1.0]$). Real touch inertia and trackpad deceleration curves may vary slightly by operating system.

---

## 4. Conclusion

1. **Test Runner Architecture**:
   - The recommended design consists of a self-contained, zero-dependency Node.js test runner in `tests/runner.js` coupled with specialized opaque-box helpers in `tests/helpers/` (`assert.js`, `dom.js`, `webgl.js`, `state.js`, `scroll.js`, `mock.js`).
   - This runner satisfies all constraints: zero network requirements, zero external npm package dependencies, deterministic execution, per-test timeout isolation, ANSI colorized reporting, and machine-readable TAP/JSON summary output.
2. **Tier 3 Cross-Feature Test Specifications**:
   - 24 comprehensive test specifications have been formulated, covering every critical pairwise and multi-module interaction across all 20 inventoried features.
   - Key interaction areas: Navbar <-> ScrollTrigger camera, Membership selection <-> Contact form prefill, Equipment switch <-> Hotspot specs, Mobile drawer <-> Viewport resize & body scroll lock, WebGL context loss <-> Fallback graphics, and Accessibility reduced-motion overrides.
3. **Tier 4 Real-World Application Scenarios**:
   - 10 complete, end-to-end prospect user journeys have been architected, simulating gym owners, high-intent leads, smartphone visitors, low-spec hardware users, accessibility users, equipment reviewers, and full-site storytelling navigators.
4. **Readiness for Implementation**:
   - The test specifications provide exact input sequences, expected state transitions, DOM query selectors, ARIA attributes, and boundary assertions, enabling the downstream test authoring phase (Milestone M5 / Track T0-T4) to implement the complete test suite seamlessly.

---

## 5. Verification Method

### 5.1 Independent Test Runner Execution
When implemented, the test runner is invoked directly via Node.js from the project root:
```bash
node tests/runner.js
```

### 5.2 Specific Tier & Filtering Execution
The test runner architecture supports targeted execution:
```bash
# Run exclusively Tier 3 Cross-Feature tests
node tests/runner.js --tier=3

# Run exclusively Tier 4 Real-World Scenario tests
node tests/runner.js --tier=4

# Run with regex filter on test name
node tests/runner.js --filter="Equipment"
```

### 5.3 Success & Invalidation Criteria
- **Pass Condition**:
  - Exit code `0`.
  - All test suites execute with zero uncaught rejections.
  - JSON output in `test-results.json` records 100% passed tests across all active suites.
- **Invalidation Condition**:
  - Exit code `1`.
  - Any assertion failure in `assert.js` or timeout (>3000ms).
  - External network dependency or missing module error.
