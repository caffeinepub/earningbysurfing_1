# EarningBySurfing

## Current State
The site has text-based branding in the Navbar ("EarningBySurfing" in Saffron text). The Hero section uses a static CSS gradient background. Two logo images have been generated:
- Wide: `/assets/generated/earning-by-surfing-logo-transparent.dim_1200x600.png`
- Square: `/assets/generated/earning-by-surfing-logo-square.dim_512x512.png`

The index.html has no favicon set.

## Requested Changes (Diff)

### Add
- Favicon in index.html using the square logo
- 3D looping animated scene in the Hero section background (Three.js/React Three Fiber): animated surfboard riding a wave with glowing saffron particles, continuously looping

### Modify
- Navbar brand: replace the text `<span>EarningBySurfing</span>` with `<img>` using the wide logo (`/assets/generated/earning-by-surfing-logo-transparent.dim_1200x600.png`), max height ~48px, preserving the Link wrapper
- Hero section: overlay the existing gradient with the 3D animated canvas behind the text content

### Remove
- Nothing removed

## Implementation Plan
1. Update `index.html`: set `<link rel="icon">` to the square logo path, set page `<title>` to "EarningBySurfing"
2. Update `Navbar.tsx`: swap brand text for `<img>` tag with the wide logo, appropriate height and max-width, with `alt="EarningBySurfing"`
3. Create `HeroAnimation.tsx`: React Three Fiber canvas with a looping 3D scene — floating torus/surfboard mesh, particle field in saffron (#FF9933), wave ripple effect, all continuously animating
4. Update `HomePage.tsx`: import and render `HeroAnimation` as absolute background inside the Hero section, behind the text z-index
