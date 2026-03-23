# EarningBySurfing — Version 22.1

## Current State
- Hero globe uses a canvas-painted texture (makeEarthTexture) with manually drawn continent shapes
- Currency tokens: ₹, $, €, £, ¥ (5 tokens) orbiting the globe
- Login system: password-based for both members (default: Member ID) and admin (Admin@EBS2026) — already correct
- Logo: 50% wider, left-aligned — already correct
- Sub-headline in HomePage uses &mdash; HTML entity — already correct

## Requested Changes (Diff)

### Add
- NASA Blue Marble satellite texture loaded via CDN (unpkg.com/three-globe) using THREE.TextureLoader + useLoader hook
- UAE Dirham token (د.إ) as a 6th orbiting currency symbol (gold color)
- Specular/normalMap-style lighting on the globe for more photorealistic depth
- Atmosphere glow layer around the globe (thin blue halo)

### Modify
- TangibleGlobe: replace makeEarthTexture() canvas painting with real satellite texture loaded from CDN
- ORBIT_CONFIG: add د.إ entry alongside existing 5 currencies
- Globe geometry: increase segment count to 64x64 for smoother sphere at high texture resolution

### Remove
- makeEarthTexture() canvas drawing function (no longer needed once CDN texture loads)

## Implementation Plan
1. Import `useLoader` from `@react-three/fiber`
2. In TangibleGlobe, use `useLoader(THREE.TextureLoader, NASA_URL)` to load Blue Marble texture
3. Keep makeEarthTexture as fallback in case CDN fails (render inside ErrorBoundary)
4. Update ORBIT_CONFIG with UAE Dirham entry (6th token)
5. Tune globe material: increase metalness slightly, add emissive for atmosphere glow
6. Validate build
