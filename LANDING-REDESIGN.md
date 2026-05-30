# Landing Redesign — Handoff / Context

> **For any Claude reading this:** this is the full context for the in-progress visual
> redesign of the Spike marketing landing (`spike-agents` repo → spikeai.co.il).
> Read it before touching `app/page.tsx`. **Nothing here is committed yet** — it all
> lives in the working tree. The dev server runs at `http://localhost:3000`.

---

## 1. What this is
A from-scratch visual redesign of the marketing landing page (`app/page.tsx`).
Stack: **Next.js 16 (Turbopack) + React 19 + Tailwind v4 + framer-motion + three.js**, Hebrew **RTL**.
A `shadcn` init was run mid-project (added `components/ui/button.tsx`, `lib/utils.ts`, `components.json`, deps).

## 2. Design direction (LOCKED — do not drift)
- **Dark premium base** `#08090A` (OLED) **+ Spike brand teal/cyan ACCENT**: `#22D3B0` / `#5BD0F2` / `#5EEAD4`.
  - This is **not** pure monochrome (we tried that and reverted) and **not** full rainbow color.
- **Mascot/robots stay in their original blue-teal color** (teal drop-shadow glow). The `.mascot-mono`
  class no longer greyscales — it just adds a teal glow (name kept to avoid churn).
- **Verbatim, do not change:** all Hebrew copy, the 9 agents (names + descriptions), both lead forms
  (hero quick form + detailed `#cta` form), the Web3Forms POST + תיקון-13 consent logging, legal links.
- **Accessibility:** WCAG AA, `prefers-reduced-motion` respected everywhere, mobile-first, RTL correct.
- Typography: **Heebo** (Hebrew + Latin body), **Space Grotesk** (Latin display: wordmark, step numerals, tags).

## 3. Page order (top → bottom)
1. **Hero** (dark): eyebrow + kinetic headline (`צוות שלם שעובד בשבילך, בלי לבקש משכורת`) + 3-field quick lead form + blue robot.
2. **Video** (`#video`): normal `<video controls>` (no autoplay, no scroll-hijack) — explainer "ראה את הסוכנים בפעולה".
3. **Light zone — product tablet** (`#product`): 3D tablet (`ContainerScroll`) showing the **agents-dashboard** screenshot. "כל הסוכנים שלך, במסך אחד". **Sits right under the video** (moved up per Dean). Its opaque `#f5f5f7` bg covers the dark wrapper behind it.
4. **How it works** (`#how`): 3 steps.
5. **Magic-moment** (`#magic`): "תראה את הקסם בזמן אמת" — real product screenshot in a `BrowserFrame`.
6. **Agents** (`#agents`): 9 agent cards (monochrome SVG line icons, teal tint).
7. **Insight** (`#insight`): "יודע מה אוזל, לפני שזה קורה" — inventory screenshot in a `PhoneFrame` (2-col: copy + phone), since it's tall/square.
8. **Approvals** (`#approvals`): "AI מסמן. אתה מחליט." — real product screenshot (the iron rule, visualized).
9. **Colorful** (shader): teal-tinted WebGL shader + `LiquidButton` "מוכן להתחיל? בוא נדבר" → scrolls to `#cta`.
10. **Pricing** (`#pricing`).
11. **Detailed lead form** (`#cta`).
12. **FAQ** (`#faq`).
13. **Footer**. Plus a **sticky mobile CTA** bar.

## 4. Files
**New components** (vendored from 21st.dev, then adapted for RTL + brand + reduced-motion):
- `components/ui/container-scroll-animation.tsx` — 3D tablet that flattens on scroll. Light/RTL/reduced-motion. Used in `#product`.
- `components/ui/web-gl-shader.tsx` — scoped (`absolute`, sized to its section, paused offscreen via IntersectionObserver + on tab-hidden, disposed on unmount). Fragment shader **tinted teal/cyan** (red channel suppressed). Used in the colorful zone.
- `components/ui/liquid-glass-button.tsx` — `LiquidButton`. Used as the colorful-zone CTA.
- `components/ui/scroll-expansion-hero.tsx` — **currently UNUSED.** Was a scroll-expand hero; replaced by the normal video per Dean's request. Safe to delete.
- `components/ui/button.tsx`, `lib/utils.ts` — from the shadcn init (`cn()`).

