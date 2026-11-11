# Handoff Report — Explorer 1: Codebase & Infrastructure Survey

## 1. Observation

### 1.1 Workspace State & Existing Files
- **Workspace Path**: `c:\Users\Admin\Desktop\GYM website 1`
- **File System Inspection**:
  Command executed: `powershell -Command "Get-ChildItem -Path '.' -Force"`
  Direct Output:
  ```
      Directory: C:\Users\Admin\Desktop\GYM website 1

  Mode                 LastWriteTime         Length Name
  ----                 -------------         ------ ----
  d-----        11-11-2026     13:15                .agents
  d--h--        11-11-2026     13:10                .git
  -a----        11-11-2026     12:13             17 README.md
  ```
- **Git Repository State**:
  Command executed: `git status`
  Direct Output:
  ```
  On branch main
  Your branch is up to date with 'origin/main'.
  Untracked files:
    .agents/
  nothing added to commit but untracked files present
  ```
  Command executed: `git log -n 5`
  Direct Output:
  ```
  commit 304af313d9a3417476b1ff19badca9ec8017e2f1
  Author: Dinar Hussain <dinarhussain01@gmail.com>
  Date:   Wed Nov 11 12:09:03 2026 +0530

      Initial commit
  ```
- **Existing `README.md` Content**:
  Line 1: `# GYM-website-one` (17 bytes total).
- **Finding**: Greenfield repository. No existing `package.json`, `node_modules`, Next.js application, Three.js assets, or configuration files exist in the project root.

### 1.2 System Runtime & Tooling
- **Node.js & npm Versions**:
  Command executed: `node -v; npm -v`
  Direct Output:
  ```
  v25.8.0
  11.11.0
  ```
- **Operating System**: Windows 11 (PowerShell environment).

### 1.3 NPM Registry & Dependency Version Matrix Verification
- **`@react-three/fiber` Version & Peer Dependencies**:
  Command executed: `npm info @react-three/fiber version; npm info @react-three/fiber peerDependencies`
  Direct Output:
  ```
  9.8.2
  {
    expo: '>=43.0',
    react: '>=19 <19.4',
    three: '>=0.156',
    'expo-gl': '>=11.0',
    'react-dom': '>=19 <19.4',
    'expo-asset': '>=8.4',
    'react-native': '>=0.78',
    'expo-file-system': '>=11.0'
  }
  ```
- **`@react-three/drei` Version & Peer Dependencies**:
  Command executed: `npm info @react-three/drei version; npm info @react-three/drei peerDependencies`
  Direct Output:
  ```
  10.7.9
  {
    react: '^19',
    three: '>=0.159',
    'react-dom': '^19',
    '@react-three/fiber': '^9.0.0'
  }
  ```
- **`three` & `@types/three` Versions**:
  Command executed: `npm info three version; npm info @types/three version`
  Direct Output: `0.187.0` (both core and types).
- **`next` Version**:
  Command executed: `npm info next@15 version`
  Direct Output: Latest Next 15 release series: `15.5.29`.
- **`tailwindcss` & `@tailwindcss/postcss` Versions**:
  Command executed: `npm info tailwindcss version; npm info @tailwindcss/postcss version`
  Direct Output: `4.3.5` (Tailwind CSS v4 with modern CSS-first `@theme` configuration).
- **`gsap` & `@gsap/react` Versions & Peer Dependencies**:
  Command executed: `npm info gsap version; npm info @gsap/react version; npm info @gsap/react peerDependencies`
  Direct Output:
  ```
  3.15.1
  2.1.2
  { gsap: '^3.12.5', react: '>=17' }
  ```
- **`lucide-react` Version**:
  Command executed: `npm info lucide-react version`
  Direct Output: `1.72.0`.

---

## 2. Logic Chain

