# Asset provenance

| Asset | Source and treatment |
| --- | --- |
| `public/art/mermaid-reference.png` | Supplied by the requester via the Discord attachment below. Downloaded successfully and copied byte-for-byte; 1254 × 1254 PNG, 2,880,142 bytes. Used by the hero, full-image story and social metadata. CSS crops the hero; the file is unchanged. |
| `public/art/ocean.webp` | Inherited from the existing project. Preserved unchanged as the 1536 × 1024 blue-mermaid gallery and full artwork download. No new generation was performed. |
| `public/favicon.svg` | Existing seahorse geometry retained; colors updated to the implemented ocean/coral tokens. |
| `src/Icons.tsx` | Existing inline SVG icon and seahorse components retained unchanged. |
| `public/fonts/*.woff2` | Existing local DM Sans and Cormorant Garamond faces retained unchanged. Licenses remain in `public/fonts/DM-Sans-LICENSE.txt` and `public/fonts/Cormorant-Garamond-LICENSE.txt`, also copied to the export. |

The prior solo-mermaid WebP and share JPEG were superseded by the supplied PNG and removed from source/public and export. The prior ocean gallery remains. The obsolete hashed JS/CSS bundles were replaced by the current production build. No original full-resolution reference dump, dependency archive or unused artwork is required at runtime.

Reference: [requester’s mermaid attachment](https://cdn.discordapp.com/attachments/1510629984354439249/1560588107253030912/a7615ba7-2a3c-4954-8fc4-c8903ae852fd.png?ex=6ad3426f&is=6ad1f0ef&hm=26051c1d1e11b10e9035b7de105e358d1cd2297d6bd7c4b21148d39caf39558b).

Supplied/local/exported PNG SHA-256: `411896b8841c9df1bcded9ad5657d21427e826100d839fc7032a32eca804d262`.

All runtime assets are bundled locally and referenced relatively in `dist/`; the published page does not depend on Discord availability.
