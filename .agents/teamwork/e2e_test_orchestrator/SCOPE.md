# Scope: E2E Testing Track

## Architecture
- **Approach**: Opaque-box, requirement-driven end-to-end testing derived from `ORIGINAL_REQUEST.md` and the 20 features in `PROJECT.md`.
- **Test Runner Framework**: Lightweight, zero-dependency Node.js test harness (`tests/runner.js`) with assertion library, colorized reporting, JSON output summary, and exit code semantics (0 on pass, non-zero on fail).
- **Execution Entrypoint**: `node tests/runner.js` (and compatible with `npm test`).
- **Hierarchy & Layout**:
  - `tests/runner.js` — Test runner engine with suite runner, timeout handling, and test aggregation.
  - `tests/helpers/` — Assertion utilities, schema validators, DOM/HTML parser, mock environment helpers.
  - `tests/tier1/` — Tier 1 Feature Coverage (5 tests per feature for features 1-20 = 100 tests).
  - `tests/tier2/` — Tier 2 Boundary & Corner Cases (5 tests per feature = 100 tests).
  - `tests/tier3/` — Tier 3 Cross-Feature Interactions (20+ pairwise integration tests).
  - `tests/tier4/` — Tier 4 Real-World Application Scenarios (10+ comprehensive prospect user journeys).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Framework Scaffolding & Design Tokens | Next.js 15, React 19, TS strict, Tailwind v4, 4-color palette | T1, T2 | PROJECT #1, R5 |
| 2 | Component Library & UI Primitives | Button, Badge, TiltCard, LightboxModal, SectionHeader | T1, T2 | PROJECT #2, R3 |
| 3 | Floating Navbar & Mobile Drawer | Glass navbar, blur, scrollspy, mobile drawer, focus trap | T1, T2, T3 | PROJECT #3, R4 |
| 4 | Training Programs Section | 4 disciplines, cards, detail modal | T1, T2 | PROJECT #4, R3 |
| 5 | About the Gym Bento Grid | Equipment, Trainers, Facilities, Community layout | T1, T2 | PROJECT #5, R3 |
| 6 | Trainers Section & 3D Tilt Cards | 3 trainer profiles, stats, tilt physics, reduced-motion fallback | T1, T2 | PROJECT #6, R3 |
| 7 | Membership Experience | Starter, Pro, Elite, monthly/annual toggle, comparison matrix | T1, T2, T3 | PROJECT #7, R3 |
| 8 | Gallery Experience | Masonry layout, lazy loading, lightbox modal | T1, T2 | PROJECT #8, R3 |
| 9 | Testimonials Section | 3 fictional demo testimonials, demo badge, rating | T1, T2 | PROJECT #9, R3 |
| 10 | Final Conversion CTA & Footer | Cinematic banner, join/trial action, hours, disclaimer footer | T1, T2 | PROJECT #10, R3 |
| 11 | Contact Form & WhatsApp Integration | 5-state form, validation, demo mode notice, WhatsApp link | T1, T2, T3 | PROJECT #11, R4 |
| 12 | 3D Canvas & WebGL Fallback Infrastructure | Persistent R3F canvas, SSR-safe mounting, adaptive DPR, WebGL detection, static hero fallback | T1, T2 | PROJECT #12, R1 |
| 13 | Dark Industrial Gym Environment & Lighting | 4-color lighting rig (#000000, #7D39EB, #C6FF33, #FFFFFF), rubber floor, chalk dust particles | T1, T2 | PROJECT #13, R1 |
| 14 | 3D Athletic Hero Figure & Reveal | Power stance sculpt, dual rim lighting, cinematic reveal, pointer parallax | T1, T2 | PROJECT #14, R1 |
| 15 | GSAP ScrollTrigger 5-Scene Camera Narrative | Beginning, Strength, Performance, Discipline, Next Level, Catmull-Rom lerp | T1, T2, T3 | PROJECT #15, R2 |
| 16 | Interactive 3D Equipment Showcase | Barbell, Dumbbell, Plates, Bench, drag-to-rotate OrbitControls, levitation, hotspots | T1, T2, T3 | PROJECT #16, R2 |
| 17 | Motion Accessibility & Keyboard Navigation | prefers-reduced-motion camera locking, accessible keyboard nav | T1, T2 | PROJECT #17, R2 |
| 18 | Mobile-First Performance & Layout Hardening | Zero horizontal overflow, touch gestures, GPU disposal, DPR clamping | T1, T2 | PROJECT #18, R5 |
| 19 | Production Build & Lint Verification | Clean build, strict typecheck, lint compliance | T1, T2 | PROJECT #19, R5 |
| 20 | E2E Testing Suite & Coverage Verification | Complete test suite coverage, all tiers verified | T1, T2, T3, T4 | PROJECT #20 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| T0 | Test Infrastructure & Runner Harness | Test runner engine (`tests/runner.js`), assertion helpers (`tests/helpers/assert.js`), mock environments, test registry | none | IN_PROGRESS |
| T1 | Tier 1: Feature Coverage (100 tests) | 5 opaque-box verification tests per feature for all 20 features | T0 | PLANNED |
| T2 | Tier 2: Boundary & Corner Cases (100 tests) | 5 boundary/corner/negative tests per feature for all 20 features | T0 | PLANNED |
| T3 | Tier 3: Cross-Feature Interactions (20+ tests) | Pairwise feature interaction tests across navbar, 3D, modal, forms, and responsive behavior | T1, T2 | PLANNED |
| T4 | Tier 4: Real-World Scenarios (10+ tests) | End-to-end prospect gym owner and member journey simulations | T3 | PLANNED |
| T5 | Suite Consolidation & Readiness Signal | Run full test suite, verify clean exit code and threshold compliance, publish `TEST_READY.md` | T1, T2, T3, T4 | PLANNED |

## Interface Contracts
### Test Harness Interface
```javascript
// Test Definition Contract
describe(suiteName, () => {
  test(testName, async (t) => {
    t.assert(condition, message);
    t.assertEqual(actual, expected, message);
    t.assertMatch(str, regex, message);
    t.assertThrows(fn, expectedError, message);
  });
});
```
### Test Runner CLI Contract
- Command: `node tests/runner.js`
- Exit Code: 0 on all tests passed; non-zero if any test fails.
- Output: Structured console log with pass/fail counts per tier and overall JSON summary.
