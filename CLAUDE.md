# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start Vite dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
npm test          # run scripts/test-soul-ledger.js
```

There is no test runner/framework — `npm test` is a single plain Node script (`scripts/test-soul-ledger.js`) that makes **live network requests** to `api.deadlock-api.com` and asserts against plain functions re-implemented inline (item-slot caps, ability-tier prerequisites, AP budgeting, soul-boon sync). It requires network access; there is no way to run "a single test" — it always runs the whole file top to bottom and exits non-zero on any failed assertion. There is no lint script configured.

## Architecture

Soul Ledger is a single-page React app (Vite + React 18, no router, no state library) that simulates Deadlock hero builds: pick a hero, buy items, watch stat totals and ability progression update live.

**Everything lives in [src/SoulLedger.jsx](src/SoulLedger.jsx)** — one ~1600-line file containing the CSS-in-JS string, all data-fetching/normalization logic, all derived-stat math, and the entire component tree. `src/main.jsx` only mounts it. When making changes, expect to work within this one file rather than hunting across modules.

### Data flow: live API with bundled fallback

- `fetchDeadlockData()` fetches heroes and items from `api.deadlock-api.com` (`HEROES_API_URL` / `ITEMS_API_URL`). On any failure it falls back to the bundled snapshots `FALLBACK_HEROES` / `FALLBACK_ITEMS`, setting `dataSource` to `"live"` or `"fallback"` (shown in the header badge).
- Raw API objects are heavily irregular (KV3-derived JSON with inconsistent key names), so normalization leans on fuzzy helpers rather than fixed schemas: `findApiNumber`/`findApiText`/`collectApiNumbers` walk an object tree matching key names against lowercased substring patterns (e.g. `["cooldown", "cooldowntime"]`), and `extractAbilityMeta` uses these to pull `description`, `cooldown`, `duration`, `charges`, `chargeDelay`, `damage`, `spiritScaling` off each ability's raw item object.
- `normalizeName()` (strip to lowercase alnum) is used to cross-reference live API entries against the fallback dataset by name, e.g. to recover a `cat`/`mods`/`cond` when the live payload doesn't cleanly map to one.
- Items are filtered to "main gamemode" items only: disabled/unshopable/in_development/non-tiered/non-shop-slot items are excluded (see the filter in `fetchDeadlockData` and its mirror in the test script).
- Each hero carries up to 4 `abilities` (from `items.signature1..4` on the raw hero, resolved via a `class_name -> raw item` map), each with an `upgrades` array (tier 1/2/3, AP costs 1/2/5) whose `property_upgrades` become `{prop, bonus, formatted}` bonus entries via `formatBonusText`.

### Derived-stat pipeline

Stat totals are recomputed from scratch on every render via `useMemo`, not stored in state:

1. `computeRawTotals(build)` — flat sum of every purchased item's `mods` map.
2. `computeInvestments(build)` — per-category (`weapon`/`vitality`/`spirit`) soul spend via `categorySpend`, mapped to a bonus percentage via `investmentBonus` against the shared `INVEST_BREAKPOINTS`/`INVEST_VALUES` tables.
3. `computeAbilityStatDeltas(...)` — sums stat bonuses from currently-unlocked ability upgrade tiers (`unlockedAbilityTiers`), matching each upgrade's `prop` name against known aliases (e.g. `TechPower`/`SpiritPower`/`BonusSpirit` all map to `spirit`).
4. `computeFinalDeltas(...)` combines all of the above plus soul-boon scaling (see below) into `{ raw, inv, abDeltas, final, boons }` — `final` is what the stat sheet renders, and every stat's tooltip breakdown (`getStatBreakdown`) re-derives its line items independently rather than reusing a single cached list, so **stat math and its tooltip explanation are written twice and must be kept in sync by hand**.

### Hero progression / soul boons

Progression is soul-cost-driven, not XP-driven: `getHeroProgression(souls)` maps `buildSouls` (sum of item tier costs in the current build) through the shared `LEVEL_SOUL_THRESHOLDS` table (levels 0-35) to a `level`. `ABILITY_UNLOCK_LEVELS = [0,2,4,7]` are the levels that grant an ability-slot unlock instead of an ability point; all other levels grant 1 AP, capped at `MAX_ABILITY_POINTS = 32`. `unlockedBoons` is just `level` — every level also linearly scales bonus HP/weapon-dmg%/spirit via each hero's `levelUp` coefficients (`hp`/`dmg`/`spirit` per level, sourced from `standard_level_up_upgrades` on the raw hero or fallback constants).

Ability slot unlocks (`unlockedAbilitySlots`) and per-tier upgrades (`unlockedAbilityTiers`) are separate pieces of state with their own prerequisite rules enforced in `toggleAbilityUnlock`/`toggleAbilityTier`: slots 0-2 unlock in any order up to `abilityUnlocks`, slot 3 (the ultimate) requires level 7 and auto-unlocks via a `useEffect`; tiers require the previous tier and enough unspent AP (`spentAP` vs `abilityPoints`), and un-unlocking a tier cascades to clear higher tiers.

### Item slot capacity

Base capacity is fixed at 9; `walkersDestroyed` (0-3, user-toggled) adds up to 3 more via `maxItems`. Active items are additionally capped at 4 regardless of slot count. Both rules are enforced in `toggleItem` and mirrored in `scripts/test-soul-ledger.js`.

### Styling

All CSS lives in the `CSS_STYLES` template literal at the top of the file and is injected via a `<style>` tag in the component — there are no separate `.css` files or CSS modules. Colors/spacing are driven by CSS custom properties defined once in `:root` (`--weapon`, `--vitality`, `--spirit`, `--souls`, etc.) and reused via category-name string interpolation (e.g. `className={"invest-name " + cat}`).

### Deployment

[vite.config.js](vite.config.js) switches `base` to `"./"` when `GITHUB_ACTIONS` is set, so the same build works both locally (`/`) and as a GitHub Pages project site (relative paths). [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) builds and deploys `dist/` to Pages on push to `main`.