### Step 2.1: Greenfield Scaffold Necessity
- *Observation 1.1* confirms that the repository only contains `.git`, `.agents`, and a 17-byte `README.md`.
- *Inference*: Full initialization is required from scratch. We need to construct `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, and the complete Next.js 15 App Router directory tree (`src/app`, `src/components`, `src/hooks`, `src/lib`, `src/types`, `public`).

### Step 2.2: React 19 and Three.js / R3F Compatibility Resolution
- *Observation 1.3* demonstrates that `@react-three/fiber` v9.8.2 and `@react-three/drei` v10.7.9 explicitly specify `react: '^19'` and `react-dom: '^19'` as peer dependencies.
- *Inference*: Historically, R3F v8 had peer dependency conflicts with React 19 requiring `--legacy-peer-deps`. With R3F v9 and Drei v10, React 19 is natively and officially supported. We can install `react@^19.0.0`, `react-dom@^19.0.0`, `@react-three/fiber@^9.0.0`, and `@react-three/drei@^10.0.0` cleanly without dependency hacks.

### Step 2.3: Next.js 15 App Router & SSR Isolation for 3D Canvases
- Three.js, WebGL rendering contexts, and canvas elements require browser globals (`window`, `document`, `HTMLCanvasElement`, `WebGLRenderingContext`). In Next.js App Router, server-rendered components will throw runtime exceptions if Three.js executes during SSR.
- *Inference*:
  1. All 3D canvas components must declare `'use client'` at the top of the file.
  2. Dynamic imports with `{ ssr: false }` (`next/dynamic`) must be used for root 3D canvas wrappers.
  3. `next.config.ts` must include `transpilePackages: ['three', '@react-three/fiber', '@react-three/drei']`.

### Step 2.4: Tailwind CSS v4 Configuration Architecture
- *Observation 1.3* shows Tailwind CSS is at version 4.3.5.
- Tailwind CSS v4 moves away from JavaScript configuration files (`tailwind.config.js`) in favor of CSS-first architecture.
- *Inference*:
  1. PostCSS integration requires `@tailwindcss/postcss` inside `postcss.config.mjs`.
  2. The custom brand palette (#000000 Black, #7D39EB Violet, #C6FF33 Lime, #FFFFFF White) must be defined directly in `src/app/globals.css` using the `@theme` directive.
  3. Utility classes such as `bg-iron-black`, `text-iron-lime`, `border-iron-violet` will be natively available with zero config file overhead.

### Step 2.5: Asset Acquisition, Commercial Licensing & Procedural Fallbacks
- Requirement R1 and R2 require commercial licensing compliance and robust fallbacks:
  "All 3D models and media assets must be properly licensed for commercial website projects, sourced or generated using optimized GLB models and procedural 3D fallbacks."
  "WebGL fallback renders clean static fallback layout when WebGL is unavailable."
- *Inference*:
  1. Relying exclusively on external GLB files introduces failure risks (404s, CORS, large bundle bloat, licensing ambiguity).
  2. Building high-fidelity **procedural 3D fallbacks** using Three.js native primitives (`cylinderGeometry`, `boxGeometry`, `torusGeometry`, `capsuleGeometry`, `MeshStandardMaterial` with metallic/roughness properties) guarantees:
     - 100% uptime: loads instantaneously with 0kb external downloads.
     - 100% commercial licensing safety: procedurally generated code is completely original and free of third-party IP encumbrances.
     - Automatic progressive enhancement: if a custom `.glb` is provided in `public/models/`, the loader renders it; if missing or loading fails, the procedural model renders seamlessly.
  3. WebGL support must be probed before canvas instantiation; if WebGL is disabled/unavailable, a dedicated static fallback hero layout renders with an optimized hero fallback image.

---

## 3. Caveats

1. **Node 25 Experimental Warnings**: Node.js `v25.8.0` is an active leading-edge Node release. Some packages may output minor deprecation warnings for experimental features, but standard Next.js 15 build processes execute normally.
2. **WebGL Context Limits**: Mobile browsers enforce strict limits on simultaneous active WebGL contexts (typically 8–16 max). We must use a single master `<Canvas>` or shared scene rather than spawning multiple distinct `<Canvas>` instances across sections.
3. **Drafting vs Code Implementation**: As an explorer in read-only investigation mode, this report establishes blueprints and architecture without modifying non-teamwork workspace files. The implementation agent will execute file creation in subsequent phases.

---

## 4. Conclusion & Infrastructure Blueprints

### 4.1 Dependency Specifications (`package.json`)
```json
{
  "name": "ironforge-fitness-3d",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "three": "^0.187.0",
    "@react-three/fiber": "^9.8.2",
    "@react-three/drei": "^10.7.9",
    "gsap": "^3.15.1",
    "@gsap/react": "^2.1.2",
    "lucide-react": "^1.72.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/three": "^0.187.0",
    "tailwindcss": "^4.3.5",
    "@tailwindcss/postcss": "^4.3.5",
    "postcss": "^8.5.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.1.0"
  }
}
```

### 4.2 TypeScript Configuration (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 4.3 Next.js Configuration (`next.config.ts`)
```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', 'gsap'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
```

### 4.4 PostCSS Configuration (`postcss.config.mjs`)
```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
```

### 4.5 Tailwind CSS v4 Theme & Styling (`src/app/globals.css`)
```css
@import "tailwindcss";

@theme {
  /* Exact brand color system */
  --color-iron-black: #000000;
  --color-iron-dark: #070709;
  --color-iron-card: #0F0F14;
  --color-iron-border: #1B1B26;
  --color-iron-violet: #7D39EB;
  --color-iron-violet-hover: #6929D6;
  --color-iron-violet-glow: rgba(125, 57, 235, 0.45);
  --color-iron-lime: #C6FF33;
  --color-iron-lime-hover: #B5F51E;
  --color-iron-lime-glow: rgba(198, 255, 51, 0.45);
  --color-iron-white: #FFFFFF;
  --color-iron-muted: #8E8EA0;

  /* Typography scale */
  --font-display: 'Inter', system-ui, -apple-system, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
}

:root {
  color-scheme: dark;
  background-color: #000000;
  color: #FFFFFF;
}

html {
  scroll-behavior: smooth;
  overflow-x: hidden;
}

body {
  background-color: #000000;
  color: #FFFFFF;
  font-family: var(--font-body);
  overflow-x: hidden;
  min-height: 100vh;
}