**Modified:**
- `app/page.tsx` — the whole redesign + `BrowserFrame` (window-chrome frame for wide screenshots) and `PhoneFrame` (for tall screenshots) helper components.
- `app/globals.css` — design tokens (dark + `--brand*` teal + shadcn tokens), `.glass` / `.eyebrow` / `.btn-primary` (teal gradient) / `.field` / `.sheen` (teal) / `.ambient` (teal) / `.video-frame`, `.zone-light`, reduced-motion block. **Note:** removed a broken `@import "shadcn/tailwind.css"` the init added (that file doesn't exist).
- `app/layout.tsx` — Heebo + Space Grotesk + Inter (`--font-sans`), `cn` on `<html>`.
- `package.json` / `package-lock.json` — added `three`, `@types/three`, + shadcn deps (`class-variance-authority`, `clsx`, `lucide-react`, `radix-ui`, `tailwind-merge`, `tw-animate-css`, `shadcn`). `framer-motion` was already present.
- `.gitignore` — `__pycache__/`, `*.pyc`, `.dev.log`.

## 5. Product screenshots — IN PLACE (real exports from app.spikeai.co.il)
Live at `public/shots/` (real PNGs, ~100–130KB each). Rendered with next/image **`unoptimized`**
so the raw file is served straight from `/public` (the Next image optimizer otherwise cached a
stale version under the same URL — that's why a swap first showed the old placeholder).
**To swap any screenshot: just overwrite the file with the same name — no code change, no cache bust.**
Public URL is `/shots/<name>.png` (NOT `/public/shots/`).

| Screenshot | File | Real size | Appears in |
|---|---|---|---|
| Real-time pipeline (WhatsApp → Watcher → draft) | `public/shots/pipeline.png` | 1552×1162 | `#magic` (`BrowserFrame`) |
| Posts approval (אשר/דחה) | `public/shots/approvals.png` | 1571×1270 | `#approvals` (`BrowserFrame`) |
| 9-agent dashboard grid | `public/shots/agents.png` | 2000×1137 (wide) | tablet `#product` (`object-cover` top) |
| Inventory analysis (tall) | `public/shots/inventory.png` | 1261×1291 | `#insight` (`PhoneFrame`) |

## 6. Run locally
```powershell
cd C:\Users\Din\Desktop\spike-agents
npm run dev          # → http://localhost:3000  (Claude edits hot-reload)
npx tsc --noEmit     # passes
npm run build        # passes
```

## 7. Gotchas learned this session
- **Restart the dev server after dependency/config changes.** A long-running Turbopack dev server held a stale module graph after the shadcn init and reported `Can't resolve '@/lib/utils'` even though `next build` passed. Fix: stop dev, `Remove-Item -Recurse -Force .next`, restart.
- **framer-motion `useScroll({ target })` was flaky** with the sticky child; the (now removed) expand hero used a manual rect-based scroll-progress `MotionValue` instead.
- **Automated screenshot tools hang** on this page while the WebGL shader / video animate (the page never reaches "idle"). Verify visually on `localhost:3000`.
- **`overflow-x-hidden` computes to `overflow-y: auto`** (nested scroll container) — the dark wrappers use `overflow-x-clip` to avoid sticky-ancestor traps.

## 8. Not committed
Only prior commit this session: `e760e8a` (the `.claude/skills/ui-ux-pro-max` design skill).
Everything else (the redesign) is uncommitted working-tree changes.
Untouched housekeeping (Dean's call): `README.md.backup`, `docs/PROJECT-OVERVIEW.md.backup`,
`app/og-image.png`, the `ChatGPT Image…png` → underscore rename.

## 9. Open / next
- ✅ Real screenshots dropped in (§5).  ✅ Product tablet moved to right under the video.
- Fine-tune if needed: shader color intensity, frame sizing, the agents-dashboard crop inside the tablet, inventory phone size.
- Then: `tsc` → `build` → commit (and decide whether to fold in the backup-file cleanup).
