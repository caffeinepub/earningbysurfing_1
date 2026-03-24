# EarningBySurfing

## Current State
- Backend has full product, member, order, vendor, CMS, and admin functionality
- AI Product Hunter shows static seed products; no real affiliate API integration
- AI Buyer Finder uses hardcoded headline templates with no dynamic logic
- Pakistan block is frontend-only (UI restriction, no backend IP enforcement)
- http-outcalls component not yet selected

## Requested Changes (Diff)

### Add
- **ClickBank API integration** (Priority 1): Backend HTTP outcall to ClickBank Marketplace REST API (`https://api.clickbank.com/rest/1.3/products/list`) using stored API credentials. Returns real products with title, description, commission rate, affiliate hoplink.
- **Amazon Associates config placeholders**: Backend stores `amazonAccessKey`, `amazonSecretKey`, `amazonAssociateTag` as admin-settable config fields. No live calls yet -- ready to activate when keys are provided.
- **Smart Rule-Based Dynamic Headline Engine**: Frontend utility that takes a product's `title`, `description`, and `category` and outputs a unique headline using one of 8-10 proven copywriting formulas (curiosity, urgency, benefit-driven, social proof, fear of missing out, how-to, number-based, question, testimonial-style, transformation). Formula is selected deterministically based on product title hash so same product always gets the same formula, but different products get different formulas.
- **Backend Pakistan Block**: New `checkAccess` public query that receives a country code string and returns `false` for `"PK"`. Frontend calls this on app load and shows a hard block screen. Additionally, backend stores a blocklist of country codes that admin can manage.

### Modify
- **Backend `SiteSettings`**: Add `clickbankApiKey`, `clickbankClerkId`, `amazonAccessKey`, `amazonSecretKey`, `amazonAssociateTag` fields
- **`updateSiteSettings`**: Admin can set affiliate API credentials via existing settings update flow
- **AI Product Hunter page**: Add "Fetch Live ClickBank Products" button that calls backend HTTP outcall. Results display in the existing product grid. Show "API key not configured" state if keys are missing.
- **AI Buyer Finder**: Replace static template headlines with calls to the new Dynamic Headline Engine, passing real product data

### Remove
- Nothing removed -- all existing features preserved

## Implementation Plan
1. Select `http-outcalls` component
2. Generate Motoko backend with:
   - Extended `SiteSettings` to include ClickBank + Amazon credential fields
   - `fetchClickBankProducts(query, category)` -- HTTP outcall to ClickBank API using stored credentials
   - `getAffiliateConfig()` -- admin-only query returns which APIs are configured (boolean flags, no raw keys)
   - `checkCountryAccess(countryCode)` -- returns false for "PK", true otherwise; admin can manage blocklist
   - `updateBlockedCountries(countries)` -- admin sets blocked country list
3. Frontend:
   - Dynamic Headline Engine utility (headlineEngine.ts) with 10 copywriting formulas
   - AI Product Hunter: "Fetch Live Products" button wired to backend ClickBank call
   - AI Buyer Finder: Replace static headlines with headlineEngine output
   - App.tsx: On load, call `checkCountryAccess` with detected country; show hard block screen for PK
   - Admin Settings tab: Add affiliate API credential input fields (masked)
