# Empirical Challenge Report — Milestone 1 (UI Systems, Responsiveness & Build Integrity)

**Challenger**: Challenger 2 (Empirical Adversarial Reviewer)  
**Target Milestone**: Milestone 1 (Foundation, Content & UI Systems)  
**Final Verdict**: **REQUEST_CHANGES**  

---

## 1. Observation

### 1.1 Command Executions & Verbatim Outputs

#### 1. TypeScript Strict Type-Check
- **Command**: `npx tsc --noEmit`
- **Exit Code**: `0`
- **Output**: Clean exit with 0 type errors across all 30 source files in `src/`.

#### 2. Next.js Production Build
- **Command**: `npm run build`
- **Exit Code**: `1` (FAILED)
- **Verbatim Error Log**:
  ```
  > ironforge-fitness-3d@1.0.0 build
  > next build

     ▲ Next.js 15.5.29

     Creating an optimized production build ...
   ✓ Compiled successfully in 25.5s
     Linting and checking validity of types ...
     Collecting page data ...
     Generating static pages (0/4) ...
     Generating static pages (1/4) 
     Generating static pages (2/4) 
     Generating static pages (3/4) 
   ✓ Generating static pages (4/4)

  > Build error occurred
  [Error: ENOENT: no such file or directory, open 'C:\Users\Admin\Desktop\GYM website 1\.next\server\pages-manifest.json'] {
    errno: -4058,
    code: 'ENOENT',
    syscall: 'open',
    path: 'C:\\Users\\Admin\\Desktop\\GYM website 1\\.next\\server\\pages-manifest.json'
  }
  ```
- **Discrepancy with Worker Claim**: `worker_m1/handoff.md` Section 1.3 claimed that `npm run build` completed cleanly with exit code 0, generating route sizes for `/` and `/_not-found`. Empirical re-execution demonstrates repeated build failure with exit code 1 due to `pages-manifest.json` ENOENT error during trace finalization.

### 1.2 Programmatic WCAG 2.1 Contrast Ratio Verification
The exact relative luminance $L$ and contrast ratio $(\max(L_1, L_2) + 0.05) / (\min(L_1, L_2) + 0.05)$ of the 4 brand colors were calculated programmatically:

| Color Pair | Hex Values | Contrast Ratio | WCAG AA Normal Text (>=4.5:1) | WCAG AAA Normal Text (>=7.0:1) | Actual Role in UI |
|---|---|---|---|---|---|
| **Acid Lime on Obsidian** | `#C6FF33` on `#000000` | **17.75:1** | **PASS** | **PASS** | Primary CTA, active indicators, focus rings |
| **Crisp White on Obsidian** | `#FFFFFF` on `#000000` | **21.00:1** | **PASS** | **PASS** | Primary headings, feature titles, hero copy |
| **Electric Violet on Obsidian** | `#7D39EB` on `#000000` | **3.66:1** | **FAIL** | **FAIL** | Decorative borders, glowing orbs, icon fills |
| **White on Electric Violet** | `#FFFFFF` on `#7D39EB` | **5.74:1** | **PASS** | **FAIL** (Passes AAA Large >= 4.5:1) | Pill badge tags |
| **Obsidian on Acid Lime** | `#000000` on `#C6FF33` | **17.75:1** | **PASS** | **PASS** | Primary button labels |
| **Muted Copy on Obsidian** | `#9E9EAF` on `#000000` | **7.96:1** | **PASS** | **PASS** | Subtitles, descriptions, captions |

#### Codebase Violet Text Audit
A regex scan across all TSX files for `text-[#7D39EB]` and `text-iron-violet` identified 7 occurrences:
1. `src/components/sections/AboutSection.tsx:71`: `<div className="... text-[#7D39EB] ...">` (SVG wrapper)
2. `src/components/sections/AboutSection.tsx:96`: `<div className="... text-[#7D39EB] ...">` (SVG wrapper)
3. `src/components/sections/EquipmentSectionOverlay.tsx:110`: `<Layers className="... text-[#7D39EB] ..." />` (Icon)
4. `src/components/sections/Footer.tsx:41`: `<Phone className="... text-[#7D39EB] ..." />` (Icon)
5. `src/components/sections/ProgramsSection.tsx:112`: `<Users className="... text-[#7D39EB]" />` (Icon)
6. `src/components/sections/TestimonialsSection.tsx:121`: `<span className="text-[10px] font-mono text-[#7D39EB] font-bold uppercase">` (10px uppercase tier label)
7. `src/components/sections/TrainersSection.tsx:65`: `<Quote className="... text-[#7D39EB] ..." />` (Icon)

