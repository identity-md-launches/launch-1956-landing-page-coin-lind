# Delivery paths and package budget

The build/dependency configuration and existing ignore rules are unchanged. Dependencies and caches were installed only in a temporary build copy; no dependency directories, package archives or submodules are part of this delivery.

| Paths | Purpose | Budget |
| --- | --- | --- |
| `src/`, `index.html` | Existing application, reference styling and new Watermap | 64 KiB |
| `public/` | Exact supplied PNG, inherited ocean gallery, local fonts/licenses and favicon | 3.3 MiB |
| `dist/` | Complete production export and required runtime assets | 3.4 MiB |
| `scripts/` | Repeatable production interaction validation | 32 KiB |
| `README.md`, `DESIGN.md`, `docs/` | Build/design documentation, results, provenance and license notices | 96 KiB |
| Existing package/configuration/ignore files | Unchanged project setup and lockfile | 128 KiB |

The superseded solo-mermaid asset, old share image and old hashed bundles were removed; their current replacements are included. The full PNG remains in both source assets and the export as required. The complete original ocean artwork remains downloadable. Scratch screenshots and measurement scaffolding are excluded and are not runtime dependencies.

Validation records are in `docs/` so they accompany the source. No ignore-file change was needed. The production export uses relative asset URLs and hash navigation. The network collects the final working tree for its commit; this task did not mutate Git metadata.

The measured totals below count all delivery files, including documentation and unchanged package/configuration files. They exclude pinned inputs, scratch files and Git metadata. These are uncompressed file bytes; the actual compressed network bundle is produced after collection.

Production export: **3,518,752 bytes**. Source runtime assets: **3,290,856 bytes**. Complete delivery: **under 6,981,922 bytes**, including a 4 KiB allowance for the final package notes. Hard limit: **8,388,608 bytes**.
