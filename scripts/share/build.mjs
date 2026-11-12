// Builds the deck as a standalone page (index.html + deck.js + deck.css + assets/)
// for sharing outside the Next.js site, e.g. as a claude.ai link.
// Usage: node scripts/share/build.mjs <dtrax|bd|bd-johnathan|handbook> <output-dir>
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const DECKS = {
  dtrax: { title: "D'trax Company Profile 2026", description: "D'trax Design company profile deck, 2026." },
  bd: { title: "D'trax BD Deck 2026", description: "D'trax Design business development deck, 2026." },
  "bd-johnathan": { title: "D'trax BD Deck 2026 · Johnathan Ng", description: "D'trax Design business development deck, 2026." },
  handbook: { title: "D'trax Employee Handbook", description: "D'trax Design employee handbook." },
};
const deck = process.argv[2] ?? "dtrax";
if (!DECKS[deck]) throw new Error(`Unknown deck "${deck}". Use one of: ${Object.keys(DECKS).join(", ")}`);
const out = resolve(process.argv[3] ?? join(root, "share-out", deck));
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

execFileSync("npx", [
  "--yes", "esbuild@0.24.0", join(here, `entry-${deck}.tsx`),
  "--bundle", "--minify", "--format=iife", "--jsx=automatic", "--target=es2020",
  "--log-level=error",
  `--alias:@=${join(root, "src")}`,
  `--alias:next/font/google=${join(here, "next-font-google.ts")}`,
  "--define:process.env.NODE_ENV=\"production\"",
  "--define:process.env.NEXT_PUBLIC_BASE_PATH=\".\"",
  `--outfile=${join(out, "deck.js")}`,
], { stdio: "inherit", cwd: root });

const cssPath = join(here, "deck.css");
const css = await postcss([tailwind()]).process(readFileSync(cssPath, "utf8"), { from: cssPath });
writeFileSync(join(out, "deck.css"), css.css);

for (const dir of ["assets", "logo"]) cpSync(join(root, "public", dir), join(out, dir), { recursive: true });

writeFileSync(join(out, "index.html"), `<title>${DECKS[deck].title}</title>
<meta name="description" content="${DECKS[deck].description}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Instrument+Serif:ital@0;1&display=swap">
<link rel="stylesheet" href="deck.css">
<div id="deck"></div>
<script src="deck.js"></script>
`);
console.log(`Built ${out}`);
