# LinD update: validation and design review

## Scope and assumptions

This update continues the existing LinD landing page. It applies the supplied mermaid reference and adds the requested Watermap, while preserving token identity, external destinations, the ocean gallery/download, copy-address behavior, FAQ and optional hero motion.

The reference image is bundled unchanged. Its red hair, turquoise water and warm highlights guide the UI palette. Creator-fee allocation, Meteora autocompounding and later Lindy bonding are presented as the requester's plan, not verified active services. No liquidity threshold, dates, split percentages, pool addresses or performance figures were invented. No contract, wallet or deployment work was performed.

The tested production artifact is `dist/`, served under `/preview/` with external requests blocked. The required source, package manifest and lockfile remain alongside it. No build/dependency configuration or ignore rule changed. This is a worker-side check record, not an independent certification.

## Requirements

| Requirement | Status | Evidence |
| --- | --- | --- |
| Use the supplied mermaid for style and colors | Met | Exact supplied PNG in hero/story/share metadata; coral and turquoise semantic tokens |
| Explain both creator-fee LPs | Met | `src/App.tsx:202`, Watermap step 1 names LinD/Lindy and LinD/SOL |
| Explain Meteora autocompounding | Met | Step 2 states the planned setup and reinvestment |
| Explain later new-launch bonding | Met | Step 3 retains the “Once LinD is liquid enough” condition |
| Usable responsive site and interactions | Met | 14 passing Chromium checks; 320–1440px reflow checks |
| Static export, source and lockfile | Met for delivery | Complete `dist/`, local assets, unchanged package files; repository collection/commit is handled by the network |
| Build and typecheck | Met | Both commands exit 0; 31 modules built |
| Six-domain design review | Met | Coverage and resolved finding below; 16/16 taste checks |
| Product/action on first 390px screen | Met | Screenshot inspected; heading y=308–412, main action y=507–561, address y=620–685 |
| Title, favicon, description, social title/image | Met | `index.html:6`; probe share check and local asset check pass |
| Final design and rebuild documentation | Met | Root `DESIGN.md` and `README.md` updated after final source change |

No requirement is implemented with fabricated live data. Hosting is handled after review.

## Better Interface coverage

| Domain | Status | Checked | Limits / not applicable |
| --- | --- | --- | --- |
| Accessibility | Checked | Native links/buttons/details, heading outline, list semantics, alt text, stable copy announcements, keyboard menu/Escape/FAQ, skip-link Tab order, visible primary-action focus, clipboard failure recovery, reduced motion; final Axe collapsed/expanded scans: 0 violations and no incomplete checks | Native screen readers and physical touch devices not tested. No forms or modal dialogs are present. |
| Layout | Checked | First screen at 390 × 844; full desktop/mobile screenshots; Watermap at 390 and 1440; no overflow at 320/390/720/768/1024/1440; full address remains visible; 200% root text size and text-spacing stress | Native browser zoom, translated strings and RTL layouts not tested. The site is English-only. |
| Writing | Checked | Both LP names, the fee plan's future tense and liquidity condition, defined LP abbreviation, plain action labels, copy error recovery, five-word hero headline, FAQ link to Watermap | No independent verification of project operations or economic outcomes; the text describes the supplied plan. |
| Typography | Checked | Six sizes, three families, two weights; local faces loaded; heading hierarchy, wrapping and selectable complete address; desktop/mobile screenshots inspected | OS font rasterization and other scripts/locales not tested. |
| Colors | Checked | Solid token pairs measured; probe contrast passes; actual image backgrounds sampled at 320/390/1440 at both hero-drift endpoints; focus ring visually inspected | The probe alone excludes six image/gradient-backed boxes. Manual pixel sampling covers the stated frames and viewports, not all possible frames/sizes. |
| UI | Checked | Native disclosure states, mobile-menu states, success/failure clipboard states, hover/focus/pressed CSS, pause/resume and reduced-motion states, flat surfaces, connector lines, no nested cards, no `transition: all` | Animation-panel slow-motion playback, physical-device gestures and Safari rendering not tested. No loading feed, form or transaction states exist. |

## Resolved finding

**Low, accessibility: redundant label on a static pair row.** Source: `src/App.tsx:222`, `.watermap-pairs`.

- Before: `<div className="watermap-pairs" aria-label="Planned liquidity pairs">`. A follow-up Axe inspection returned `aria-prohibited-attr` as incomplete because the generic `div` did not have a role supporting a name.
- Change: removed the redundant `aria-label`; the visible pair names and surrounding ordered-step text provide the content through native semantics.
- Recheck: rebuilt production output and reran the complete interaction suite. Final collapsed and expanded Axe scans report zero violations and an empty incomplete list. The final design probe passes all 16 checks.

The requested content and visual changes also resolve the prior project's absence of a Watermap and use of a different lead mermaid. Those are assignment changes, not claims of pre-existing functional failures. No applicable unresolved finding remains from the performed checks.

## Commands and actual results

The protected package/configuration files were copied byte-for-byte into a temporary build directory. Dependencies were installed there with `npm ci --prefix "$LIND_BUILD_DIR" --cache /tmp/lind-npm-cache --no-audit --no-fund`. No dependency installation wrote into this repository.

Final production commands:

