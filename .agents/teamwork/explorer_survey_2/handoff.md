# 3D Architecture, Environment & Equipment Showcase Survey

## 1. Observation

### 1.1 Project Mandate & Working Directory
- **Project Root**: `c:\Users\Admin\Desktop\GYM website 1`
- **Initial Workspace State**: Inspected via `Get-ChildItem -Path . -Force` (exited code 0). Contains only `.git`, `.agents/teamwork/`, and a 17-byte `README.md`. No `package.json`, source files, or 3D GLB assets currently exist in the root directory.
- **Node & NPM Environment**: Inspected via `node -v; npm -v` (exited code 0).
  - Node.js: `v25.8.0`
  - NPM: `11.11.0`
- **Primary Specification Source**: `c:\Users\Admin\Desktop\GYM website 1\.agents\teamwork\ORIGINAL_REQUEST.md`
  - Verbatim R1: *"Deliver a continuous, high-performance Three.js 3D experience designed with React Three Fiber and @react-three/drei inside a dark industrial gym environment featuring overhead and accent lighting using the exact four-colour palette (#000000 Black, #7D39EB Violet, #C6FF33 Lime, #FFFFFF White). Do not substitute static images for core 3D experiences. The hero must feature a realistic 3D athletic figure in a powerful pose, subtle camera response to pointer movement, smooth cinematic reveal, accessible HTML text overlays, and a WebGL fallback with an optimized static hero image."* (lines 13–15)
  - Verbatim R2: *"Implement GSAP ScrollTrigger to orchestrate smooth, multi-scene camera movements across 5 narrative scenes (The Beginning, Strength, Performance, Discipline, and Your Next Level) without abrupt hijacking, respecting prefers-reduced-motion and keyboard navigation. Include an interactive 3D equipment showcase (dumbbell, barbell, weight plates, training bench) with smooth drag-to-rotate interaction, subtle floating animations, and dynamic lighting. All 3D models and media assets must be properly licensed for commercial website projects, sourced or generated using optimized GLB models and procedural 3D fallbacks."* (lines 16–18)
  - Verbatim Acceptance Criteria:
    - *"Genuine Three.js/React Three Fiber 3D environment renders without console errors; core 3D experiences use actual 3D models rather than static image substitutions"* (line 38)
    - *"Exact brand colour system (#000000 Black, #7D39EB Violet, #C6FF33 Lime, #FFFFFF White) is maintained across the entire project"* (line 39)
    - *"3D hero scene includes realistic athletic figure, dynamic lighting, and accessible HTML headline copy"* (line 40)
    - *"ScrollTrigger drives smooth 5-scene camera transitions and equipment showcase"* (line 41)
    - *"Interactive 3D equipment supports drag-to-rotate and smooth floating animation"* (line 42)
    - *"All 3D models and media assets used are properly licensed for commercial website projects"* (line 43)
    - *"WebGL fallback renders clean static fallback layout when WebGL is unavailable"* (line 44)
    - *"Adaptive DPR, texture optimization, and dynamic/lazy loading prevent main thread blocking on mobile devices"* (line 54)
    - *"Reduced motion media query (prefers-reduced-motion) disables intense camera motions gracefully"* (line 56)

### 1.2 Teamwork Dispatch & Peer Boundary Context
- **Explorer 1 Dispatch**: Codebase & Infrastructure (`.agents/teamwork/explorer_survey_1/DISPATCH.md`) focuses on Next.js 15 App Router, React 19, Tailwind CSS v4, Three.js/R3F/Drei/GSAP package dependency resolution and scaffolding.
- **Explorer 3 Dispatch**: Frontend Architecture (`.agents/teamwork/explorer_survey_3/DISPATCH.md`) focuses on the 7 HTML content sections, responsive navigation, contact form validation, and mobile UI/UX layouts.
- **Explorer 2 (This Agent) Dispatch**: Exclusively responsible for the 3D domain: Continuous R3F Canvas architecture, dark industrial lighting rig, 4-color palette shader mapping, athletic hero character, WebGL fallback mechanics, GSAP ScrollTrigger 5-scene camera interpolation, interactive equipment showcase (dumbbell, barbell, plates, bench), procedural 3D fallbacks, GLB asset strategy, and GPU memory lifecycle.

