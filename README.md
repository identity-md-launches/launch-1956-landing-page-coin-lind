# LinD

A responsive landing page for LinD on Solana. The supplied red-haired mermaid sets the visual direction: turquoise water, deep ocean blue and coral accents. The new **Watermap** explains the planned use of creator fees:

1. Create LinD/Lindy and LinD/SOL liquidity pools.
2. Set the pools up to autocompound on Meteora.
3. Once LinD is liquid enough, direct fees toward bonding new launches on Lindy.

Contract: `7eJWuvU1JHskxsRNFomerJLHdjoiHR6QhSTm7GgH7rU3`

The existing launch/explorer links, copyable address, ocean artwork download, motion control and FAQ remain available. The Watermap describes a plan; the site does not create pools, configure autocompounding or execute transactions.

The production export is **`dist/`**, alongside the source, local assets and unchanged `package-lock.json`. All runtime assets are local, links between sections use hashes, and Vite's existing `base: './'` supports static hosting beneath a subpath.

## Install, develop and rebuild

Use Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

For a production build and preview:

```sh
npm run typecheck
npm run build
npm run preview
```

Open the HTTP URL printed by Vite. Serve the complete `dist/` directory, including `assets/`, `art/`, `fonts/` and `favicon.svg`. Opening the HTML directly with `file://` is not a supported module-loading setup. Include a fresh export with every source or runtime-asset change; hosting uses the export without rebuilding it. Do not include dependency directories or caches.

## Validation

With Playwright browsers available:

```sh
npm run test:interactions
```

On a development machine, `npx playwright install chromium webkit` installs the matching browser binaries. The script also accepts `--playwright /absolute/path/to/playwright/index.mjs` to use an already provided runtime. It creates its own temporary HTTP server, serves the export under `/preview/`, blocks foreign origins, runs the checks and closes the server and browsers. Reports/screenshots go to `test/scratch/interactions/`.

For this assignment, dependencies were installed into a temporary build copy using the existing package manifest and lockfile. Source, configuration and assets were copied unchanged into that build copy, the production commands were run there, and the resulting `dist/` was copied back. The provided Playwright runtime was used; no browser binaries or dependencies were installed into this repository. The final exported file hashes were compared with the tested build copy.

Actual final results:

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed, no TypeScript errors |
| `npm run build` | Passed, 31 modules transformed |
| Production interaction suite | 14 Chromium checks passed, 0 failed |
| Pinned design probe, offline | 16/16 checks passed |
| Axe WCAG A/AA scans | 0 violations, collapsed and expanded navigation/FAQ |
| Responsive export | No horizontal overflow at 320, 390, 720, 768, 1024 or 1440px |
| First screen at 390 × 844 | Product, launch action, Watermap link and complete contract visible |
| Clipboard | Actual Chromium copy checked; denied permission recovers with manual selection |
| Watermap | Hero/mobile/desktop links, direct hash reload and all three commitments checked |
| Resource/console health | No application errors or failed local resources |
| Reflow | 200% root text size and increased text spacing pass at 390px |

All six Better Interface domains were reviewed. A redundant ARIA label on the static pair names was removed and rechecked. The artwork remains unchanged; contrast was sampled over its rendered background at 320, 390 and 1440px, including both ends of the hero drift. Full details and measurement limits are in [the validation record](docs/validation.md); structured outcomes are in [check-results.json](docs/check-results.json).

**Limitations:** the browser connector returned `Transport closed`; rendered inspection used the provided Playwright runtime instead. WebKit could not launch, so Safari is unverified. Native screen readers, physical devices and browser-native zoom were not tested. Sampled image contrast does not certify every animation frame or viewport. The external launch destination was intercepted to verify navigation; no wallet, trade or external service availability was tested. Social preview rendering depends on the eventual host and platform.

## Maintenance

- Token address and external destinations: `src/config.ts` (unchanged).
- Content, Watermap and interactions: `src/App.tsx`.
- Design tokens and responsive layouts: `src/styles.css` and [DESIGN.md](DESIGN.md).
- Local artwork, favicon and fonts: `public/`; see [asset provenance](docs/assets.md).
- Social metadata and no-JavaScript fallback: `index.html`.
- Repeatable interaction checks: `scripts/validate.mjs`.
- Submission scope and size: [path budget](docs/path-budget.md).

The existing package files, build configuration, dependencies and ignore rules were preserved. Deployment and pool management are outside this website task.
