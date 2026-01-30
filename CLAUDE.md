# CLAUDE.md - AI Assistant Guide

This document provides essential context for AI assistants working on this codebase.

## Project Overview

**Thai Election Dashboard** - A Next.js application that visualizes Thailand's electoral data with interactive maps, charts, and statistics. The dashboard displays voter turnout data by region and electoral district (zone).

### Key Statistics
- **Total Eligible Voters**: ~52.2 million
- **Total Actual Voters**: ~39.5 million (~75.8% turnout)
- **Electoral Regions**: 5 (Bangkok, Central, North, Northeast, South)
- **Electoral Districts/Zones**: 115+

## Quick Commands

```bash
# Development
npm run dev          # Start dev server at localhost:3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

**Prerequisites**: Node.js 18+

## Project Structure

```
thai-election-dashboard/
├── app/                          # Next.js App Router
│   ├── api/election-data/        # CRUD API routes
│   │   └── route.ts              # GET/POST/PUT handlers
│   ├── components/               # React components
│   │   ├── ThailandMap.tsx       # Interactive map (react-simple-maps)
│   │   ├── Charts.tsx            # Pie & bar charts (Recharts)
│   │   ├── DistrictTable.tsx     # Searchable data table
│   │   └── StatsCard.tsx         # KPI stat cards
│   ├── admin/page.tsx            # Admin CRUD interface
│   ├── types.ts                  # TypeScript interfaces
│   ├── layout.tsx                # Root layout (Kanit font)
│   ├── page.tsx                  # Main dashboard
│   └── globals.css               # Tailwind + global styles
├── lib/
│   └── electionData.ts           # Data management utilities
├── data/
│   ├── election-data.json        # Primary election data (103KB)
│   ├── election-data-from-wevis.json  # Alternative data source
│   └── province_zones.json       # Province/zone mappings
├── scripts/
│   ├── import-csv-data.js        # CSV data import
│   └── import-wevis-data.js      # Wevis data transformation
└── dataA.csv                     # Source CSV election data
```

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| Language | TypeScript | 5.8.2 |
| UI | React | 18.3.1 |
| Styling | Tailwind CSS | 3.4.17 |
| Charts | Recharts | 2.12.7 |
| Maps | react-simple-maps | 3.0.0 |
| Icons | Lucide React | 0.363.0 |
| Font | Kanit (Google Fonts) | - |

## Architecture Patterns

### Client vs Server Components
- **Server Components**: `layout.tsx` (no 'use client' directive)
- **Client Components**: All pages and interactive components use `'use client'`

### Data Flow
1. **API Route** (`/api/election-data/route.ts`) - Handles CRUD operations
2. **Data Layer** (`lib/electionData.ts`) - Reads/writes to JSON files
3. **Data Storage** (`data/election-data.json`) - Persistent file storage

### State Management
- React hooks: `useState`, `useEffect`, `useMemo`, `useCallback`
- No external state management library (Redux, Zustand, etc.)

## Core Data Types

```typescript
// Primary interfaces from app/types.ts
interface DistrictData {
  name: string;                 // District/zone name
  voterCount: number;           // Eligible voters
  province: string;             // Province name
  zoneDescription?: string;     // Coverage description
  amphoeList?: string[];        // Sub-districts (อำเภอ)
  actualVoters?: number;        // Votes cast
  invalidVotes?: number;        // Invalid votes
  noVotes?: number;             // Blank votes
}

interface RegionData {
  regionName: string;           // Bangkok, Central, North, etc.
  totalVoters: number;          // Sum of eligible voters
  districts: DistrictData[];    // Districts in region
}

interface ElectionData {
  totalEligibleVoters: number;  // National total
  totalActualVoters?: number;   // National turnout
  lastUpdated: string;          // ISO timestamp
  regions: RegionData[];        // All regions
}

enum RegionFilter {
  ALL = 'All',
  BANGKOK = 'Bangkok',
  CENTRAL = 'Central',
  NORTH = 'North',
  NORTHEAST = 'Northeast',
  SOUTH = 'South'
}
```

## Code Conventions

### Naming
| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `ThailandMap.tsx` |
| Functions/Variables | camelCase | `fetchElectionData` |
| Interfaces/Types | PascalCase | `ElectionData` |
| Enums | PascalCase | `RegionFilter.NORTH` |
| Constants | UPPER_SNAKE_CASE | `REGION_COLORS` |

### Import Order
1. React imports
2. Third-party libraries (Next.js, Recharts, etc.)
3. Local types (`@/app/types`)
4. Local components
5. Local utilities/services

### Component Pattern
```typescript
'use client';  // Mark client components

