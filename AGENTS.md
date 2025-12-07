# BigfootBallclub - EA Sports FC Pro Clubs Stats Dashboard

## Project Overview

This is a Next.js web application that displays statistics, player performance metrics, and match history for the "BigfootBallclub" EA Sports FC Pro Clubs team. The app consumes the EA Sports FC API to fetch real-time team and player data.

**Club ID:** 287755
**Platform:** common-gen5 (PlayStation 5/Xbox Series X)
**Deployment:** Cloudflare Pages/Workers (Edge runtime)

## Technology Stack

- **Framework:** Next.js 15.1.6 with App Router (React 19.0.0)
- **Language:** TypeScript 5 (strict mode)
- **Runtime:** Cloudflare Workers Edge runtime
- **Styling:** Tailwind CSS 4.0.12 with custom OKLCH color tokens
- **UI Components:** shadcn/ui (New York variant) + Radix UI primitives
- **Charts:** Recharts
- **Fonts:** Geist and Geist Mono
- **Package Manager:** pnpm 10

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/proclubs/            # API routes (Edge runtime, 5-min cache)
│   │   ├── route.ts             # Team stats endpoint
│   │   ├── matches/route.ts     # Match history endpoint
│   │   └── team/route.ts        # Team details endpoint
│   ├── players/page.tsx         # Player stats page
│   ├── matches/page.tsx         # Match history page
│   ├── layout.tsx               # Root layout with theme provider
│   └── page.tsx                 # Home (team summary)
├── components/                   # Atomic Design pattern
│   ├── atoms/                   # Small reusable components
│   ├── molecules/               # Composite components
│   ├── organisms/               # Complex feature components
│   ├── pages/                   # Page-level components
│   ├── templates/               # Layout templates
│   └── ui/                      # shadcn/ui components
├── types/
│   └── match.ts                 # TypeScript type definitions
├── utils/
│   └── PlayerStatsUtils.ts      # Stats calculation utilities
└── lib/
    └── utils.ts                 # cn() utility for class merging
```

## Component Architecture

This project follows **Atomic Design principles**:

- **Atoms:** `StatValue`, `FormattedStatValue`, `GameAverageToggle`, `PlayerRating`, etc.
- **Molecules:** `StatCard`, `PlayerStatsCard`, `MatchScoreDisplay`, `StatRow`, etc.
- **Organisms:** `PlayerComparison`, `MatchStatsSummary`, charts, data visualizations
- **Pages:** `TeamSummary`, `PlayerStatsDashboard`, `MatchTrackerPage`
- **Templates:** Layout wrappers and page structures

**Component Location Strategy:**

- Place new components in the appropriate atomic level based on complexity
- Use index files for barrel exports
- Keep related components together

## Code Conventions

### File Naming

- **Components:** PascalCase (e.g., `PlayerStatsCard.tsx`)
- **Utilities:** camelCase (e.g., `PlayerStatsUtils.ts`)
- **Types:** kebab-case (e.g., `match.ts`)

### Component Patterns

- Use functional components with TypeScript
- Explicit prop interfaces: `ComponentNameProps`
- Client components must have `"use client"` directive
- Use barrel exports via `index.ts` files for clean imports

### Import Patterns

- Path alias `@/*` maps to `src/*`
- Import UI components from `@/components/ui`
- Import utilities from `@/utils`

### Styling

- **Utility-first Tailwind CSS** - prefer Tailwind utilities over custom CSS
- **OKLCH color space** for better perceptual uniformity
- Custom color tokens defined in `globals.css`:
  - `--win` / `--loss` / `--draw` for match results
  - Theme variables for light/dark mode
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, `lg:`, etc.)
- Use `cn()` utility from `@/lib/utils` for conditional classes

## API Integration

### EA Sports FC API

- **Base URL:** `https://proclubs.ea.com/api/fc`
- **Proxy through:** `/api/proclubs/*` routes (handles CORS)
- **Cache:** 5-minute cache headers on API responses
- **Fallback:** Mock data used when API fails

### Key Endpoints

- `/api/proclubs` - Team member statistics
- `/api/proclubs/matches` - Match history with detailed stats
- `/api/proclubs/team` - Team details and metadata

### Edge Runtime

All API routes use Cloudflare Edge runtime for global distribution and low latency.

## Key Features & Utilities

### Statistics Calculations (PlayerStatsUtils.ts)

- **Per-90 calculations:** Normalize stats to per-90-minute rates
- **Win rate calculations:** Track player performance correlation with wins
- **Position distribution:** Analyze position play patterns
- **Form tracking:** Last 5 matches performance
- **Player comparisons:** Side-by-side stat analysis

### Special Handling

- Filter out goalkeeper-only players from field player stats
- Handle missing data gracefully (show "N/A" or skip calculations)
- Support toggling between total stats and per-90 rates

## Development Workflow

### Commands

```bash
pnpm dev              # Start dev server with Turbopack
pnpm build            # Production build
pnpm lint             # Run ESLint
pnpm pages:build      # Build for Cloudflare Pages
pnpm preview          # Preview Cloudflare Pages locally
pnpm pages:deploy     # Deploy to Cloudflare
pnpm cf-typegen       # Generate Cloudflare types
```

### Git Workflow

- **Conventional commits** enforced via Commitizen
- **Pre-commit hooks** with Husky and lint-staged
- PR validation checks: lint, format, build
- Auto-deploy to Cloudflare on push to `main`

## Testing

**No testing infrastructure currently exists.** When adding tests, consider:

- Vitest for unit tests (Vite-compatible)
- React Testing Library for component tests
- Playwright for E2E tests

## Important Notes

### When Working on This Project

1. **Always use pnpm** - Not npm or yarn
2. **Edge runtime constraints** - API routes run on Cloudflare Workers (no Node.js APIs)
3. **Component placement** - Follow Atomic Design pattern strictly
4. **Styling** - Prefer Tailwind utilities; custom CSS should be rare
5. **Type safety** - Maintain strict TypeScript typing
6. **API caching** - Consider the 5-minute cache when debugging API issues
7. **Per-90 stats** - Some views disable per-90 calculations (check toggle state)

### Gotchas

- The EA Sports FC API can be flaky - fallback to mock data is intentional
- Some stats are goalkeeper-specific and should be filtered for field players
- Match history includes playoff matches - may need special handling
- Club ID 287755 is hardcoded - if supporting multiple clubs, this needs refactoring

### Security

- No sensitive data stored locally
- API routes act as proxy to prevent CORS issues
- No authentication required (public stats)

## Cloudflare Deployment

This app is optimized for Cloudflare Pages with the Edge runtime adapter. The deployment configuration is in `.github/workflows/deploy.yml` and uses `@cloudflare/next-on-pages` for compatibility.

### Environment Variables

Currently none required. If adding secrets (API keys, etc.), use Cloudflare Pages environment variables.

## Design System

### Colors (OKLCH)

- Uses modern OKLCH color space for better perceptual uniformity
- Semantic colors for match results: win (green), loss (red), draw (gray)
- Full dark mode support via `next-themes`

### Typography

- **Primary:** Geist (sans-serif)
- **Monospace:** Geist Mono (for stats and numbers)

### Spacing & Layout

- Responsive grid layouts
- Mobile-first approach
- Consistent spacing using Tailwind scale

## Future Considerations

- Add testing infrastructure
- Consider Cloudflare KV for caching (reduce API calls)
- Support multiple clubs (currently hardcoded)
- Add player detail pages
- Historical data tracking and trends
