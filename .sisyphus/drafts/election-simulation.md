# Draft: Election Simulation Feature

## User Request Summary
Build an Election Simulation feature for the Thai Election Dashboard that allows:
1. Configuration UI to set expected constituency seats (สส.เขต) per party
2. Random distribution of 400 constituency seats based on configuration
3. Preserve existing turnout data (actualVoters, invalidVotes, noVotes)
4. Party List calculation: 100 seats = (party votes / total votes) × 100
5. Display results with constituency + party list seats

## Research Findings

### Existing Data Structures (`/app/types.ts`)
- `PoliticalParty` - Complete party data (id, nameTh, nameEn, color, coalition, etc.)
- `PartyResult` - Election results (constituencySeats, partyListSeats, totalSeats, voteCount, votePercentage)
- `ElectionSimulationConfig` - Config structure (targetPartyId, turnoutTarget, swingFactors)
- `DistrictData` - Includes actualVoters, invalidVotes, noVotes (to preserve)

### Existing Simulation Logic (`/lib/partySimulation.ts`)
- `simulateElection(config)` - Already simulates elections with swing factors
- `REGIONAL_PARTY_STRENGTH` - Base support % by region (Bangkok, Central, North, Northeast, South)
- `REGIONAL_SEATS` - Seat distribution: Bangkok=33, Central=93, North=71, Northeast=149, South=54 (total=400)
- Party list calculation: `Math.round((votes / totalVotes) * PARTY_LIST_SEATS)` where PARTY_LIST_SEATS=100

### Existing Party Data (`/lib/partyData.ts`)
- `THAI_PARTIES` - 13 parties with full metadata
- Major parties: pp, ptp, bjt, utn, pprp, dem, tst, ctp, prd
- Constants: TOTAL_SEATS=500, CONSTITUENCY_SEATS=400, PARTY_LIST_SEATS=100, MAJORITY_THRESHOLD=251
- `getMajorParties()` - Returns top 8 parties

### UI Patterns (from `/app/admin/page.tsx`, `/app/page.tsx`)
- Modal pattern: Fixed overlay with max-w-md card
- Form inputs: Tailwind classes with focus:ring-2 focus:ring-blue-500
- Buttons: Blue (primary), gray (secondary) with hover states
- Toast messages: Fixed top-right with success/error styling
- Region filter: Rounded pill buttons
- Nav: Sticky with Links to other pages

### Chart Patterns (`/app/components/Charts.tsx`)
- Recharts: PieChart, BarChart, ComposedChart
- ResponsiveContainer with height 100%
- Custom tooltips with formatNumber/formatPercent
- Color mapping with CHART_COLORS

## Open Questions

### 1. UI Location
**Question**: Where should the simulation UI live?
- Option A: New dedicated page `/app/simulation/page.tsx`
- Option B: Add as tab/section in existing admin page `/app/admin/page.tsx`
- Option C: Modal accessible from main dashboard

### 2. Seat Input Method
**Question**: How should users input seat distribution?
- Option A: Direct number input per party (must sum to 400)
- Option B: Slider/percentage input per party (auto-calculates seats)
- Option C: Preset scenarios (e.g., "2023 Results", "PP Dominant", "Coalition Split")

### 3. Random Allocation Method
**Question**: How should "random" seat allocation work?
- The user said "random" - does this mean:
  - Option A: Seats allocated randomly to districts within each party's total
  - Option B: Total seats randomized with ±X variance from user input
  - Option C: Regional distribution follows REGIONAL_PARTY_STRENGTH but seats randomized within regions

### 4. Vote Count Calculation
**Question**: How should vote counts be derived?
- For party list calculation, we need vote counts. Options:
  - Option A: Derive votes from seat counts (reverse-engineer based on seat proportions)
  - Option B: User also inputs estimated vote percentages
  - Option C: Use existing turnout data × party support percentages

### 5. Results Display
**Question**: What results should be shown?
- Constituency seats per party ✓
- Party list seats per party ✓
- Total seats per party ✓
- Coalition totals (government vs opposition)?
- Can form government analysis (>251 seats)?
- Regional breakdown of seats?

## Technical Decisions
(To be confirmed)

## Scope Boundaries
(To be confirmed after user answers)
