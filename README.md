# Soul Ledger

A Deadlock item/hero build simulator: pick a hero, buy items, watch your stat sheet update
live, and see the Weapon/Vitality/Spirit soul-investment bars fill toward their breakpoints
the way they do in the in-game shop.

## Stack

- React 18 + Vite
- Single component: `src/SoulLedger.jsx` (data, fetch layer, and UI all live here)

## Data

On load, the app fetches current heroes and items from `api.deadlock-api.com`. If that
fetch fails (offline, CORS, rate limit, or the API shape has changed), it falls back to a
bundled snapshot embedded in the component so the app still works. See the comments at the
top of the `LIVE API LAYER` section in `SoulLedger.jsx` for the exact endpoints and the
field-mapping logic — that's the one place to edit if the API's response shape doesn't match
what's guessed there.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL.

## Build

```bash
npm run build
npm run preview
```

## Working on this with Claude Code

Open this folder in a terminal and run `claude`. Useful first prompts:

- `Run npm install and npm run dev, then tell me if it starts cleanly.`
- `Open the browser devtools console output for the sample raw hero/item logs and check if the field names in mapApiHero/mapApiItem in src/SoulLedger.jsx match what the live API actually returns.`
- `Split src/SoulLedger.jsx into smaller files (data, api layer, component) without changing behavior.`
