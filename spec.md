# EarningBySurfing

## Current State
- Backend has a Product type with title, description, category (books/shoesAndClothes/technology/toys), imageUrl, featured fields.
- No AI review or quality score fields.
- No seeded products; admin must add manually.
- DashboardPage shows stats, recent activity, and profile only — no product section.
- HomePage shows trending products from backend or static fallback.

## Requested Changes (Diff)

### Add
- `aiReview: Text` and `qualityScore: Nat` (1-100) fields to Product type.
- New category variants: `#tech`, `#lifestyle`, `#wellness`.
- Seeded/curated affiliate products (4 per category = 12 total) auto-populated on first load via a backend init function.
- DashboardPage: "AI Product Hunter" section listing all products with AI Review text, Quality Score badge, "Generate Smart Link" button, and "WhatsApp Marketing Poster" button.
- HomePage ProductCard: display Quality Score badge and truncated AI Review excerpt.

### Modify
- Category type in backend: add `#tech`, `#lifestyle`, `#wellness`; keep existing variants for compatibility.
- Frontend category labels map to include new variants.
- Product card UI updated to show AI badge and score.

### Remove
- Nothing removed.

## Implementation Plan
1. Update backend Product type with aiReview and qualityScore.
2. Add new category variants.
3. Add `initProducts` function that seeds 12 curated affiliate products if store is empty.
4. Regenerate frontend bindings.
5. Update HomePage ProductCard to show Quality Score badge and AI Review snippet.
6. Add AI Product Hunter section to DashboardPage with Smart Link + WhatsApp Poster buttons.
7. Ensure all buttons/icons use Saffron (#FF9933) theme.