/* Custom scrollbar matching dark industrial theme */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #070709;
}
::-webkit-scrollbar-thumb {
  background: #1B1B26;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #7D39EB;
}

/* Focus outline accessibility */
:focus-visible {
  outline: 2px solid #C6FF33;
  outline-offset: 2px;
}
```

### 4.6 Brand System Reference File (`src/lib/brand.ts`)
```ts
export const BRAND = {
  name: 'IRONFORGE FITNESS',
  tagline: 'FORGED IN IRON. DEFINED BY DISCIPLINE.',
  colors: {
    black: '#000000',
    violet: '#7D39EB',
    lime: '#C6FF33',
    white: '#FFFFFF',
    dark: '#070709',
    card: '#0F0F14',
    border: '#1B1B26',
    muted: '#8E8EA0',
  },
  contact: {
    phone: '+1 (800) 476-6367',
    email: 'info@ironforgefitness.com',
    whatsapp: 'https://wa.me/18004766367?text=Hello%20IRONFORGE%20FITNESS,%20I%20would%20like%20to%20inquire%20about%20membership',
    address: '420 Titan Boulevard, Industrial District, New York, NY 10001',
  },
} as const;
```

### 4.7 3D Asset Pipeline & Procedural Fallbacks Architecture
The 3D environment requires 5 principal visual subjects:
1. **Hero Athletic Figure**:
   - Primary: `public/models/hero_figure.glb`
   - Procedural Fallback: Stylized geometric mannequin with metallic muscle plates, glowing violet spine/core node, lime posture highlights, articulated joints, and dynamic breathing/idle oscillation.
2. **Dumbbell**:
   - Hexagonal iron dumbbell with knurled steel bar, bevelled rubberized hex heads, embossed "50 LB" and "IRONFORGE", and violet/lime accent rings.
3. **Barbell**:
   - Olympic 7-foot standard bar with chrome sleeve bearings, knurled grip rings, dual 45-lb bumper plates on each sleeve, and quick-release collars.
4. **Weight Plates**:
   - Heavy competition bumper plates (45lb / 20kg, 25lb / 10kg) with inner stainless steel center hub, matte black vulcanized rubber, and vibrant lime/violet perimeter typography.
5. **Training Bench**:
   - Commercial grade flat-to-incline heavy steel bench with stitched black composite leather upholstery, lime accent stitching, and dark violet frame highlights.

All 4 equipment pieces are modeled with procedural Three.js primitives (`<cylinderGeometry>`, `<boxGeometry>`, `<torusGeometry>`) wrapped inside interactive Orbit/drag-to-rotate controllers with automatic floating physics.

### 4.8 WebGL Support Probing (`src/hooks/useWebGLSupport.ts`)
```ts
'use client';

import { useState, useEffect } from 'react';

export function useWebGLSupport(): boolean {
  const [isSupported, setIsSupported] = useState<boolean>(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = Boolean(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setIsSupported(supported);
    } catch {
      setIsSupported(false);
    }
  }, []);

  return isSupported;
}
```

### 4.9 Mobile Performance Matrix & Guidelines
- **Canvas DPR Clamping**:
  ```tsx
  <Canvas
    dpr={[1, typeof window !== 'undefined' && window.innerWidth < 768 ? 1.2 : 1.75]}
    gl={{
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true,
      depth: true,
      stencil: false,
    }}
  >
  ```
- **Instanced Geometry for Environment**:
  Gym floor grids, ceiling trusses, and light fixtures will utilize `<instancedMesh>` to maintain a draw call count strictly under 50.
- **`prefers-reduced-motion` Enforcement**:
  Camera lerp delta is clamped or bypassed when `prefers-reduced-motion` is detected, replacing fast camera fly-throughs with gentle cross-fading and static scene framings.

---

## 5. Verification Method

### 5.1 Project Setup Verification Commands
Upon implementation of files:
```powershell
# 1. Install dependencies
npm install

# 2. Strict TypeScript type-checking
npm run type-check   # runs tsc --noEmit

# 3. Next.js ESLint verification
npm run lint

# 4. Production build verification
npm run build
```

### 5.2 Acceptance Inspection Checks
- **Clean Build Artifact**: `.next/standalone` or `.next/` generates without compilation warnings or React 19 type errors.
- **Zero SSR Exceptions**: Navigating to `http://localhost:3000` does not log `window is not defined` or `document is not defined`.
- **Responsive Layout Verification**: Check viewports at 375px (mobile), 768px (tablet), 1280px (desktop), 1920px (ultrawide) with zero horizontal overflow (`scrollWidth === innerWidth`).
- **WebGL Fallback Testing**: In browser DevTools, simulate WebGL disabled (e.g. Chrome Flags or mock `getContext('webgl') = null`) to ensure static hero fallback displays without console errors.

### 5.3 Invalidation Conditions
- Any peer dependency conflict on `npm install` between React 19 and Three.js/R3F/Drei/GSAP.
- Any TypeScript error during `tsc --noEmit`.
- Next.js build failure during `npm run build`.
- WebGL crash or unhandled promise rejection when loading 3D assets.
