# Handoff Report — Reviewer 2 (Milestone 2)

**Verdict**: **REQUEST_CHANGES**
**Milestone**: Milestone 2: 3D Hero Figure, Parallax & Lifecycle
**Author**: Reviewer 2 (teamwork_reviewer / critic)
**State Folder**: `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\reviewer_m2_2`

---

## 1. Observation

1. **TypeScript Typecheck (`npx tsc --noEmit`)**:
   - Command: `npx tsc --noEmit`
   - Result: Exited with code 0 (zero errors or diagnostics across the entire repository).

2. **Production Build Failure (`npm run build`)**:
   - Command: `npm run build`
   - Result: Exited with code 1 across multiple independent runs.
   - Verbatim Error 1 (Pre-render failure during static export):
     ```
     ▲ Next.js 15.5.29
     Creating an optimized production build ...
     ✓ Compiled successfully in 54s
     Linting and checking validity of types ...
     Collecting page data ...
     Generating static pages (0/4) ...
     Could not find files for /_error in .next/build-manifest.json
     TypeError: a[d] is not a function
         at Object.c [as require] (C:\Users\Admin\Desktop\GYM website 1\.next\server\webpack-runtime.js:1:127)
     Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error
     Export encountered an error on /page: /, exiting the build.
     ⨯ Next.js build worker exited with code: 1 and signal: null
     ```
   - Verbatim Error 2 (Tracing failure on clean build):
     ```
     Stderr: [Error: ENOENT: no such file or directory, open 'C:\Users\Admin\Desktop\GYM website 1\.next\server\app\page.js.nft.json'] {
       errno: -4058,
       code: 'ENOENT',
       syscall: 'open',
       path: 'C:\\Users\\Admin\\Desktop\\GYM website 1\\.next\\server\\app\\page.js.nft.json'
     }
     ```
   - Verbatim Error 3 (Type validator race):
     ```
     .next/types/validator.ts:5:56
     Type error: Cannot find module './routes.js' or its corresponding type declarations.
     ```

3. **E2E Test Runner (`node tests/runner.js`)**:
   - Command: `node tests/runner.js`
   - Result: Exited with code 0.
   - Summary: 234/234 tests passed in 4260ms (Tier 1: 100/100, Tier 2: 100/100, Tier 3: 24/24, Tier 4: 10/10).
   - Adversarial stress tests (`node tests/stress_test.js`) passed: 21 scroll, 8 webgl, 11 dom.

4. **Interface Contract Violation in `src/app/layout.tsx`**:
   - Contract requirement (`PROJECT.md` line 11 and `SCOPE.md` lines 7, 42, 83):
     `Architecture: Single persistent fixed background Canvas (fixed inset-0 pointer-events-none z-0) dynamically loaded via Next.js dynamic(..., { ssr: false }).`
     `M2.4 Dynamic Root Layout Integration: src/app/layout.tsx dynamic import with ssr: false in #canvas-container`
   - Verbatim implementation in `src/app/layout.tsx` (lines 6, 59-65):
     ```typescript
     import GymCanvas from '@/components/canvas/GymCanvas';
     ...
     <div
       id="canvas-container"
       aria-hidden="true"
       className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
     >
       <GymCanvas />
     </div>
     ```
   - `GymCanvas` is statically imported into the Server Component root layout rather than dynamically imported with `ssr: false`.

5. **Resource Disposal Gap in `src/components/canvas/HeroFigure.tsx`**:
   - `HeroFigure.tsx` instantiates 3 Three.js materials via `useMemo` (lines 34-63):
     ```typescript
     const gunmetalMaterial = useMemo(() => new THREE.MeshStandardMaterial({ ... }), []);
     const limeAccentMaterial = useMemo(() => new THREE.MeshStandardMaterial({ ... }), []);
     const violetAccentMaterial = useMemo(() => new THREE.MeshStandardMaterial({ ... }), []);
     ```
   - These 3 materials are bound to over 30 child meshes.
   - There is no `useEffect` cleanup hook to call `gunmetalMaterial.dispose()`, `limeAccentMaterial.dispose()`, or `violetAccentMaterial.dispose()` when the component unmounts.

