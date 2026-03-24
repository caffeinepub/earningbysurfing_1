# EarningBySurfing — Version 35

## Current State
- Navbar has a left-aligned `Logo3D` component using `/assets/generated/ebs-logo-3d-v2.dim_1400x600.png` with CSS 3D tilt/shine effects
- HeroAnimation.tsx contains the Earth globe + 6 pink currency particle orbits, loaded lazily in HomePage
- All core features (Pakistan block, 4000-member login, ClickBank, Saffron theme) are active

## Requested Changes (Diff)

### Add
- Nothing new to add

### Modify
1. **Navbar Logo**: Replace the left-aligned `Logo3D` component with the uploaded emblem image (`/assets/uploads/ebs_logo-019d1d9c-c55a-7198-bb68-22a6ae85a1fc-1.png`). Center it in the navbar as the dominant element. Apply `mix-blend-mode: multiply` so the cream-white card background blends transparently into the white navbar. Retain the 3D tilt/shine hover effect on the new image. Container should be centered, not left-aligned.
2. **Hero Globe + Currency Particles**: Verify and ensure `HeroAnimation.tsx` (Earth globe rotating clockwise + 6 pink currency particles ₹, د.إ, $, €, £, ¥ orbiting clockwise) is properly imported and rendered in `HomePage.tsx`. Restore if missing or broken.

### Remove
- Remove the old Logo3D component's hardcoded image path (`/assets/generated/ebs-logo-3d-v2.dim_1400x600.png`)

## Implementation Plan
1. In `Navbar.tsx`: Update `Logo3D` to use the new uploaded image path `/assets/uploads/ebs_logo-019d1d9c-c55a-7198-bb68-22a6ae85a1fc-1.png`. Change navbar layout to center the logo (use `justify-center` or absolute centering). Apply `mix-blend-mode: multiply` on the image to make cream background transparent. Keep 3D tilt/shine CSS hover effects.
2. In `HomePage.tsx`: Confirm `HeroAnimation` lazy import and `<HeroErrorBoundary><Suspense><HeroAnimation /></Suspense></HeroErrorBoundary>` are intact and correctly positioned in the hero section. If the globe or currencies are missing from the rendered DOM, restore the full implementation.
3. Validate build.
