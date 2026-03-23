# EarningBySurfing — Version 22 (Login Stability Fix)

## Current State

Three disconnected auth systems exist simultaneously:

1. **Admin login** (`AdminPage.tsx`) — password `Admin@EBS2026` → `localStorage("ebs_admin_auth")` — works correctly.
2. **Member login** (`DashboardPage.tsx` `MemberLoginGate`) — Member ID/email → `localStorage("ebs_members")` — works only if user navigates directly to `/dashboard`.
3. **Navbar LOGIN button** (`Navbar.tsx`) — calls `useInternetIdentity().login()` which opens an ICP popup — broken for all regular members.

The Admin link in the Navbar never appears because `useIsAdmin()` calls `actor.isCallerAdmin()` on the ICP backend, which returns false for all users since no one is logged in via Internet Identity.

## Requested Changes (Diff)

### Add
- A shared `useMemberAuth` hook (or context) that reads/writes `localStorage("ebs_member_session")` — stores `{ id, name, email }` of the logged-in member.
- A `MemberLoginModal` component (dialog) that accepts Member ID or email input, validates against `localStorage("ebs_members")`, and saves the session on success.

### Modify
- **Navbar.tsx**: Remove `useInternetIdentity()` and `useIsAdmin()`. Replace with `useMemberAuth()`. The LOGIN button opens `MemberLoginModal`. LOGOUT clears the member session. Admin link shows when `localStorage("ebs_admin_auth") === "true"`.
- **DashboardPage.tsx**: Use the shared `useMemberAuth()` hook instead of its own isolated login gate — so a member who logs in from the Navbar is already authenticated on the Dashboard.

### Remove
- All `useInternetIdentity()` calls from `Navbar.tsx`.
- All `useIsAdmin()` ICP-based calls from `Navbar.tsx`.

## Implementation Plan

1. Create `src/frontend/src/hooks/useMemberAuth.ts` — a simple hook that reads/writes `localStorage("ebs_member_session")` with `{ id, name, email }`. Exposes `member`, `loginMember(record)`, `logoutMember()`.
2. Create `src/frontend/src/components/MemberLoginModal.tsx` — a shadcn Dialog with a Member ID or email input field that validates against `localStorage("ebs_members")` and calls `loginMember()` on success. Shows error on invalid input.
3. Update `Navbar.tsx` — replace Internet Identity with `useMemberAuth()`. LOGIN button opens the modal. Show DASHBOARD link and LOGOUT when member is logged in. Show ADMIN link when `localStorage("ebs_admin_auth") === "true"`.
4. Update `DashboardPage.tsx` — replace local `MemberLoginGate` with `useMemberAuth()` so sessions are shared with Navbar.
5. Validate, typecheck, and build.
