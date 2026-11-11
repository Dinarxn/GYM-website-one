# E2E Test Infra: IRONFORGE FITNESS

## Test Philosophy
- **Opaque-box, requirement-driven**: Tests derive strictly from user requirements in `ORIGINAL_REQUEST.md` and feature definitions in `PROJECT.md`, without coupling to internal private state.
- **Methodology**: Systematic 4-tier testing applying Category-Partition, Boundary Value Analysis (BVA), Pairwise Combinatorial Testing, and Real-World Workload Testing.
- **Deterministic and Environment-Agnostic**: Test harness runs cleanly with Node.js built-ins (`node tests/runner.js`), requiring no external binaries or internet connectivity, but capable of verifying DOM structures, WebGL capability fallbacks, CSS theme variables, regex form patterns, and multi-step user workflows.

## Feature Inventory
| # | Feature | Source (Requirement) | Tier 1 (Coverage) | Tier 2 (Boundaries) | Tier 3 (Cross-Feature) | Tier 4 (Workload) |
|---|---------|---------------------|:-----------------:|:-------------------:|:---------------------:|:-----------------:|
| 1 | Framework & Design Tokens | ORIGINAL_REQUEST §R5, §AC | 5 | 5 | ✓ | ✓ |
| 2 | Component Library & UI Primitives | ORIGINAL_REQUEST §R3, §AC | 5 | 5 | ✓ | ✓ |
| 3 | Floating Navbar & Mobile Drawer | ORIGINAL_REQUEST §R4, §AC | 5 | 5 | ✓ | ✓ |
| 4 | Training Programs Section | ORIGINAL_REQUEST §R3, §AC | 5 | 5 | ✓ | ✓ |
| 5 | About the Gym Bento Grid | ORIGINAL_REQUEST §R3, §AC | 5 | 5 | ✓ | ✓ |
| 6 | Trainers Section & 3D Tilt Cards | ORIGINAL_REQUEST §R3, §AC | 5 | 5 | ✓ | ✓ |
| 7 | Membership Experience | ORIGINAL_REQUEST §R3, §AC | 5 | 5 | ✓ | ✓ |
| 8 | Gallery Experience | ORIGINAL_REQUEST §R3, §AC | 5 | 5 | ✓ | ✓ |
| 9 | Testimonials Section | ORIGINAL_REQUEST §R3, §AC | 5 | 5 | ✓ | ✓ |
| 10 | Final Conversion CTA & Footer | ORIGINAL_REQUEST §R3, §AC | 5 | 5 | ✓ | ✓ |
| 11 | Contact Form & WhatsApp Integration | ORIGINAL_REQUEST §R4, §AC | 5 | 5 | ✓ | ✓ |
| 12 | 3D Canvas & WebGL Fallback Infrastructure | ORIGINAL_REQUEST §R1, §AC | 5 | 5 | ✓ | ✓ |
| 13 | Dark Industrial Gym Environment & Lighting | ORIGINAL_REQUEST §R1, §AC | 5 | 5 | ✓ | ✓ |
| 14 | 3D Athletic Hero Figure & Reveal | ORIGINAL_REQUEST §R1, §AC | 5 | 5 | ✓ | ✓ |
| 15 | GSAP ScrollTrigger 5-Scene Camera Narrative | ORIGINAL_REQUEST §R2, §AC | 5 | 5 | ✓ | ✓ |
| 16 | Interactive 3D Equipment Showcase | ORIGINAL_REQUEST §R2, §AC | 5 | 5 | ✓ | ✓ |
| 17 | Motion Accessibility & Keyboard Navigation | ORIGINAL_REQUEST §R2, §R5, §AC | 5 | 5 | ✓ | ✓ |
| 18 | Mobile-First Performance & Layout Hardening | ORIGINAL_REQUEST §R5, §AC | 5 | 5 | ✓ | ✓ |
| 19 | Production Build & Lint Verification | ORIGINAL_REQUEST §R5, §AC | 5 | 5 | ✓ | ✓ |
| 20 | E2E Testing Suite & Coverage Verification | Dual Track Protocol | 5 | 5 | ✓ | ✓ |

## Test Architecture
- **Location**: `tests/`
  - `runner.js`: Master test runner with async execution, failure tracing, statistics, and tier aggregation.
  - `helpers/assert.js`: Lightweight robust assertion library (`equal`, `deepEqual`, `match`, `throws`, `includes`, `truthy`, `falsy`).
  - `helpers/dom.js`: Opaque-box DOM and virtual component tree simulator for validating HTML semantics, attributes, ARIA roles, and responsive properties.
  - `helpers/webgl.js`: WebGL context mock and capability tester (testing WebGL 1, WebGL 2, context lost, and unsupported fallback modes).
  - `helpers/state.js`: State transition validator for forms, modals, drawers, and scroll progress.
  - `helpers/scroll.js`: ScrollTrigger normalized progress & Catmull-Rom spline evaluator.
  - `helpers/mock.js`: Mock timers, viewport resizing, matchMedia helper.
  - `tier1/`: 20 test suites (one per feature, each with ≥5 tests = 100 total tests).
  - `tier2/`: 20 test suites (one per feature, covering boundaries, edge cases, invalid inputs, extreme viewports = 100 total tests).
  - `tier3/`: Cross-feature test suites covering all 24 Tier 3 cross-feature interaction specifications.
  - `tier4/`: 10 real-world end-to-end prospect journeys and workload scenarios.
- **Invocation**: `node tests/runner.js`
- **Pass/Fail Semantics**: All tests must pass with zero uncaught exceptions and exit code 0.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Prospect Gym Owner Desktop Demo Tour | F1, F3, F12, F14, F15, F16, F10 | High |
| 2 | Member Lead Discovery to Contact Submission | F3, F4, F7, F11 | High |
| 3 | Mobile Visitor Responsive Journey | F3, F7, F11, F18 | High |
| 4 | Low-End Device / WebGL Disabled Fallback Journey | F12, F14, F16, F18, F10 | Medium |
| 5 | Accessibility & Reduced-Motion User Journey | F3, F6, F15, F17, F11 | High |
| 6 | Membership Plan Comparison & Annual Discount Calculation | F2, F7, F11 | Medium |
| 7 | Equipment Showcase Deep Exploration & Hotspot Inspection | F2, F15, F16, F17 | High |
| 8 | Gallery Lightbox Browsing & Keyboard Navigation | F2, F8, F17 | Medium |
| 9 | Contact Form Validation, Error Recovery & Submission Demo Flow | F2, F11, F18 | Medium |
| 10 | Complete WhatsApp Enquiry Conversion Pipeline | F10, F11, F18 | Medium |

## Coverage Thresholds
- **Tier 1**: ≥5 per feature × 20 features = 100 test cases
- **Tier 2**: ≥5 per feature × 20 features = 100 test cases
- **Tier 3**: 24 cross-feature pairwise test cases
- **Tier 4**: 10 realistic application-level scenarios
- **Total**: 234 test cases
