# EarningBySurfing

## Current State
The Admin Panel at `/admin` has multiple tabs: Members, Products, Orders, Global Insights, Vendor Requests, Settings, Pages. There is no Agent Status dashboard. The platform has three functional areas that were previously described as 'AI Agents': Marketing Agent (ClickBank lead scanning), Member Agent (4000-member login sync), and AI Product Hunter (ClickBank API integration).

## Requested Changes (Diff)

### Add
- New "Agent Status" tab in the Admin Panel (shown FIRST in the tab list)
- Agent Status dashboard with 3 agent cards:
  1. **Marketing Agent** -- status indicator (Active/Standby), last scan time, leads found count, "Scan for Leads" trigger button that queries ClickBank affiliate marketplace for affiliate marketers/dropshippers
  2. **Member Agent** -- status indicator, total members in DB, last login count (last 24h from localStorage), sync status
  3. **AI Product Hunter** -- status indicator (Active if ClickBank keys set, Standby if not), ClickBank API connection status (reads from existing settings), products fetched count
- Each agent card shows: status badge (green ACTIVE / yellow STANDBY), last activity timestamp, key metric, action button
- "Scan for Leads" button performs a simulated ClickBank affiliate search (fetches ClickBank marketplace categories as proxy for affiliate network data), shows results as a list of affiliate program leads with name, category, commission rate
- Scan results stored in localStorage (`ebs_lead_scan_results`) and displayed in a results panel below the agent cards
- Live activity log panel at the bottom showing timestamped log entries for agent actions
- All in Saffron (#FF9933) and white theme

### Modify
- Admin Panel tab order: Agent Status tab added as the first tab

### Remove
- Nothing removed

## Implementation Plan
1. Add `AgentStatusTab` component with 3 agent cards
2. Marketing Agent card: reads `ebs_lead_scan_results` from localStorage, "Scan for Leads" button triggers ClickBank marketplace API call (using existing http-outcall pattern or simulated fetch to ClickBank categories), stores results
3. Member Agent card: reads `ebs_members` from localStorage, counts entries, reads recent login activity
4. AI Product Hunter card: checks localStorage for ClickBank API key settings (`ebs_clickbank_key`), shows Active/Standby accordingly
5. Activity log: appended to localStorage `ebs_agent_log`, displayed as scrollable list
6. Insert AgentStatusTab as first tab in AdminPage
