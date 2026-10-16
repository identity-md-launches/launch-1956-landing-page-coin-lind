# LinD design system

## Overview

LinD is a one-page introduction to a mermaid-inspired Solana coin. The supplied red-haired mermaid is the main visual reference, used directly in the hero and story. Deep turquoise water, coral accents and the existing seahorse mark carry the identity. The earlier blue mermaid gallery remains as an explorable, downloadable part of that world.

The primary task is opening LinD on LindyLaunch. Copying the full contract address and reading the Watermap are secondary tasks. The Watermap is an ordered explanation of future creator-fee use, without live pool status, dates, allocation percentages or a numerical liquidity threshold.

The source of truth is `src/styles.css`; composition and interactions are in `src/App.tsx`. Keep the existing React/TypeScript/Vite stack, local fonts and single dark ocean theme.

## Colors

Hex primitives and semantic aliases live at the top of `src/styles.css`. Components use semantic roles. The blue ramp supports surfaces and readable text; the coral ramp echoes the supplied mermaid's red hair. Gold remains in the illustration rather than becoming another UI accent.

| Semantic token | Value | Role |
| --- | --- | --- |
| `--color-page` | `#061f30` | Page and header background |
| `--color-surface` | `#0a2c3e` | Watermap, gallery, contract field and mobile menu |
| `--color-hover` | `#154258` | Secondary-control hover |
| `--color-border` | `#466f83` | Outlined controls and Watermap connectors |
| `--color-text` | `#f2f8fa` | Primary text |
| `--color-muted` | `#b0c7d2` | Body copy, supporting labels and captions |
| `--color-accent` | `#ffab99` | Italic display phrases, seahorse marks, links and step numbers |
| `--color-water` | `#8ee5f4` | Liquidity-pair names |
| `--color-action` | `#ff967f` | Primary button fill |
| `--color-action-hover` | `#ffb49f` | Primary button hover fill |
| `--color-on-action` | `#061f30` | Text on primary buttons |
| `--color-focus` | `#d5f6fa` | Keyboard focus outline |

Measured solid contrast: text/page 15.71:1; muted/page 9.58:1; muted/surface 8.28:1; accent/surface 8.00:1; action label/fill 7.96:1; focus/page 14.76:1. Image-backed text was measured separately; see `docs/validation.md` for sampling limits. Copy status uses text and an icon, not color alone.

## Typography

The existing local WOFF2 fonts are preserved. DM Sans supplies body/UI text at weights 400 and 600. Cormorant Garamond supplies normal and italic display text at weight 600. Only the contract address uses system monospace. All three local font faces loaded during browser validation. `font-synthesis: none` remains enabled.

| Token | Above 1100px | 721–1100px | Up to 720px | Use |
| --- | --- | --- | --- | --- |
| `--text-small` | 14px | 14px | 14px | Labels, navigation, contract and captions |
| `--text-body` | 16px | 16px | 16px | Prose and controls |
| `--text-lead` | 20px | 20px | 20px | Lead text and step headings |
| `--text-title` | 28px | 28px | 28px | Wordmark; mobile Watermap numbers |
| `--text-section` | 48px | 48px | 36px | Section headings; desktop Watermap numbers |
| `--text-hero` | 88px | 72px | 52px | Hero heading |

The probe measured six sizes, three families and two weights. Headings use -0.035em tracking and balanced wrapping; body text uses normal tracking. Heading line-height is 1.05, the mobile hero 1, step numbers 1.1, step headings 1.4 and prose 1.6–1.8. The hero description uses the 16px body step on mobile. Watermap prose is at most 38ch. The full contract wraps anywhere rather than clipping or shrinking.

## Layout

The established spacing tokens are 8, 16, 24, 32, 48, 64 and 96px. `.container` shares alignment edges and is capped at 1280px, with 64px side gutters on large screens, 40px up to 1100px, 20px up to 720px and 16px below 375px.

