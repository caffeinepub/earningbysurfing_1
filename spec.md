# EarningBySurfing

## Current State
- Full platform with member login (localStorage-based, 4000 members), admin panel, product inventory, vendor portal, agent status dashboard
- Earnings data is stored in localStorage only and resets on page refresh
- No SHOP ALL page -- SHOP ALL navbar link redirects to homepage
- Navbar search bar is non-functional (no click handler)
- Admin Change Password is missing from Settings tab
- No lead research tool or referral link system

## Requested Changes (Diff)

### Add
- **Earnings Persistence**: Backend `saveEarnings(memberId, data)` and `getEarnings(memberId)` endpoints to persist earnings by member ID (Text key, no ICP auth required since member system is custom)
- **SHOP ALL Page** (`/shop`): Public page showing all inventory products with search/filter by category; logged-in members see "Generate Smart Link" button per product
- **Search Bar**: Connect navbar search input to navigate to `/shop?q=searchterm`
- **Admin Change Password**: Working form in Admin Settings tab that validates current password and saves new one to localStorage (same pattern as existing admin auth)
- **Manual Lead Research Tool**: New tab or section in member dashboard with buttons to open Reddit, Facebook Groups, LinkedIn searches in new tab for affiliate outreach
- **Referral/Invite Link System**: Member dashboard shows unique referral URL (`siteUrl?ref=MEMBERID`), copy-to-clipboard button, and tracks referral count

### Modify
- `DashboardPage.tsx`: Load earnings from backend on mount, save to backend whenever earnings change
- `AdminPage.tsx`: Add Change Password section to Settings tab
- `Navbar.tsx`: Connect search bar submit to `/shop?q=query`
- Backend `main.mo`: Add earnings storage map and two endpoints

### Remove
- Nothing

## Implementation Plan
1. Add `EarningsRecord` type and `earningsData` map to Motoko backend; add `saveEarnings(memberId: Text, data: EarningsJSON: Text)` and `getEarnings(memberId: Text) : async ?Text` (store as JSON text to avoid complex Candid types)
2. Regenerate frontend bindings
3. Create `/shop` route and `ShopAllPage.tsx` with search/filter, product cards, and conditional Smart Link generation
4. Update `DashboardPage.tsx` to call `getEarnings` on load and `saveEarnings` on any earnings update
5. Add working search handler to `Navbar.tsx`
6. Add Change Password form to Admin Settings tab in `AdminPage.tsx`
7. Add Lead Research Tool section to `DashboardPage.tsx`
8. Add Referral/Invite Link section to `DashboardPage.tsx`
9. Add `/shop` route to router
