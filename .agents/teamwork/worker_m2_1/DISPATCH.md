# Worker Dispatch — Milestone 2: 3D Industrial Gym Environment & Hero Experience

## Context & Objectives
You are the implementation Worker for Milestone 2 for IRONFORGE FITNESS.
Your task is to build and integrate the genuine Three.js / React Three Fiber 3D environment, the 4-color dark industrial lighting rig, the industrial floor, chalk dust particles, the realistic 3D athletic hero figure in power stance with cinematic reveal and pointer parallax, and bulletproof WebGL detection with static hero fallback.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Mandatory Inputs to Read
1. `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\ORIGINAL_REQUEST.md` (R1, R5, Acceptance Criteria)
2. `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\PROJECT.md`
3. `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\sub_orch_m2\SCOPE.md`
4. `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\explorer_survey_2\handoff.md` (3D architectural survey, coordinates, lighting values, materials, procedural figure design, and WebGL fallback)

## Files You Own Exclusively
- `src/components/canvas/GymCanvas.tsx`
- `src/components/canvas/GymEnvironment.tsx`
- `src/components/canvas/GymFloor.tsx`
- `src/components/canvas/HeroFigure.tsx`
- `src/components/canvas/DustParticles.tsx`
- `src/components/canvas/FallbackHeroImage.tsx`
- `src/components/canvas/WebGLDetector.tsx`
- `src/lib/webglSupport.ts`
- `src/app/layout.tsx` (Update to mount `GymCanvas` dynamically with `ssr: false` in `#canvas-container`)

## Technical Specifications
1. **WebGL Support & Detection (`src/lib/webglSupport.ts`, `src/components/canvas/WebGLDetector.tsx`)**:
   - `isWebGLAvailable()`: Detects WebGL / WebGL2 context availability safely in browser environments without throwing.
   - `checkWebGLSupport()`: Returns `{ supported: boolean, version: 1 | 2 | null, renderer?: string }`.
   - `WebGLDetector.tsx`: Client-side wrapper component that checks support and listens to `webglcontextlost` events. If WebGL is unavailable or lost, renders `<FallbackHeroImage />`.
2. **Fallback Hero Component (`src/components/canvas/FallbackHeroImage.tsx`)**:
   - Clean static fallback layout when WebGL is unsupported.
   - Rich branded dark industrial presentation with layered CSS radial glows (`#7D39EB` violet at 25% opacity, `#C6FF33` lime at 15% opacity), subtle grid accents, and fallback hero imagery with zero console errors and zero layout shifts.
3. **GymCanvas (`src/components/canvas/GymCanvas.tsx`)**:
   - Single persistent R3F `<Canvas>` configured with:
     * `gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false, depth: true }}`
     * `toneMapping={THREE.ACESFilmicToneMapping}` with `toneMappingExposure={1.1}`
     * Adaptive DPR: desktop `[1, 1.8]`, mobile `[1, 1.3]`
     * Camera initial position: `[0, 2.2, 7.5]`, fov: 45
   - Renders inside a client component with dynamic SSR-safe mounting (`ssr: false`) and a sleek `<CanvasLoaderFallback />`.
   - Mounts `<GymEnvironment />`, `<GymFloor />`, `<DustParticles />`, and `<HeroFigure />`.
4. **4-Color Dark Industrial Lighting Rig (`src/components/canvas/GymEnvironment.tsx`)**:
   - Strict 4-color palette compliance:
     * `#000000` Deep Obsidian: `scene.background = new THREE.Color('#000000')`, `scene.fog = new THREE.FogExp2('#000000', 0.038)`
     * `#7D39EB` Electric Violet: Dual violet rim spotlights at `[-5, 4, -3]` and `[5, 3, -3]`, intensity 22, distance 20
     * `#C6FF33` Acid Lime: Directional specular kicker at `[3.5, 1.2, 3]`, intensity 14
     * `#FFFFFF` Crisp White: Overhead high-bay key spotlight at `[0, 11, 2]`, intensity 40, angle Math.PI/5, penumbra 0.65, casting soft shadows
     * Ambient light: `#140826` midnight violet, intensity 0.12
5. **Industrial Gym Floor (`src/components/canvas/GymFloor.tsx`)**:
   - Textured 60x60 ground plane at `y = 0` with dark charcoal/black rubber mat base (`#080808`, roughness 0.85, metalness 0.15).
   - Embedded procedural laser guide lines in `#C6FF33` and `#7D39EB` framing the platform.
6. **Airborne Chalk Dust Particles (`src/components/canvas/DustParticles.tsx`)**:
   - 350 instanced micro-particles floating within the overhead high-bay light cone.
   - Smooth sinusoidal drift in `useFrame` simulating suspended chalk dust in high-performance powerlifting gyms.
7. **3D Athletic Hero Figure (`src/components/canvas/HeroFigure.tsx`)**:
   - Modeled procedurally from precision organic primitives in a powerful grounded athletic power stance (broad deltoids, flexed lats, solid bilateral stance, ready posture).
   - Material: Obsidian gunmetal (`roughness: 0.32`, `metalness: 0.82`) catching the dual violet and lime rim reflections.
   - Cinematic reveal animation: Initial ambient breath -> high-bay strobe ignition -> camera zoom-in.
   - Pointer parallax tracking: `useFrame` with exponential damping via `THREE.MathUtils.damp` responding smoothly to mouse/pointer movement.
   - 100% self-contained procedural geometry with zero external asset loading dependencies.
8. **Layout Integration (`src/app/layout.tsx`)**:
   - Dynamically import `GymCanvas` (`dynamic(() => import('@/components/canvas/GymCanvas'), { ssr: false })`) into `#canvas-container` (`fixed inset-0 pointer-events-none z-0`).

## Verification Requirements
You must execute:
1. `npx tsc --noEmit` -> Must exit with code 0 (zero errors).
2. `npm run build` -> Must exit with code 0 (zero errors).
3. `node tests/runner.js` -> Full test suite must pass (exit code 0).
Document all command outputs and verification details in your handoff report:
`c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\worker_m2_1\handoff.md`.


## 2026-11-11T12:46:24Z
You are the implementation Worker (teamwork_worker) for Milestone 2: 3D Industrial Gym Environment & Hero Experience for IRONFORGE FITNESS.
Working Directory: c:\Users\Admin\Desktop\GYM website 1
State Folder: c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\worker_m2_1

Your detailed instructions and technical requirements are written in:
c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\worker_m2_1\DISPATCH.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Read all mandatory input files first:
- c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\ORIGINAL_REQUEST.md
- c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\PROJECT.md
- c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\sub_orch_m2\SCOPE.md
- c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\explorer_survey_2\handoff.md
- c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\worker_m2_1\DISPATCH.md

Execute the implementation of the files you own exclusively:
- src/components/canvas/GymCanvas.tsx
- src/components/canvas/GymEnvironment.tsx
- src/components/canvas/GymFloor.tsx
- src/components/canvas/HeroFigure.tsx
- src/components/canvas/DustParticles.tsx
- src/components/canvas/FallbackHeroImage.tsx
- src/components/canvas/WebGLDetector.tsx
- src/lib/webglSupport.ts
- Update src/app/layout.tsx to dynamically mount GymCanvas (ssr: false) into #canvas-container

Run verification commands:
- npx tsc --noEmit
- npm run build
- node tests/runner.js

Write your comprehensive completion handoff report to:
c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\worker_m2_1\handoff.md
Include all verification command outputs and send a message back to your orchestrator parent when complete.