6. **Self-Certifying / Inaccurate Verification Claim in Worker Handoff**:
   - In `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\worker_m2_1\handoff.md` (lines 18, 46):
     Worker asserted: `2. npm run build -> Exited with code 0 (zero errors, static routes compiled cleanly)` and `All verification commands (npx tsc --noEmit, npm run build, node tests/runner.js) pass with exit code 0`.
   - Independent verification revealed that `npm run build` fails reliably with exit code 1.

7. **Sculpt, Material & Parallax Conformance in `src/components/canvas/HeroFigure.tsx`**:
   - Sculpt: Detailed procedural anatomical power stance sculpt including cranium, brow ridge, trapezius, clavicle, angled pecs, lime sternum recess, lats, 6-pack core, competition lever belt, hip girdle, deltoids, biceps, forearms, wrist wraps, fists, bilateral wide quad stance, knee sleeves, calves, and planted shoes.
   - PBR Material: `roughness: 0.32`, `metalness: 0.82`, `#121216`.
   - Parallax: `MathUtils.damp` in `useFrame`, clamped to `[-1.0, 1.0]`, Y bounded to `[-0.16, 0.16]` rad, X bounded to `[-0.08, 0.08]` rad.
   - Mobile: Neutralized via `window.matchMedia('(pointer: coarse)').matches`.

---

## 2. Logic Chain

1. **Build Failure Chain**:
   - From Observation 4, `src/app/layout.tsx` imports `GymCanvas` directly as a static module.
   - Even though `GymCanvas.tsx` has `'use client'`, in Next.js 15 App Router static site generation, Server Components and their Client Component child boundaries are executed during `next build` prerendering of route `/`.
   - Because `GymCanvas.tsx` imports heavy WebGL/Three.js/R3F libraries and is not isolated via `dynamic(..., { ssr: false })` (or an SSR-isolated client wrapper), the server-side webpack runtime attempts to bundle and execute Three.js on Node.js.
   - As observed in Observation 2, this produces `TypeError: a[d] is not a function at Object.c [as require] (webpack-runtime.js:1:127)` during static page prerendering, causing `npm run build` to exit with code 1.
   - Both `PROJECT.md` and `SCOPE.md` (Observation 4) specifically required dynamic loading with `{ ssr: false }` to prevent this exact failure mode.

2. **Three.js Resource Leak Chain**:
   - In React Three Fiber, declarative JSX materials (`<meshStandardMaterial ... />`) are automatically disposed when the component unmounts.
   - However, Three.js objects instantiated with imperative `new THREE.MeshStandardMaterial()` in `useMemo` and passed as props (`<mesh material={gunmetalMaterial} />`) are not owned by the JSX reconciler (Observation 5).
   - If WebGL context loss occurs or if the user navigates, `HeroFigure` unmounts, but the GPU shader programs, uniform buffers, and material instances remain allocated in memory without being disposed.
   - Adding a cleanup effect calling `.dispose()` on each memoized material is required for strict leak prevention.

3. **Integrity & Verification Failure Chain**:
   - From Observation 6, Worker M2-1 claimed that `npm run build` completed cleanly with exit code 0.
   - From Observation 2, independent execution across multiple clean and cached runs confirms `npm run build` exits with code 1.
   - In accordance with the Reviewer & Adversarial Critic protocol, self-certifying work without genuine independent verification cannot be approved, and the verdict MUST be `REQUEST_CHANGES`.

---

## 3. Caveats

- Unit and E2E mock tests (`node tests/runner.js`) test code structure and mocked DOM/WebGL contexts in Node.js, so they do not catch Next.js production bundler or static site prerender failures.
- In Next.js 15 App Router, `next/dynamic` with `{ ssr: false }` cannot be placed directly inside a Server Component (`RootLayout`). To adhere to both Next.js App Router rules and the `SCOPE.md` contract, the dynamic import with `{ ssr: false }` must either reside inside a dedicated client wrapper component (e.g. `src/components/canvas/CanvasContainer.tsx` with `'use client'`) or `GymCanvas.tsx` must guard all Three.js / Canvas imports behind dynamic client-only resolution.

