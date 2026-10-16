# LinD design system

## Overview

LinD is a one-page introduction to a mermaid-inspired Solana coin. The visual idea is an illustrated blue underwater world: six swimming mermaids in the hero and a separate mermaid with a curled seahorse tail in the story. Spacious, flat sections let the artwork carry the identity. The primary task is opening the supplied token page; copying its address is the secondary utility.

The canonical implementation is `src/styles.css`, with page composition and component patterns in `src/App.tsx`. This is a single dark ocean theme, not a light/dark theme switcher. It contains no wallet connection, price feed or transaction interface.

## Colors

Hex primitives and semantic aliases are defined at `src/styles.css:23`. Components use role tokens; image overlays use alpha versions of the page color.

| Role token | Value | Use |
| --- | --- | --- |
| `--color-page` | `#061c36` | Main ocean background |
| `--color-surface` | `#092844` | Contract field, mobile navigation, gallery section |
| `--color-hover` | `#133c58` | Secondary-control hover |
| `--color-border` | `#426681` | Outlined controls and scroll decoration |
| `--color-text` | `#f0f7fa` | Headings and primary text |
| `--color-muted` | `#a4bfd2` | Body copy, captions and supporting labels |
| `--color-accent` | `#b4e9f7` | Italic heading phrases, seahorse marks and selected icon states |
| `--color-action` | `#b4e9f7` | Primary action fill |
| `--color-action-hover` | `#daf4fa` | Primary action hover fill |
| `--color-on-action` | `#061c36` | Text on primary actions |
| `--color-focus` | `#daf4fa` | Keyboard focus outline |

These semantic aliases share values intentionally without sharing their roles. Copy success uses both a check icon and text; failure uses persistent explanatory text rather than a new status color.

Calculated solid-pair contrast: primary text/page 15.80:1; muted text/page 8.93:1; muted text/surface 7.84:1; primary-action label/fill 12.99:1; focus/page 14.91:1. Rendered image-backed contrast and its sampling limitations are recorded in `artifacts/validation.md`.

## Typography

Fonts are local WOFF2 files in `public/fonts/`, with their licenses beside them. DM Sans supplies real variable weights 400 and 600; Cormorant Garamond supplies normal 600 and italic 600. Browser inspection confirmed that all three local faces loaded. `font-synthesis: none` avoids synthetic variants.

| Token | Desktop | Up to 1100px | Up to 720px | Role |
| --- | --- | --- | --- | --- |
| `--text-small` | 14px | 14px | 14px | Navigation, captions, contract and utility text |
| `--text-body` | 16px | 16px | 16px | Prose and buttons |
| `--text-lead` | 20px | 20px | 20px | Lead prose and step headings |
| `--text-title` | 28px | 28px | 28px | Wordmark and decorative stars |
| `--text-section` | 48px | 48px | 36px | Section headings |
| `--text-hero` | 88px | 72px | 52px | Main heading |

The hero description uses 20px on desktop and the existing 16px body step on mobile. No seventh type size is introduced. Display typography uses `Cormorant Garamond, Georgia, serif`; prose uses `DM Sans, sans-serif`; only the contract uses the system monospace stack.

Headings use 600 weight, 1.05 line-height (mobile hero 1), balanced wrapping and -0.035em tracking. Body copy uses 400 weight, normal tracking and 1.6–1.8 line-height. Controls use 600. Text remains selectable. The contract wraps with `overflow-wrap: anywhere`, without ellipsis or hidden characters. Long prose measures are constrained by the layout columns; the hero description is at most 390px, or 300px on mobile.

## Layout

`--space-1` through `--space-7` are 8, 16, 24, 32, 48, 64 and 96px. Section-specific optical spacing includes 40px heading gaps, 56px intermediate column gaps and 100px desktop column gaps. `.container` is the shared alignment primitive: at most 1280px, with 64px side gutters on large screens, 40px at widths up to 1100px, 20px up to 720px and 16px below 375px.

