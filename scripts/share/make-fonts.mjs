// Downloads the decks' Google Fonts (the same URL the page used to link) and writes them inline as
// scripts/share/fonts-inline.css, so single-file decks render with the right type offline.
// Only the latin and latin-ext subsets are kept: the decks are English. Re-run if the font URL changes.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const URL_CSS = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Instrument+Serif:ital@0;1&display=swap";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const css = await (await fetch(URL_CSS, { headers: { "User-Agent": UA } })).text();
const blocks = [...css.matchAll(/\/\* ([\w-]+) \*\/\s*(@font-face \{[^}]+\})/g)].filter(([, subset]) => subset === "latin" || subset === "latin-ext");
if (!blocks.length) throw new Error("No @font-face blocks found; Google Fonts response changed.");
let out = "";
for (const [, subset, block] of blocks) {
  const url = block.match(/url\((https:[^)]+)\)/)[1];
  const data = Buffer.from(await (await fetch(url)).arrayBuffer()).toString("base64");
  out += `/* ${subset} */\n${block.replace(url, `data:font/woff2;base64,${data}`)}\n`;
}
const file = join(dirname(fileURLToPath(import.meta.url)), "fonts-inline.css");
writeFileSync(file, out);
console.log(`Wrote ${file}: ${blocks.length} faces, ${(out.length / 1024).toFixed(0)} KB`);