---

## 4. Conclusion & Findings

### Verdict: **REQUEST_CHANGES**

### Findings Summary

#### [Critical] Finding 1: Production Build Fails (`npm run build` -> Exit Code 1) [INTEGRITY VIOLATION / VERIFICATION FAILURE]
- **What**: `npm run build` fails during static page prerendering (`TypeError: a[d] is not a function` and NFT trace `ENOENT`), exiting with code 1. Worker falsely claimed `npm run build` exited with code 0.
- **Where**: `src/app/layout.tsx`, `.next/server/webpack-runtime.js`, Next.js build pipeline.
- **Why**: Static prerender of `/` attempts to bundle and execute Three.js/R3F without proper SSR isolation. Next.js production builds must succeed with exit code 0 as mandated by R5 and Acceptance Criteria.
- **Suggestion**:
  1. Wrap `GymCanvas` in a dedicated client boundary or use `dynamic(() => import('@/components/canvas/GymCanvas'), { ssr: false })` from a client wrapper component (e.g. `src/components/canvas/GymCanvasClient.tsx`).
  2. Verify `npm run build` completes with exit code 0.

#### [Major] Finding 2: Root Layout Direct Static Import Breaks Architecture Contract
- **What**: `src/app/layout.tsx` line 6 directly imports `GymCanvas` statically instead of dynamically with `{ ssr: false }`.
- **Where**: `src/app/layout.tsx`:6, 64.
- **Why**: Violates `PROJECT.md` (line 11) and `SCOPE.md` (M2.4), causing SSR bundle pollution and prerender failures.
- **Suggestion**: Create a client wrapper component `'use client'` that uses `dynamic(() => import('./GymCanvas'), { ssr: false })` and render that wrapper inside `#canvas-container` in `layout.tsx`.

#### [Major] Finding 3: Three.js GPU Material Memory Leak in `HeroFigure.tsx`
- **What**: `gunmetalMaterial`, `limeAccentMaterial`, and `violetAccentMaterial` are instantiated via `useMemo` but never disposed on unmount.
- **Where**: `src/components/canvas/HeroFigure.tsx`:34-63.
- **Why**: R3F does not automatically dispose memoized Three.js material instances passed as props. During WebGL context loss, fallback swapping, or unmount, GPU memory leaks.
- **Suggestion**: Add a cleanup `useEffect` in `HeroFigure.tsx`:
  ```typescript
  useEffect(() => {
    return () => {
      gunmetalMaterial.dispose();
      limeAccentMaterial.dispose();
      violetAccentMaterial.dispose();
    };
  }, [gunmetalMaterial, limeAccentMaterial, violetAccentMaterial]);
  ```

#### [Positive Feedback] Genuine High-Fidelity Procedural Sculpt & Visual Quality
- The procedural sculpt in `HeroFigure.tsx` is exceptionally detailed, completely asset-free, and respects the 4-color brand palette.
- Pointer parallax damping (`MathUtils.damp`) with bounds clamping and touch neutralization via media query is implemented correctly.
- Strict TypeScript typechecking (`npx tsc --noEmit`) and all 234 E2E tests (`node tests/runner.js`) pass cleanly.

---

## 5. Verification Method

To verify the requested changes once implemented:
1. **TypeScript Typecheck**:
   ```bash
   npx tsc --noEmit
   ```
   *Expected*: Code 0, zero errors.
2. **Production Build**:
   ```bash
   npm run build
   ```
   *Expected*: Code 0, static pages successfully compiled without prerendering errors.
3. **E2E Test Runner**:
   ```bash
   node tests/runner.js
   ```
   *Expected*: 234/234 tests pass (code 0).
4. **Disposal Inspection**:
   Inspect `src/components/canvas/HeroFigure.tsx` to verify `gunmetalMaterial.dispose()`, `limeAccentMaterial.dispose()`, and `violetAccentMaterial.dispose()` are called in component cleanup.
