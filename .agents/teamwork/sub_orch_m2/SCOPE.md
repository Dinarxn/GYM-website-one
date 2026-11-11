# Scope: Milestone 2 (3D Industrial Gym Environment & Hero Experience)

## Architecture
- **Framework**: Next.js 15 App Router (`src/app/layout.tsx`), React 19, TypeScript strict mode.
- **3D Pipeline**: Three.js `0.187.0`, `@react-three/fiber` `9.8.2`, `@react-three/drei` `10.7.9`.
  - Single persistent background canvas mounted in `src/app/layout.tsx` (`#canvas-container`).
  - Dynamic SSR-safe client mount (`dynamic(..., { ssr: false })`).
  - Adaptive DPR: Desktop `[1, 1.8]`, Mobile `[1, 1.3]`.
  - ACESFilmicToneMapping, exposure 1.1.
- **Atmosphere & Lighting**: Exact 4-color palette:
  - `#000000` Deep Obsidian: scene background, exponential fog (`FogExp2('#000000', 0.038)`), rubber floor base.
  - `#7D39EB` Electric Violet: dual rim spotlights at `[-5, 4, -3]` and `[5, 3, -3]`, intensity 22.
  - `#C6FF33` Acid Lime: directional kicker at `[3.5, 1.2, 3]`, intensity 14, floor laser grid line shaders.
  - `#FFFFFF` Crisp White: overhead high-bay key spotlight at `[0, 11, 2]`, intensity 40, penumbra 0.65, soft shadows.
  - Ambient: `#140826` midnight violet, intensity 0.12.
- **Industrial Floor**: Procedural 60x60 rubber mat (`#080808`, roughness 0.85, metalness 0.15) with laser guide lines in `#C6FF33` and `#7D39EB`.
- **Chalk Dust Particles**: 350 instanced micro-particles drifting in the high-bay light cone with sinusoidal motion.
- **3D Athletic Hero Figure**:
  - Muscular sculpt in powerful grounded bilateral stance.
  - Obsidian gunmetal PBR material (`roughness: 0.32`, `metalness: 0.82`) catching violet & lime rim reflections.
  - Multi-stage cinematic lighting entrance reveal.
  - Subtle pointer parallax damping (`MathUtils.damp`).
  - 100% self-contained procedural 3D primitives (zero external asset dependency / commercial license safe).
- **WebGL Capability Detection & Fallback**:
  - Bulletproof detection utility (`isWebGLAvailable()`, `checkWebGLSupport()`).
  - Context loss handling (`webglcontextlost` event listener).
  - Static fallback layout (`FallbackHeroImage.tsx`): clean static hero presentation with layered CSS radial glows in `#7D39EB` and `#C6FF33`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 12 | 3D Canvas & WebGL Fallback Infrastructure | Persistent R3F Canvas, SSR-safe mounting, adaptive DPR, WebGL detection, static hero fallback | M2 | Survey 2, R1 |
| 13 | Dark Industrial Gym Environment & Lighting | 4-color lighting rig (#000000, #7D39EB, #C6FF33, #FFFFFF), rubber floor, chalk dust particles | M2 | Survey 2, R1 |
| 14 | 3D Athletic Hero Figure & Reveal | Power stance sculpt, dual rim lighting, cinematic reveal sequence, pointer parallax | M2 | Survey 2, R1 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M2.1 | Canvas & WebGL Detection Infrastructure | `src/components/canvas/GymCanvas.tsx`, `src/lib/webglSupport.ts`, `src/components/canvas/WebGLDetector.tsx`, `src/components/canvas/FallbackHeroImage.tsx` | M1 | IN_PROGRESS |
| M2.2 | Dark Industrial Environment & Floor | `src/components/canvas/GymEnvironment.tsx`, `src/components/canvas/GymFloor.tsx`, `src/components/canvas/DustParticles.tsx` | M2.1 | IN_PROGRESS |
| M2.3 | 3D Athletic Hero Figure & Reveal | `src/components/canvas/HeroFigure.tsx` | M2.2 | IN_PROGRESS |
| M2.4 | Dynamic Root Layout Integration | `src/app/layout.tsx` dynamic import with `ssr: false` in `#canvas-container` | M2.1 | IN_PROGRESS |

## Interface Contracts
### WebGL Detection Contract (`src/lib/webglSupport.ts`)
```typescript
export interface WebGLSupportResult {
  supported: boolean;
  version: 1 | 2 | null;
  renderer?: string;
  error?: string;
}

export function isWebGLAvailable(): boolean;
export function checkWebGLSupport(): WebGLSupportResult;
```

### Canvas Props Contract (`src/components/canvas/GymCanvas.tsx`)
```typescript
export interface GymCanvasProps {
  className?: string;
}
```

### Hero Figure Contract (`src/components/canvas/HeroFigure.tsx`)
```typescript
export interface HeroFigureProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}
```

## Code Layout (Worker Write Ownership)
- `src/components/canvas/GymCanvas.tsx`
- `src/components/canvas/GymEnvironment.tsx`
- `src/components/canvas/GymFloor.tsx`
- `src/components/canvas/HeroFigure.tsx`
- `src/components/canvas/DustParticles.tsx`
- `src/components/canvas/FallbackHeroImage.tsx`
- `src/components/canvas/WebGLDetector.tsx`
- `src/lib/webglSupport.ts`
- `src/app/layout.tsx` (Mount GymCanvas dynamically in `#canvas-container`)
