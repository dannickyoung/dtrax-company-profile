# D'trax · Company Profile

Static Next.js deck. `npm install`, then `npm run preview` and open `/present/dtrax-company-profile/`.

- Presenter: arrow keys, space or click. Slides with click reveals (the delivery approach) step through them first.
- PDF: `/present/dtrax-company-profile/print/` shows every slide fully revealed, one per 1920 × 1080 page. With the preview server running, `npm run export-pdf` writes `public/dtrax-company-profile-2026.pdf`. Re-export after any content change.

Not hosted on GitHub Pages. Production is the website's Admin → Decks page: build each deck with `node scripts/share/build-single.mjs <dtrax|bd|bd-johnathan|handbook>` and upload the `.html` (and its `.pdf`) from `share-out/single/` and `public/` to the Supabase `decks` bucket.