import React, { useState } from 'react';
import { DistrictData } from '../types';

interface Props {
  data: DistrictData[];
  onSelect?: (district: DistrictData) => void;
}

export const DistrictTable: React.FC<Props> = ({ data, onSelect }) => {
  const [search, setSearch] = useState('');
  // ...
};
```

### Styling
- Use Tailwind CSS utility classes exclusively
- Custom colors defined in component (e.g., `REGION_COLORS` map)
- Font family via CSS variable: `font-sans` (Kanit)
- Responsive design: mobile-first approach

### Error Handling
- Wrap async operations in try/catch
- Return fallback data on failures to prevent UI crashes
- Use `console.error` for logging
- Display user-friendly error messages

## API Endpoints

### `GET /api/election-data`
Returns complete election data.

### `POST /api/election-data`
Perform CRUD operations.
```json
{
  "action": "update" | "add" | "delete",
  "regionName": "string",
  "districtName": "string",
  "district": { /* DistrictData */ },
  "updates": { /* Partial<DistrictData> */ }
}
```

### `PUT /api/election-data`
Save complete dataset (full replacement).

## Key Components

### ThailandMap (`app/components/ThailandMap.tsx`)
- Interactive TopoJSON map using react-simple-maps
- External map data: `https://raw.githubusercontent.com/apisit/thailand.json/master/thailand.json`
- Features: region clicking, turnout visualization, tooltips
- Province-to-region mapping for all 77 Thai provinces

### Charts (`app/components/Charts.tsx`)
- `VotersByRegionPie`: Pie chart of voter distribution
- `TopDistrictsBar`: Horizontal bar chart of top 10 districts

### DistrictTable (`app/components/DistrictTable.tsx`)
- Searchable, expandable table
- Real-time filtering by name, province, or zone

## Data Import Scripts

### `scripts/import-csv-data.js`
- Reads `dataA.csv` (official election results)
- Maps Thai provinces to regions
- Outputs to `data/election-data.json`

### `scripts/import-wevis-data.js`
- Transforms `data/province_zones.json`
- Includes zone descriptions and amphoe lists
- Outputs to `data/election-data-from-wevis.json`

## Development Guidelines

### When Adding New Components
1. Create in `app/components/` with PascalCase naming
2. Add `'use client'` directive if interactive
3. Export as named export: `export const ComponentName`
4. Use TypeScript interfaces for props
5. Apply Tailwind CSS for styling

### When Modifying Data
1. Update types in `app/types.ts` if schema changes
2. Modify `lib/electionData.ts` for data operations
3. Update API route if new operations needed
4. Test with admin interface at `/admin`

### When Working with the Map
- Map uses TopoJSON from external GitHub source
- Province names must match exactly (English, PascalCase)
- Region colors defined in `REGION_COLORS` constant
- Turnout colors use gradient scale

## Common Tasks

### Add a new region filter
1. Add value to `RegionFilter` enum in `app/types.ts`
2. Add mapping in `ThailandMap.tsx` province-to-region map
3. Add filter button in `page.tsx`

### Add a new chart
1. Create component in `app/components/Charts.tsx`
2. Import and use in `page.tsx`
3. Pass appropriate data props

### Update election data
1. Modify `data/election-data.json` directly, OR
2. Use admin interface at `/admin`, OR
3. Run import script with new source data

## Testing

**No testing framework configured.** Consider adding:
- Jest or Vitest for unit tests
- React Testing Library for component tests
- Playwright or Cypress for E2E tests

## Deployment

Optimized for Vercel deployment:
```bash
npm run build   # Creates .next/
npm start       # Runs production server
```

Static data files are included in the repository.

## Important Notes

1. **Data is for demonstration** - Not official ECT (Electoral Commission of Thailand) data
2. **Thai language support** - UI uses Thai labels with English translations
3. **No authentication** - Admin panel is publicly accessible
4. **File-based storage** - Data persists to JSON files (not a database)
5. **External map dependency** - TopoJSON loaded from GitHub at runtime

## Path Aliases

```json
// tsconfig.json
"@/*": ["./*"]
```

Use `@/` prefix for root imports:
```typescript
import { ElectionData } from '@/app/types';
import { getElectionData } from '@/lib/electionData';
```