```sh
npm --prefix "$LIND_BUILD_DIR" run typecheck
npm --prefix "$LIND_BUILD_DIR" run build
PLAYWRIGHT_BROWSERS_PATH=/opt/imd-tools/ms-playwright \
  npm --prefix "$LIND_BUILD_DIR" run test:interactions -- \
  --playwright /opt/imd-tools/playwright-mcp/node_modules/playwright/index.mjs
IMD_PLAYWRIGHT=/opt/imd-tools/playwright-mcp/node_modules/playwright/index.mjs \
  PLAYWRIGHT_BROWSERS_PATH=/opt/imd-tools/ms-playwright \
  node .imd/reads/skills/design-critic/scripts/taste.mjs \
  --out test/scratch/taste --offline
```

All four commands exited 0. Typecheck found no errors; Vite built 31 modules. The interaction suite passed 14 Chromium checks: first-screen visibility, menu keyboard/Escape, external destination/navigation isolation, Watermap navigation and text, supplied artwork/metadata, real clipboard copy, denied clipboard recovery, local artwork download, FAQ keyboard disclosure, motion/reduced motion, responsive assets/layout, text enlargement/spacing, Axe collapsed/expanded states, and console/resource health. External navigation was intercepted; its live service was not tested.

The probe passed render, layout, targets, contrast, casing, tracking, eyebrows, type sizes, type faces, glyphs, slogans, repetition, copy budget, chrome, motion and share. At 390px it measured 18 controls, none below 44px, and 7 words of prose on the first screen. It found 13 endless animations with normal motion and zero running under reduced motion.

Additional bounded scratch checks exercised desktop Watermap navigation and Tab order, captured focus and Watermap screenshots, and sampled image-backed contrast. A first scratch Axe invocation used Playwright's direct `browser.newPage()` helper and was rejected by Axe; it was corrected to `browser.newContext()` and rerun successfully. The shipped interaction suite already used a context and passed throughout. A Python image-analysis attempt lacked Pillow; the same pixel calculation was completed with browser Canvas without adding dependencies.

Final `dist/` hashes were compared against the tested build copy. Protected-file hashes were compared before/after. The supplied PNG's source, local asset and exported asset hashes agree. File integrity/packaging checks are recorded in `docs/check-results.json` and `docs/path-budget.md`.

## Rendered contrast and visual evidence

Solid-pair WCAG ratios were calculated from browser-computed tokens:

| Foreground / background | Ratio |
| --- | --- |
| Main text / page | 15.71:1 |
| Muted text / page | 9.58:1 |
| Muted text / Watermap surface | 8.28:1 |
| Coral accent / Watermap surface | 8.00:1 |
| Pair names / Watermap surface | 10.16:1 |
| Primary-action text / fill | 7.96:1 |
| Primary-action text / hover fill | 9.85:1 |
| Focus / page | 14.76:1 |

For image-backed copy, text was made transparent without removing its layout or background; the resulting screenshot was sampled across each text range's rectangle. Declared text colors were compared against every background pixel in that rectangle. This is conservative about empty space within a text box. The hero's normal-motion animation was paused at 0 and 16 seconds.

| Width | Lowest ratio, phase 0 | Lowest ratio, phase 16s | Outcome |
| --- | --- | --- | --- |
| 320 | 3.46:1 | 4.24:1 | Every sampled range meets its applicable threshold; lower minima belong to large display text |
| 390 | 4.68:1 | 4.82:1 | Every sampled range passes |
| 1440 | 6.91:1 | 7.26:1 | Every sampled range passes |

Normal-size text was checked against 4.5:1 and display text against 3:1. This establishes those rendered samples only. It does not certify all animation frames, viewport sizes, rendering engines or states.

Screenshots inspected locally:

- `test/scratch/taste/shots/390.png` and `1440.png`: first-screen hierarchy, reference crop, contrast and controls.
- `test/scratch/interactions/chromium-390-full.png` and `chromium-1440-full.png`: complete page flow, story/gallery, typography and footer.
- `test/scratch/interactions/chromium-watermap-390.png` and `test/scratch/review/watermap-1440.png`: vertical/horizontal Watermap layouts.
- `test/scratch/review/focus-primary-390.png`: visible keyboard focus on the primary action.

Scratch files are intentionally not submitted. The structured measurement results are retained; no screenshot or dump is included as a runtime asset. The final source-only ARIA correction did not change layout or colors; final production screenshots and both suites were regenerated after it.

## Completion and limitations

**Complete for the stated website scope.** The source and static export implement the reference and all three Watermap commitments, with build, typecheck, production interactions and six-domain review completed.

The browser connector returned `Transport closed`; rendered checks used the supplied Playwright runtime. WebKit could not launch, so Safari remains unverified. Native screen readers, physical devices, native browser zoom, localization and platform social-card rendering were not tested. No on-chain configuration, pool activity, trading, wallet connection, external-service uptime or financial outcome was verified. Hosting occurs after this assignment.

Design guidance: Jakub Krehel, Better Interface, MIT, revision `267330e1adfc66a718fb65fa6918c1f06d0a689e`. Documentation guidance: Paul Bakaus, Impeccable, Apache-2.0, revision `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8`. The pinned combined license is retained at `docs/design-reference-LICENSE.txt`.
