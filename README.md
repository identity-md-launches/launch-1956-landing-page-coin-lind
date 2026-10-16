# LinD

A responsive anime-blue ocean landing page for LinD, with mermaids, seahorses, a copyable contract address, the supplied LindyLaunch link, downloadable artwork and an accessible FAQ.

Contract: `7eJWuvU1JHskxsRNFomerJLHdjoiHR6QhSTm7GgH7rU3`

The complete static export is in **`dist/`**. Source, local runtime assets, `package.json` and `package-lock.json` are included. There are no backend services, secrets, external font requests, analytics or wallet dependencies.

## Install and run

Use Node.js 22.12 or later (validated with Node 24).

```sh
npm ci
npm run dev
```

To typecheck, rebuild and preview the production export:

```sh
npm run typecheck
npm run build
npm run preview
```

Vite prints the preview URL. Serve `dist/` through an HTTP static server; opening the HTML as a `file://` document is not a supported module-loading setup. Publish the contents of `dist/`, including its `assets/`, `art/`, `fonts/` and favicon. Vite uses `base: './'`, local asset references are relative in the export, and section navigation uses hashes. The export was tested under `/preview/` with all foreign-origin requests blocked.

The publisher uses the included export rather than rebuilding. Rebuild `dist/` after any source or public-asset change and include the refreshed files with the source. Never include `node_modules`, caches or dependency archives.

## Validation

Install browser binaries and run the repeatable production-export interaction checks:

```sh
npx playwright install chromium webkit
npm run build
npm run test:interactions
```

Playwright may require system libraries on Linux. The script reports an unavailable browser as a limitation, never as a passing browser check. It serves the export under a subpath in a bounded process and closes its own server and browsers. Results and screenshots go to `test/scratch/interactions/`, which is not delivered.

Actual final results:

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed, no TypeScript errors |
| `npm run build` | Passed, 31 modules transformed |
| `npm run test:interactions` | 12 Chromium checks passed, 0 failed |
| Pinned `taste.mjs --out test/scratch/taste --offline` | 16/16 checks passed |
| Axe WCAG A/AA scans | 0 violations with navigation/FAQ collapsed and expanded; image-backed contrast required manual review |
| Responsive export | No horizontal overflow at 320, 390, 720, 768, 1024 or 1440px |
| 390px first screen | LinD, the launch action and the complete contract are visible |
| Resource/console checks | No application console errors or failed local resources |

For this assignment, dependencies were installed in a temporary build workspace outside the repository. The same source and lockfile were used there for the commands above, and the resulting export was copied back into `dist/`. The final JavaScript and CSS are the exact bundles tested. No dependency directories are included.

The pinned design probe is assignment input and is not redistributed; its final results are retained in `artifacts/check-results.json`. The interaction suite is included in `scripts/validate.mjs` for future checks.

**Limitations:** WebKit could not launch because its Linux system libraries were unavailable, so Safari behavior is unverified. Native screen readers, physical devices and browser-native 200% zoom were not tested. The tested 200% root text enlargement is a separate reflow check. No wallet or trade was performed. Relative social metadata is included; platform-specific unfurl behavior depends on the final hosting URL.

See [DESIGN.md](DESIGN.md) for the implemented system, [the validation record](artifacts/validation.md) for findings and evidence, [asset provenance](artifacts/assets.md) for artwork prompts and font licenses, and [the path budget](artifacts/path-budget.md) for packaging constraints.

## Maintenance

- Token identity and destinations: `src/config.ts`.
- Content and interactions: `src/App.tsx`.
- Design tokens, layout and states: `src/styles.css`.
- Local illustrations and fonts: `public/`.
- Title, description, favicon and share metadata: `index.html`.

Keep the full contract address visible. The site deliberately directs visitors to the supplied external token page rather than attempting to execute transactions.