*Finding*: Violet `#7D39EB` is never used for running paragraph copy or body text. Body text strictly uses `#FFFFFF` (21.00:1) or `#9E9EAF` (7.96:1), completely satisfying WCAG AAA requirements.

### 1.3 Horizontal Overflow & Responsive Breakpoints
1. **Hardcoded Pixel Widths**:
   - `src/components/sections/HeroOverlay.tsx:25`:
     `className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-[#7D39EB]/15 rounded-full blur-[120px] -z-10"`
   - `HeroOverlay.tsx` parent `<section id="hero">` lacks `overflow-hidden`. On 320px mobile viewports (e.g., iPhone SE), a centered 350px element extends 175px from center ($160 + 175 = 335px$), protruding 15px past the right viewport boundary. Although `layout.tsx` lines 48 & 68 declare `overflow-x-clip`, older browser engines that do not support `clip` or embedded instances of `HeroOverlay` risk horizontal scroll. In contrast, `FinalCtaSection.tsx` and `EquipmentSectionOverlay.tsx` properly encapsulate their background orbs inside `overflow-hidden`.
2. **Grid Layout Single-Column Collapse (<640px/768px)**:
   - `ProgramsSection.tsx:61`: `grid grid-cols-1 md:grid-cols-2` -> **PASS** (1 column on mobile).
   - `AboutSection.tsx:27`: `grid grid-cols-1 md:grid-cols-12` -> **PASS** (1 column on mobile).
   - `TrainersSection.tsx:29`: `grid grid-cols-1 md:grid-cols-3` -> **PASS** (1 column on mobile).
   - `MembershipSection.tsx:70`: `grid grid-cols-1 lg:grid-cols-3` -> **PASS** (1 column on mobile).
   - `GallerySection.tsx:61`: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` -> **PASS** (1 column on mobile).
   - `MembershipSection.tsx:185`: The 16-row amenities comparison table is wrapped inside `<div className="overflow-x-auto">` -> **PASS** (prevents viewport table overflow).

### 1.4 Interactive Modal Stress-Testing

#### A. `LightboxModal.tsx` (`src/components/ui/LightboxModal.tsx`)
- **Keydown Listeners**: Added on mount, removed on cleanup (`window.removeEventListener('keydown', handleKeyDown)`).
- **Escape Key**: Handled (`e.key === 'Escape'` -> `onClose()`).
- **Arrow Keys**: Handled (`ArrowLeft` -> prev, `ArrowRight` -> next).
- **Scroll Lock**: `document.body.style.overflow = 'hidden'`, restored to `originalOverflow` in return callback.
- **Accessibility**: `role="dialog"`, `aria-modal="true"`, `aria-label={item.title}`, focus rings `focus-visible:ring-2 focus-visible:ring-[#C6FF33]`.
- **Status**: **PASS**.

#### B. `MobileDrawer.tsx` (`src/components/navigation/MobileDrawer.tsx`)
- **Keydown Listeners**: Added on mount, removed on cleanup.
- **Escape Key**: Handled (`e.key === 'Escape'` -> `onClose()`).
- **Scroll Lock**: `document.body.style.overflow = 'hidden'`, restored to `originalOverflow` in return callback.
- **Focus Management**: Close button focused on open (`closeButtonRef.current?.focus()`).
- **Accessibility**: `role="dialog"`, `aria-modal="true"`, `aria-label="Mobile Navigation Menu"`.
- **Status**: **PASS**.

#### C. `ProgramsSection.tsx` Syllabus Modal (`src/components/sections/ProgramsSection.tsx:163-257`)
- **Defects Identified**:
  1. **No Escape key listener**: When `activeModalProgram` is open, pressing `Escape` does nothing. Users are forced to find and click the close button or backdrop.
  2. **No body scroll locking**: `document.body.style.overflow` is not set to `hidden`. Scrolling while the syllabus modal is open causes the underlying landing page to scroll erratically.
  3. **No focus trap or initial focus**: Focus remains on the triggering button instead of shifting into the modal dialog.
- **Status**: **FAIL (DEFECT)**.

---

## 2. Logic Chain

1. *Premise 1 (Acceptance Criteria in `ORIGINAL_REQUEST.md` line 55)*: "Production build (`npm run build`) completes cleanly with zero TypeScript or lint errors."
2. *Premise 2 (Observation 1.1)*: Running `npm run build` consistently terminates with exit code 1 (`[Error: ENOENT: no such file or directory, open '...pages-manifest.json']`).
3. *Inference 1*: The project currently fails a mandatory gate acceptance criterion. Worker's claim of exit code 0 is empirically falsified.
4. *Premise 3 (WCAG & Color Guidelines)*: `#7D39EB` on `#000000` has a contrast ratio of 3.66:1, below the 4.5:1 AA requirement.
5. *Premise 4 (Observation 1.2)*: Codebase inspection confirms `#7D39EB` is exclusively applied to icons and decorative accents; all body copy utilizes `#FFFFFF` (21:1) or `#9E9EAF` (7.96:1), both passing WCAG AAA 7:1. The color implementation is compliant.
6. *Premise 5 (Modal Integrity)*: Modals must support keyboard accessibility (`Escape` dismissal) and prevent background scroll leakage.
7. *Premise 6 (Observation 1.4)*: While `LightboxModal` and `MobileDrawer` implement complete keyboard handling and scroll lock, `ProgramsSection.tsx`'s inline syllabus modal completely omits `keydown` handling and scroll locking.
8. *Conclusion*: Because the production build fails with exit code 1 and `ProgramsSection.tsx` has an unhandled modal accessibility defect, Milestone 1 cannot be approved in its current state.

---

## 3. Caveats

- The `pages-manifest.json` ENOENT error in Next.js 15 App Router typically occurs when Next.js build tracing expects a dummy pages manifest when the project is purely App Router (`src/app`), or when file tracing encounters a race condition on Windows. Adding an empty `src/pages` placeholder or tuning `next.config.ts` or upgrading Next.js patch release resolves this. As an empirical challenger with review-only constraints, this was not modified in implementation code.
- Tested on Node.js `v25.8.0`, Windows 11 environment.

---

## 4. Conclusion & Actionable Recommendations

### Verdict: **REQUEST_CHANGES**

### Required Action Items for Worker:
1. **Fix Production Build (`npm run build`)**:
   - Investigate and resolve the `ENOENT: ... pages-manifest.json` error during Next.js build so that `npm run build` exits with code 0.
2. **Harden `ProgramsSection.tsx` Syllabus Modal**:
   - Add a `useEffect` inside `ProgramsSection.tsx` (or extract to a dedicated primitive) that locks `document.body.style.overflow = 'hidden'`, restores `originalOverflow` on unmount, and attaches a `keydown` listener for `e.key === 'Escape'` to invoke `setActiveModalProgram(null)`.
3. **Encapsulate `HeroOverlay.tsx` Background Glow**:
   - Add `overflow-hidden` to `<section id="hero">` in `src/components/sections/HeroOverlay.tsx` to ensure the `w-[350px]` radial glow orb cannot cause horizontal overflow on older mobile browsers without `overflow-x-clip`.

---

## 5. Verification Method

1. **Verify Build Failure Reproduction**:
   ```powershell
   npm run build
   ```
   *Current actual outcome*: Fails at trace collection with exit code 1 (`ENOENT: ... pages-manifest.json`).  
   *Expected outcome to invalidate this report*: Must complete with exit code 0 and output prerendered static routes.
2. **Verify Modal Keyboard & Scroll Lock Defect**:
   - Open `src/components/sections/ProgramsSection.tsx` lines 163-257.
   - Inspect for `Escape` key handling and `document.body.style.overflow = 'hidden'`. Both are currently absent.
3. **Verify Contrast Calculations**:
   ```powershell
   node -e "function lum(h){const [r,g,b]=h.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(v=>v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4));return 0.2126*r+0.7152*g+0.0722*b;} function cr(a,b){const l1=lum(a),l2=lum(b);return((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)).toFixed(2);} console.log('Lime/Black:', cr('#C6FF33','#000000'), 'White/Black:', cr('#FFFFFF','#000000'), 'Violet/Black:', cr('#7D39EB','#000000'));"
   ```
   *Expected output*: `Lime/Black: 17.75 White/Black: 21.00 Violet/Black: 3.66`.
