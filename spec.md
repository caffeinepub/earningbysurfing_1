# EarningBySurfing

## Current State
- Navbar has a 200px 3D logo on the LEFT side
- Hero section has a full Three.js Canvas (HeroAnimation.tsx) with a large Earth globe + floating currency particles
- Currency particles sometimes disappear due to race conditions with texture loading / React lazy
- Navbar nav links (including Admin Panel) are present but can get crowded
- App had crash issues with blank white page (fixed in v37)

## Requested Changes (Diff)

### Add
- `NavGlobe.tsx` — a pure HTML5 Canvas 2D component: small blue rotating Earth globe (matching logo height ~80px) with 6 white currency text particles (₹, د.إ, $, €, £, ¥) orbiting it clockwise. This goes in the navbar immediately next to the logo. NO Three.js — use requestAnimationFrame + Canvas 2D only for zero-flicker reliability.

### Modify
- `Navbar.tsx`: Logo stays locked to far LEFT. NavGlobe sits immediately to the right of the logo. All nav links (including Admin Panel) have their own clear space, no overlap. Navbar height should accommodate both elements cleanly.
- `HeroAnimation.tsx` and its usage in `HomePage.tsx`: Remove or replace with a lightweight hero visual (just the solid saffron background + text). The large Three.js globe is replaced by the small NavGlobe in the navbar. This eliminates the main source of crashes and flickering.
- `HomePage.tsx`: Hero section keeps solid saffron (#FF9933) background and text. Remove the `<HeroAnimation>` canvas and `HeroErrorBoundary` wrapper — no more Three.js in the hero.

### Remove
- The large Three.js Canvas from the hero section (it is the root cause of flicker/crash issues)
- Any lazy imports of HeroAnimation from HomePage

## Implementation Plan
1. Create `src/frontend/src/components/NavGlobe.tsx` — Canvas 2D component, ~80x80px, draws a blue globe with lat/long grid lines, rotates clockwise at ~10deg/sec, 6 currency symbols orbit on 2 tilted elliptical paths clockwise. Use useRef for all animation state. Proper cleanup on unmount. NO React state updates in the animation loop.
2. Update `Navbar.tsx` — import NavGlobe, place it immediately after `<Logo3D />` in both desktop and mobile left sections. Ensure flex layout doesn't cause overlap with nav links. Logo stays at far left.
3. Update `HomePage.tsx` — remove HeroAnimation lazy import, HeroErrorBoundary, and the Canvas in the hero. Hero section keeps its saffron background and hero text.
4. Validate build.
