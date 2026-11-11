# Dispatch: Sub-Orchestrator — Milestone 2 (3D Industrial Gym Environment & Hero Experience)

## Mission
Orchestrate Milestone 2: 3D Industrial Gym Environment & Hero Experience for IRONFORGE FITNESS.
Deliver the genuine Three.js / React Three Fiber 3D environment, 4-color lighting rig, dark industrial atmosphere, realistic athletic hero figure in power stance, subtle pointer response, cinematic reveal, and WebGL fallback layout.

## Inputs
- `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\ORIGINAL_REQUEST.md`
- `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\PROJECT.md`
- 3D Survey Specification:
  * `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\explorer_survey_2\handoff.md` (Detailed 3D Canvas architecture, coordinates, materials, lighting rig, particle system, and fallback strategy)
- Your State Folder: `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\sub_orch_m2`
- Working Directory: `c:\Users\Admin\Desktop\GYM website 1`

## Scope of Milestone 2 (R1 & Acceptance Criteria)
1. Canvas & WebGL Architecture:
   - `src/components/canvas/GymCanvas.tsx`: Single persistent background Canvas (`fixed inset-0 pointer-events-none z-0`) dynamically imported in `src/app/layout.tsx` (`ssr: false`) with `<CanvasLoaderFallback />`.
   - Adaptive DPR: Desktop `[1, 1.8]`, Mobile `[1, 1.3]`.
   - Tone Mapping: `THREE.ACESFilmicToneMapping`, `toneMappingExposure: 1.1`.
   - WebGL capability detection (`src/lib/webglSupport.ts`, `src/components/canvas/WebGLDetector.tsx`).
   - WebGL fallback layout (`src/components/canvas/FallbackHeroImage.tsx`): Clean static hero rendering with layered CSS radial glows in #7D39EB/#C6FF33 when WebGL is unavailable or context lost.
2. 4-Color Dark Industrial Lighting & Environment:
   - `src/components/canvas/GymEnvironment.tsx`:
     * `#000000`: `scene.background = new THREE.Color('#000000')`, `THREE.FogExp2('#000000', 0.038)`.
     * `#7D39EB`: Dual violet rim spotlights at `[-5, 4, -3]` and `[5, 3, -3]`, intensity 22.
     * `#C6FF33`: Directional specular kicker at `[3.5, 1.2, 3]`, intensity 14, floor laser grid line shaders.
     * `#FFFFFF`: Overhead high-bay key spotlight at `[0, 11, 2]`, intensity 40, penumbra 0.65, soft shadows.
     * Ambient light: `#140826` midnight violet, intensity 0.12.
   - Industrial Floor (`src/components/canvas/GymFloor.tsx`): Textured rubber mat (`#080808`, roughness 0.85, metalness 0.15) with laser guide lines in `#C6FF33` and `#7D39EB`.
   - Chalk Dust Particles (`src/components/canvas/DustParticles.tsx`): 350 instanced micro-particles drifting in the high-bay light cone with sinusoidal motion.
3. 3D Athletic Hero Figure & Reveal:
   - `src/components/canvas/HeroFigure.tsx`:
     * Anatomical athletic sculpt in grounded power stance.
     * Obsidian gunmetal material (`roughness: 0.32`, `metalness: 0.82`) with dual violet/lime fresnel rim highlights.
     * Smooth cinematic entrance reveal (ambient -> high-bay strobe ignition -> camera zoom-in).
     * Pointer parallax tracking with exponential damping (`MathUtils.damp`).
     * 100% self-contained procedural geometry (zero external asset failure risk, instant rendering, commercial license safe).
4. Build & Verification:
   - `npx tsc --noEmit` and `npm run build` must complete cleanly with 0 errors.
   - All tests in `tests/runner.js` must pass.
5. Gate Requirement:
   - Dispatch Reviewers (2), Challengers (2), and Forensic Auditor (`teamwork_auditor`).
   - MANDATORY INTEGRITY WARNING in Worker dispatch:
     "DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected."
   - Evaluate Auditor verdict FIRST (binary veto). Once all pass, publish handoff and signal completion.


## 2026-11-11T12:42:18Z
You are the Sub-Orchestrator for Milestone 2 (3D Industrial Gym Environment & Hero Experience) for IRONFORGE FITNESS.

MANDATORY INPUTS:
- Original Request: c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\ORIGINAL_REQUEST.md
- Project Scope: c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\PROJECT.md
- Dispatch: c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\sub_orch_m2\DISPATCH.md
- State Folder: c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\sub_orch_m2
- Working Directory: c:\Users\Admin\Desktop\GYM website 1
- Prior 3D Survey Specification:
  * c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\explorer_survey_2\handoff.md

YOUR RESPONSIBILITIES:
1. Initialize your BRIEFING.md and progress.md. Create your SCOPE.md.
2. Execute Milestone 2 following the iteration loop:
   - Spawn Worker (`teamwork_worker`) with explicit file ownership:
     * `src/components/canvas/GymCanvas.tsx`
     * `src/components/canvas/GymEnvironment.tsx`
     * `src/components/canvas/GymFloor.tsx`
     * `src/components/canvas/HeroFigure.tsx`
     * `src/components/canvas/DustParticles.tsx`
     * `src/components/canvas/FallbackHeroImage.tsx`
     * `src/components/canvas/WebGLDetector.tsx`
     * `src/lib/webglSupport.ts`
     * Update `src/app/layout.tsx` to mount `GymCanvas` dynamically (`ssr: false`) in `#canvas-container`
   - MANDATORY INTEGRITY WARNING in Worker dispatch:
     "DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected."
   - Verify `npx tsc --noEmit` and `npm run build` pass cleanly with exit code 0.
   - Run tests: `node tests/runner.js` passes.
   - Dispatch 2 Reviewers (`teamwork_reviewer`) to objectively review and verify.
   - Dispatch 2 Challengers (`teamwork_challenger`) to stress-test WebGL fallbacks, pointer parallax, 4-color lighting, particle rendering, and mobile performance.
   - Dispatch 1 Forensic Auditor (`teamwork_auditor`) to verify zero integrity violations.
   - Evaluate Auditor verdict FIRST (binary veto). Once all pass, publish handoff.md and signal completion to project orchestrator (5de8e4f7-7b38-49b7-8d56-95a474ec7a84). Keep progress.md updated.