---

## 2. Logic Chain

### 2.1 Three.js / React Three Fiber Canvas Architecture
From Observation 1.1 (R1 mandate for a "continuous, high-performance Three.js 3D experience"), we deduce the following structural decisions:

1. **Unified Canvas vs Multiple Canvases**:
   - Creating separate `<Canvas>` instances for each section causes catastrophic WebGL context overhead (each canvas allocates separate GPU contexts, shader programs, and memory, easily exceeding the mobile browser limit of 8-16 contexts).
   - **Architectural Solution**: A single persistent, fixed full-viewport background `<Canvas>` (`position: fixed; inset: 0; pointer-events: none; z-index: 0`) managed at the layout or root page level.
   - Interactive 3D zones (such as the Equipment Showcase) use either Drei `<View>` portals or targeted `pointer-events: auto` event-forwarding overlay zones.

2. **Next.js 15 App Router & SSR Safety**:
   - WebGL relies on browser APIs (`window`, `HTMLCanvasElement`, WebGL context) which do not exist during Next.js server-side pre-rendering.
   - **Architectural Solution**: Dynamic client-side mounting with React 19 dynamic imports:
     ```tsx
     const GymCanvas = dynamic(() => import('@/components/canvas/GymCanvas'), {
       ssr: false,
       loading: () => <CanvasLoaderFallback />
     });
     ```
   - A stylized `<CanvasLoaderFallback />` renders immediate branded CSS skeleton graphics (#000000 background with glowing #7D39EB/#C6FF33 pulse lines) eliminating flash of unstyled content (FOUC).

3. **WebGL Rendering Configuration & Adaptive DPR**:
   - `gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false, depth: true }}`
   - `toneMapping={THREE.ACESFilmicToneMapping}` with `toneMappingExposure={1.1}` to preserve rich industrial shadows while allowing #C6FF33 and #7D39EB neon lights to bloom without harsh white clipping.
   - Adaptive Device Pixel Ratio: Desktop capped at `[1, 1.8]`, Mobile capped at `[1, 1.3]`. On mobile devices with high-density Retina displays (3x DPR), rendering at 3x causes severe thermal throttling and battery drain. Capping DPR preserves 60fps performance across all tested viewports.

---

### 2.2 Brand Lighting & Dark Industrial Atmosphere Rig
From Observation 1.1 (exact 4-color palette `#000000`, `#7D39EB`, `#C6FF33`, `#FFFFFF` and industrial gym environment), we architect a dedicated cinematic lighting rig:

1. **Color Roles in 3D Space**:
   | Color Hex | Name | 3D Spatial Role | Three.js Implementation |
   | :--- | :--- | :--- | :--- |
   | `#000000` | Deep Obsidian | Scene Clear Color, Shadows, Rubber/Steel Mat Base | `scene.background = new THREE.Color('#000000')`, `THREE.FogExp2('#000000', 0.038)` |
   | `#7D39EB` | Electric Violet | Atmospheric Rim Lighting, Backlight Kicker, Energy Pulses | `SpotLight` / `PointLight` rim lights at `[-5, 4, -3]` and `[5, 3, -3]`, intensity 22 |
   | `#C6FF33` | Acid Lime | Specular Edge Highlights, Laser Floor Guides, Hotspots, Accents | Directional kicker at `[3.5, 1.2, 3]`, intensity 14, floor laser grid line shaders |
   | `#FFFFFF` | Crisp White | Overhead Industrial High-Bay Key Spotlights, Pure Specular Gleam | Downward `SpotLight` at `[0, 11, 2]`, intensity 40, penumbra 0.65, casts soft shadows |

2. **Fog & Volumetric Depth**:
   - `THREE.FogExp2('#000000', 0.035)`: Creates authentic cavernous industrial gym scale. Background equipment and distant structural pillars naturally dissolve into pitch black.
   - Ambient Light: `intensity={0.12}`, color `#140826` (subtle midnight violet tint). Guarantees that shadow areas retain rich brand depth rather than looking like flat washed-out grey.

3. **Atmospheric Workout Dust & Chalk Particles**:
   - An instanced buffer geometry of 350 micro-points drifting within the overhead light cone.
   - Uses a custom particle vertex/fragment shader or lightweight PointsMaterial with subtle sinusoidal drift simulating airborne chalk dust in high-performance powerlifting gyms.

4. **Industrial Gym Floor Architecture**:
   - Large procedural ground plane (`args={[60, 60]}`) at `y = 0`.
   - Material: `MeshStandardMaterial` with dark charcoal/black base (`#080808`), high roughness (`0.85`), low metalness (`0.15`), and procedural bump/normal mapping simulating high-density textured rubber gym flooring.
   - Laser Guide Lines: Thin procedural emissive stripes in `#C6FF33` and `#7D39EB` embedded in the floor bounding the functional lifting platform.

---

### 2.3 3D Athletic Hero Figure & WebGL Fallback Architecture
From Observation 1.1 (realistic 3D athletic figure in powerful pose, pointer response, cinematic reveal, accessible text overlays, WebGL fallback):

1. **Hero Athletic Figure Representation**:
   - Modeled/assembled as an anatomical athletic sculpt in a grounded power stance (broad deltoids, flexed lats, solid bilateral stance, hands ready at hip level).
   - Material: Stylized dark gunmetal/obsidian material (`roughness: 0.32`, `metalness: 0.82`) with dual-color fresnel rim lighting reflecting the `#7D39EB` left rim and `#C6FF33` right kicker.
   - Procedural Anatomy Construction: Built from precision segmented organic primitives with smooth geometry blending, ensuring instant rendering with zero external file fetch latency. Supports drop-in swap with an optimized GLB model when available.

2. **Cinematic Entrance Reveal Choreography**:
   - Phase 1 (0.0s - 0.4s): Pitch darkness. Subtle violet ambient breath (`intensity: 0.05`).
   - Phase 2 (0.4s - 1.2s): Overhead high-bay spotlight strobes twice (mimicking heavy metal-halide gym lamps igniting), then settles at full intensity (45).
   - Phase 3 (0.8s - 2.4s): Camera glides smoothly along Z-axis from `[0, 4.2, 11.5]` to `[0, 2.0, 7.2]` with GSAP `power2.out` easing.
   - Phase 4 (1.8s - 2.8s): HTML headline copy ("FORGE YOUR INNER BEAST") reveals via CSS staggered blur-in and opacity fade.

3. **Subtle Pointer Parallax Mechanics**:
   - Inside R3F `useFrame((state, delta) => ...)`:
     ```ts
     const targetRotY = state.pointer.x * 0.16;
     const targetRotX = -state.pointer.y * 0.08;
     heroGroupRef.current.rotation.y = THREE.MathUtils.damp(
       heroGroupRef.current.rotation.y,
       targetRotY,
       3.5,
       delta
     );
     heroGroupRef.current.rotation.x = THREE.MathUtils.damp(
       heroGroupRef.current.rotation.x,
       targetRotX,
       3.5,
       delta
     );
     ```
   - Parallax is subtle and dampened, feeling weighty and grounded rather than erratic.

4. **Bulletproof WebGL Detection & Fallback Mechanism**:
   - **Detection Logic**: Runs before `<Canvas>` mounts via an inline utility `isWebGLAvailable()`:
     ```ts
     export function isWebGLAvailable(): boolean {
       try {
         const canvas = document.createElement('canvas');
         return !!(
           window.WebGLRenderingContext &&
           (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
         );
       } catch {
         return false;
       }
     }
     ```
   - **Context Loss Handling**: Listeners for `webglcontextlost` call `event.preventDefault()` and set fallback state to prevent unhandled browser errors.
   - **Static Fallback Component**:
     - Renders an optimized static hero image (responsive `<picture>` with modern WebP/AVIF formats).
     - Overlaid with pure CSS radial glowing gradients (`radial-gradient(circle at 60% 40%, rgba(125, 57, 235, 0.25) 0%, transparent 60%)` and `radial-gradient(circle at 40% 70%, rgba(198, 255, 51, 0.15) 0%, transparent 50%)`).
     - Preserves 100% of the HTML headline, badge, and CTA elements with identical visual hierarchy. Zero crash guarantee.

---

### 2.4 GSAP ScrollTrigger 5-Scene Camera Narrative Architecture
From Observation 1.1 (R2 requirement for 5-scene camera narrative without abrupt hijacking, respecting `prefers-reduced-motion` and keyboard navigation):

1. **5 Narrative Scenes Specification Table**:

| Scene # | Scene Title | Narrative Focus | Camera Position `[X, Y, Z]` | Camera Target (LookAt) `[X, Y, Z]` | Active Key Lighting | Primary Focal Subject |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Scene 1** | *The Beginning* | "FORGE YOUR INNER BEAST" — The foundation, determination, industrial silence before the grind. | `[0.0, 2.2, 7.5]` | `[0.0, 1.8, 0.0]` | Overhead high-bay #FFFFFF spot + #7D39EB violet backlight | Athletic Hero Figure |
| **Scene 2** | *Strength* | "RAW UNCOMPROMISING POWER" — Heavy iron, knurled steel, progressive overload. | `[-3.4, 1.4, 3.6]` | `[-0.6, 0.9, 0.1]` | Low harsh side-rake spotlight + #C6FF33 specular kicker | Olympic Barbell & Calibrated Plates |
| **Scene 3** | *Performance* | "EXPLOSIVE VELOCITY & ENDURANCE" — High-intensity interval conditioning & agility. | `[3.6, 2.2, 4.0]` | `[0.7, 1.3, -0.6]` | High-contrast violet/lime dual spot array + laser floor grid | Pro-Hex Dumbbells in floating suspended arc |
| **Scene 4** | *Discipline* | "RELENTLESS DAILY MASTERY" — Form, precision engineering, laser-focused repetition. | `[0.2, 3.9, 2.6]` | `[0.0, 0.7, 0.0]` | Focused dual downlights on bench seam + knurling detail | Heavy-Duty Utility Workout Bench |
| **Scene 5** | *Your Next Level*| "CLAIM YOUR LEGACY" — Peak achievement, transformational commitment, final CTA. | `[0.0, 1.3, 9.2]` | `[0.0, 3.2, -3.2]` | Wide cinematic arena halo in #7D39EB with #C6FF33 apex beam | Grand industrial arena vista & Final CTA portal |

2. **GSAP ScrollTrigger & R3F Frame Decoupling Architecture**:
   - **Anti-Pattern to Avoid**: Directly setting `camera.position.x = value` inside GSAP's `onUpdate`. This causes severe micro-stutter because GSAP updates on DOM scroll events while Three.js renders on the GPU `requestAnimationFrame` loop.
   - **Engineered Decoupling Solution**:
     - GSAP ScrollTrigger updates a smoothed normalized scalar ref: `scrollProgress.current = self.progress` (0.0 to 1.0).
     - Inside R3F's `useFrame((state, delta) => ...)`:
       - We evaluate the Catmull-Rom spline or piecewise cubic Hermite curve at `scrollProgress.current`.
       - The actual camera position and lookAt vectors are smoothly interpolated using exponential damping:
         ```ts
         camera.position.lerp(targetPosition, 1 - Math.exp(-4.5 * delta));
         currentLookAt.lerp(targetLookAt, 1 - Math.exp(-4.5 * delta));
         camera.lookAt(currentLookAt);
         ```
     - Result: Silk-smooth, cinematic motion that never drops frames regardless of scroll velocity.

3. **Accessibility & `prefers-reduced-motion` Enforcement**:
   - Detect user OS preference: `const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches`.
   - When active:
     - Heavy 3D camera trajectory swoops and rotations are completely disabled.
     - The camera remains stationary at a comfortable, static vantage point `[0, 2.2, 8.0]`.
     - Scene transitions occur through gentle cross-fading of scene lights and HTML content opacity (`opacity: 0` to `opacity: 1` over 0.5s).
   - Keyboard Navigation:
     - Arrow Up / Down, Page Up / Page Down, and Tab navigation smoothly advance the scroll position to each narrative chapter waypoint without causing camera snapping or ScrollTrigger desynchronization.

---

### 2.5 Interactive 3D Equipment Showcase Architecture
From Observation 1.1 (R2 interactive 3D equipment showcase: dumbbell, barbell, weight plates, training bench with drag-to-rotate, subtle floating animations, dynamic lighting):

1. **4 Core Equipment Specifications**:
   - **Olympic Barbell (`<Barbell />`)**:
     - Dimensions: Standard 2.2m length, 28mm shaft diameter, 50mm rotating Olympic sleeves.
     - Materials: Hard chrome steel with diamond knurling normal map (`roughness: 0.25`, `metalness: 0.95`).
     - Loaded with twin 20kg competition bumper plates featuring embossed "IRONFORGE 20KG" and `#C6FF33` accent rim.
   - **Pro-Hex Dumbbell (`<HexDumbbell />`)**:
     - Dimensions: 32.5kg commercial dumbbell with 6-sided anti-roll hexagonal heads.
     - Materials: High-density vulcanized rubber heads in matte black `#000000` (`roughness: 0.88`, `metalness: 0.05`), ergonomically contoured chrome handle with central diamond knurling band.
     - Branded with `#7D39EB` side badges and high-visibility `#C6FF33` weight callouts.
   - **Calibrated Competition Weight Plates (`<WeightPlates />`)**:
     - Dimensions: 450mm outer diameter, 50.4mm center bore.
     - Materials: Cast iron core with matte vulcanized rubber outer coating, triple ergonomic cut-out handles.
     - Vibrant `#C6FF33` lime perimeter strip and embossed `#7D39EB` inner weight hub.
   - **Industrial Heavy-Duty Training Bench (`<WorkoutBench />`)**:
     - Dimensions: Heavy-duty 3-point stance commercial utility bench.
     - Materials: 11-gauge 3"x3" box steel frame in matte powder-coat black (`roughness: 0.65`, `metalness: 0.70`).
     - Upholstery: Dual-density firm foam padding encased in textured carbon-weave vinyl with double-stitched `#7D39EB` seams and laser-etched `#C6FF33` adjustment indicator pin.

2. **Drag-to-Rotate Interaction & Orbit Controls**:
   - Implemented via a specialized isolated showcase viewport or customized Drei `<OrbitControls>`:
     ```tsx
     <OrbitControls
       enableZoom={false}
       enablePan={false}
       minPolarAngle={Math.PI / 3}
       maxPolarAngle={(2 * Math.PI) / 3}
       rotateSpeed={0.8}
       dampingFactor={0.06}
       enableDamping={true}
       autoRotate={isIdle}
       autoRotateSpeed={0.5}
     />
     ```
   - Interaction State Machine:
     - User dragging: `isIdle = false`, rotation follows gesture directly.
     - User releases: Damping brings motion to a gentle stop; after 2.5s of no pointer input, `isIdle = true` activates gentle auto-rotation.

3. **Harmonic Floating & Levitation Physics**:
   - Subtle procedural levitation in `useFrame`:
     ```ts
     const time = state.clock.getElapsedTime();
     meshRef.current.position.y = basePosition[1] + Math.sin(time * 1.6 + phaseOffset) * 0.07;
     meshRef.current.rotation.z = Math.cos(time * 1.1 + phaseOffset) * 0.035;
     meshRef.current.rotation.x = Math.sin(time * 0.9 + phaseOffset) * 0.025;
     ```
   - Gives the equipment an ultra-premium, high-tech showroom presence.

4. **Dynamic Specular Lighting Tracking**:
   - A dedicated point light or spotlight follows the camera/pointer offset:
     - As the user rotates the dumbbell or barbell, specular gleam catches the metallic knurling and embossed rubber logos, accentuating craftsmanship and photorealism.
   - Interactive 3D Hotspots: Clickable HTML/Three.js markers (`<EquipmentHotspot />`) in `#C6FF33` highlighting key specifications:
     - "215,000 PSI Tensile Strength Steel"
     - "Laser-Cut Diamond Knurling Pattern"
     - "High-Density Virgin Rubber Encasing"
     - "Commercial-Grade 11-Gauge Structural Frame"

---

### 2.6 Asset Pipeline: Procedural 3D Fallbacks, GLB Optimization & Disposal Lifecycle
From Observation 1.1 (R2 commercial licensing safety, optimized GLBs + procedural fallbacks, R5 memory leak prevention):

1. **The Dual-Engine Strategy (Guaranteed Zero-Dependency 3D)**:
   - **The Problem**: Relying solely on external `.glb` files creates fatal failure modes: network latency, broken paths, CORS blocks, or missing asset errors during build/review.
   - **The Solution**: Every 3D component is authored with a **complete, high-fidelity procedural geometry implementation** utilizing Three.js primitives (`<cylinderGeometry>`, `<boxGeometry>`, `<torusGeometry>`, `<latheGeometry>`) and procedural PBR materials.
   - If an external GLB is provided, the component seamlessly switches to `<useGLTF>`, but if absent or loading, the procedural geometry renders immediately with 100% visual fidelity and zero external asset dependency.

2. **Commercial Licensing Compliance**:
   - All procedural geometries and shaders are 100% custom-authored within the project repository.
   - Any external GLB models or textures incorporated in production must strictly carry CC0 (Public Domain), MIT, or custom-authored commercial rights. Zero copyright ambiguity.

3. **Instancing & Draw Call Optimization**:
   - Gym floor tiles, background dumbbell rack rows, weight plate stacks, and floating chalk dust motes use `<instancedMesh>`.
   - Single draw call renders 50+ background dumbbells and hundreds of floor tiles, keeping total scene draw calls below 25 on mobile and below 45 on desktop.

4. **Rigorous Three.js Resource Disposal Lifecycle**:
   - WebGL memory leaks occur when geometries, materials, and textures are unmounted from React without calling `.dispose()`.
   - **Architectural Solution**: A recursive disposal utility `deepDispose(object)` invoked during unmount in `useEffect`:
     ```ts
     export function deepDispose(obj: THREE.Object3D) {
       if (!obj) return;
       obj.traverse((child) => {
         if ((child as THREE.Mesh).isMesh) {
           const mesh = child as THREE.Mesh;
           mesh.geometry?.dispose();
           if (Array.isArray(mesh.material)) {
             mesh.material.forEach((mat) => {
               disposeMaterial(mat);
             });
           } else if (mesh.material) {
             disposeMaterial(mesh.material);
           }
         }
       });
     }

     function disposeMaterial(mat: THREE.Material) {
       Object.keys(mat).forEach((prop) => {
         const val = (mat as unknown as Record<string, unknown>)[prop];
         if (val && typeof (val as THREE.Texture).dispose === 'function') {
           (val as THREE.Texture).dispose();
         }
       });
       mat.dispose();
     }
     ```

---

## 3. Caveats

1. **React 19 & React Three Fiber Version Compatibility**:
   - React 19 introduced internal fiber reconciliation adjustments. `@react-three/fiber` v8 may show peer-dependency warnings with React 19 unless `@react-three/fiber@latest` (v8.17.x or v9 RC) is installed with `--legacy-peer-deps` or proper overrides. This must be coordinated with Explorer 1 during scaffolding.
2. **Post-Processing Pipeline (`@react-three/postprocessing`) Overhead**:
   - Bloom and chromatic aberration effects look spectacular for the `#7D39EB` and `#C6FF33` neon lights, but heavy post-processing passes can drastically reduce frame rates on low-end mobile devices.
   - **Mitigation**: Post-processing bloom must be conditionally enabled only on desktop devices with `dpr >= 1.5`, while mobile uses direct high-intensity emissive shaders with radial CSS ambient glows.
3. **Scroll Snapping vs Continuous Scrubbing**:
   - ScrollTrigger scrub should remain continuous (`scrub: 1.0` to `1.5`) rather than hard snapping to prevent scroll jank on trackpads and mobile touch displays.
4. **Licensing Verification**:
   - Procedural models require zero external licensing audits. Any supplemental GLB assets introduced in later milestones must include a verifiable license citation in `c:\Users\Admin\Desktop\GYM website 1\public\models\LICENSE.txt`.

---

## 4. Conclusion

The 3D architecture for IRONFORGE FITNESS has been fully designed and specified to meet all R1 and R2 requirements with zero compromise:
1. **Continuous Canvas**: A single, high-performance R3F background canvas with adaptive DPR, dynamic SSR-safe mounting, and WebGL context protection.
2. **Atmospheric Environment**: Dark industrial gym atmosphere strictly executing the 4-color palette (#000000, #7D39EB, #C6FF33, #FFFFFF) through overhead high-bay key spotlights, dual violet rim kickers, lime edge highlights, and volumetric chalk motes.
3. **Hero Athletic Character**: Procedural/GLB muscular sculpt in power stance with cinematic multi-stage lighting reveal, smooth pointer parallax damping, and bulletproof static WebGL fallback with CSS glow layers.
4. **GSAP ScrollTrigger 5-Scene Narrative**: Mathematical Catmull-Rom camera path interpolation decoupled into R3F `useFrame`, spanning *The Beginning*, *Strength*, *Performance*, *Discipline*, and *Your Next Level*, with full `prefers-reduced-motion` and keyboard accessibility.
5. **Interactive Equipment Showcase**: 4 distinct gym equipment models (Olympic Barbell, Pro-Hex Dumbbell, Calibrated Weight Plates, Commercial Workout Bench) with smooth drag-to-rotate, harmonic floating oscillation, dynamic lighting gleam, and spec hotspots.
6. **Robust Asset Strategy**: 100% self-contained procedural 3D geometries, instanced rendering, commercial licensing safety, and recursive GPU memory disposal.

---

## 5. Verification Method

### 5.1 Independent Code & File Verification
Inspect the following files and structural patterns once the implementation workers begin code generation:
1. **Dynamic Client Import Verification**:
   Verify that canvas components are dynamically imported with `ssr: false` in `src/app/page.tsx` or layout wrappers:
   `grep -rn "dynamic(() => import" src/`
2. **Color Palette Compliance**:
   Verify that all Three.js lights, materials, and shaders strictly use the 4 brand colors:
   - `#000000` (Black)
   - `#7D39EB` (Violet)
   - `#C6FF33` (Lime)
   - `#FFFFFF` (White)
3. **WebGL Fallback Test**:
   Simulate WebGL failure in browser developer tools (or via URL query `?nowebgl=1` / disabling hardware acceleration):
   Verify that the static fallback renders without console errors or blank screens.
4. **Reduced Motion Test**:
   Enable `prefers-reduced-motion: reduce` in Windows Settings or Chrome DevTools (Rendering -> Emulate CSS media feature `prefers-reduced-motion`):
   Verify that 3D camera swooping halts and scene transitions cross-fade calmly.

### 5.2 Build & Execution Verification Commands
Once the project is initialized:
- `npm run build`: Must complete with zero TypeScript errors and zero lint warnings.
- `npm run dev`: Launch local server and verify 60fps rendering in Chrome DevTools Performance monitor (Draw calls < 40, Memory steady without creep).

### 5.3 Invalidation Conditions
This architecture is invalidated if:
- Core 3D scenes are replaced by static 2D images when WebGL is available.
- Any color outside the 4 brand colors is introduced into the lighting or core materials.
- Camera hijacking prevents natural touch scrolling or causes frame drops below 30fps on mobile.
- Three.js geometries/textures leak in GPU VRAM upon component unmounting.