- The desktop header has the wordmark, section links and an external launch link. Up to 1100px the secondary header launch link is hidden to leave room for four section links. The primary hero action remains visible.
- Up to 720px, navigation becomes an inline disclosure under a 72px header. It expands in document flow, closes on section selection, and closes/restores toggle focus on Escape.
- The hero illustration occupies the right 65% on desktop. An ocean-colored horizontal gradient keeps copy readable. On mobile it fills the upper 480px and uses a vertical overlay; the copy starts 236px into the hero, or 204px below 375px.
- Hero minimum heights remain 780px desktop, 760px mobile and 820px below 375px. Text containers can grow. At 390 × 844, the heading is at y=308–412, the launch action at y=507–561 and the complete address at y=620–685.
- Watermap follows the hero. Its three ordered steps use equal columns with 48px gaps, 48px numbers and horizontal connector lines. At 720px and below, steps form a vertical list with 56px leading space, 28px numbers and vertical connector lines. The final step has no continuing line. No horizontal carousel or hidden step is used.
- Story, token guide and FAQ retain two-column desktop layouts and single-column mobile layouts. The story shows the complete square reference, with a maximum 400px width on mobile. It is static; only the hero and bubbles drift.
- The inherited gallery uses a 2.15:1 desktop crop and a square mobile crop. Its download provides the full original 1536 × 1024 file.
- The footer wraps. All navigation uses hashes; anchors have 2rem scroll margin. There is no sticky header or fixed action bar.

Validated widths: 320, 390, 720, 768, 1024 and 1440 CSS pixels. Root text enlargement to 200% and increased text spacing also preserve horizontal reflow at 390px. Native zoom and physical devices remain unverified.

## Elevation & Depth

The interface uses tonal surfaces and no box shadows. The Watermap connector lines express sequence, while borders separate FAQ/guide rows and the footer. Hero image overlays provide text contrast; the story and gallery images have a 1px white outline at 10% opacity.

The header is in flow at z-index 5. The hero isolates its negative-z-index artwork. Decorative image/bubble layers do not capture pointer input. The focused skip link sits above the page at z-index 20.

## Shapes

Controls use an 8px radius; images use 16px. Small utility controls use 4px corners. Bubbles are circular. The Watermap is a flat ordered list, with no nested cards or clickable-looking static badges. Numbers and connectors are decorative; semantic ordering comes from `ol`/`li`.

## Components

| Pattern | Source | Behavior |
| --- | --- | --- |
| `LaunchLink` | `src/App.tsx` | Filled primary link; optional outline variant. Uses the exact config URL, external icon and new-tab accessible name. |
| `ContractAddress` | `src/App.tsx` | Full selectable address, 44px copy button, stable polite status region. Actual success shows a check and clears after 3.5 seconds; failure selects the address and keeps recovery text visible. |
| `Header` | `src/App.tsx` | Shared desktop/mobile navigation, including Watermap; native links and an `aria-expanded` menu toggle. |
| `Watermap` | `src/App.tsx` | Three future-tense commitments; creator fees into both pairs, Meteora autocompounding, then new launches once sufficiently liquid. Pair text has no redundant ARIA label. |
| `useOceanMotion` | `src/App.tsx` | Pause/resume controls the hero and 12 bubbles. OS reduced motion removes animations and labels the disabled button “Motion reduced.” |
| `.button`, `.text-link` | `src/styles.css` | 54px main action, 44px utility targets, hover gated by pointer capability, 150ms named transitions and 0.96 press scale only when motion is allowed. |
| FAQ | `src/App.tsx` | Native `details`/`summary`; Enter/Space disclosure. Includes a Watermap answer and section link. |
| `Icon`, `Seahorse` | `src/Icons.tsx` | Existing inline SVGs use `currentColor`; decorative icons are hidden from assistive technology. |

Controls have a 2px focus outline with a 5px offset. Forced-colors CSS retains system-color outlines and control borders. The 390px probe found no controls below the comfortable 44px size. Keyboard focus was visually inspected on the primary action.

## Do’s and don’ts

- Reuse `.container`, semantic color tokens and the six-step type scale.
- Keep one filled primary action per section; use text or outline styles for peers.
- Preserve the exact address and external destinations in `src/config.ts`.
- Keep the reference artwork intact; use CSS cropping for the hero and show the complete image in the story.
- Keep Watermap claims prospective until the project supplies verified operational updates. Do not invent percentages, deadlines, pool addresses or a liquidity threshold.
- Keep runtime assets local, section navigation as hashes and the contract fully selectable.
- Add a section with one `h2`, existing paragraph styles and normal document flow; test at 320/390/1440 and with enlarged text before documenting it.

Design review follows the pinned Better Interface guidance by Jakub Krehel (MIT); this documentation structure follows Paul Bakaus’s Impeccable (Apache-2.0). Source revisions and license notices are recorded in `docs/validation.md` and `docs/design-reference-LICENSE.txt`.