- Above 720px, the header has a left wordmark, central section navigation and right launch link. The story, token guide and FAQ use two columns.
- At 720px and below, the header becomes a 72px row with wordmark and menu. Navigation expands in normal flow, never over the hero. The duplicate header launch link is hidden; the hero keeps the primary action.
- The mobile hero shows the mermaids above the copy. A stronger vertical ocean overlay preserves text contrast. At 390 × 844, the heading occupies y=308–412, the primary action y=507–561, and the full contract y=620–685.
- The hero uses a 780px minimum height on desktop, 760px on mobile and 820px below 375px. Content can grow beyond these minimums. At the narrowest breakpoint, hero actions stack.
- The story image sits in a 580px frame, 520px at intermediate widths and 420px on mobile. Clipping is confined to this decorative image frame so its orbit lines cannot widen the page.
- The gallery image changes from a wide 2.15:1 crop to a square mobile crop. Downloading saves the complete 1536 × 1024 artwork.
- The guide and FAQ become single columns, and the footer wraps. Anchors have scroll margin. There is no sticky header or fixed CTA.

Verified layouts: 320, 390, 720, 768, 1024 and 1440 CSS pixels. Also verified 200% root text enlargement and increased text spacing at 390px; this does not certify native browser zoom or physical devices.

## Elevation & Depth

The UI has no box shadows. Tonal background changes separate sections; thin lines structure the guide, FAQ and footer. The artwork creates depth. The hero uses a noninteractive image/gradient layer behind its text; the mobile gradient reaches 70% page-color opacity at 204px into the hero. The gallery has a 1px white outline at 10% opacity.

The header is in normal flow at z-index 5. The hero isolates its negative-z-index art layer. The keyboard skip link sits above the page at z-index 20. No modal system is implemented.

## Shapes

`--radius-control` is 8px; `--radius-image` is 16px. Icon utilities use 4px corners. Bubbles and decorative orbits are circular. These shapes support the underwater theme without adding a card grid. No content cards are nested inside other cards.

## Components

- **`LaunchLink` (`src/App.tsx:11`)**: internal reusable link pattern. Uses the exact URL from `src/config.ts`, an external-link icon, `noopener noreferrer`, and an accessible new-tab label. The default is filled; the `secondary` prop provides the outline treatment. `children` supplies the label.
- **`ContractAddress` (`src/App.tsx:33`)**: full selectable address, 44px copy control and a stable polite status region. Successful copying shows a check and confirmation for 3.5 seconds. Clipboard denial keeps manual-copy guidance visible and selects the complete address. Retry remains enabled. No asynchronous state implies a copy succeeded before it actually did.
- **`Header` (`src/App.tsx:102`)**: desktop links and a mobile disclosure controlled by `aria-expanded`/`aria-controls`. Escape closes it and returns focus to the toggle. Selecting a section or resizing to desktop closes it. This is an inline navigation disclosure, not a dialog.
- **`useOceanMotion` (`src/App.tsx:183`)**: controls the hero drift, mermaid float and bubbles. A visible pause/resume button controls all of them. Under the OS reduced-motion preference, all animations are absent and the disabled control says “Motion reduced.” Preference changes are observed while the page is open.
- **`.button` / `.text-link`**: 54px primary action and 44px utility-link patterns. Hover changes are gated by pointer capability. Press scales to 0.96 only when motion is permitted. Transitions name their properties and last 150ms.
- **Gallery/download**: native local download link; no backend, form or signup. The full asset is included in the export.
- **FAQ**: native `details`/`summary`; Enter and Space operate it. The plus rotates into a close mark while open. Answers stay in document flow.
- **`Icon` and `Seahorse` (`src/Icons.tsx`)**: original inline SVG components using `currentColor`; decorative icons are hidden from assistive technology.

All interactive controls use a visible 2px focus outline with a 5px offset. Forced-colors mode preserves a system-color outline and explicit control borders. Touch targets are at least 44px in the final measured 390px layout.

## Do’s and don’ts

- Start new sections with `.container` and the existing heading/body scale. Keep semantic heading levels in order.
- Use one filled primary action per section; use outline or text links for secondary actions.
- Preserve the exact contract constant and full visible value. Keep all token links derived from that constant.
- Bundle required assets locally and keep navigation as hashes for static subpath hosting.
- Extend existing semantic color tokens rather than assigning a border color to text or adding unrelated accent hues.
- Keep motion optional, and keep controls operable when motion or the clipboard is unavailable.
- Do not add live market claims, social accounts, token economics or wallet controls without a separate product requirement and verified inputs.

For an additional content section, reuse the existing container and two-column pattern, add one `h2`, use a real anchor or button for its action, and collapse it at the existing content breakpoint. Review its narrow layout and keyboard path before changing this design document.
