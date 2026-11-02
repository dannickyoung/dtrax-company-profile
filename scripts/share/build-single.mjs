// Builds a deck as ONE self-contained .html file (JS + CSS inline, media as data URIs) for hosts that serve a
// single file from an opaque/sandboxed origin, e.g. the website's Admin → Decks. Google Fonts stay external.
// Usage: node scripts/share/build-single.mjs <dtrax|bd|handbook> [output.html]
//
// Size matters (the file is downloaded whole before slide 1 can show), so:
// - Only the media THIS deck can show is inlined. Every asset() call lives in a module-level data table, so the
//   bundle is tree-shaken (asset() and its path helpers marked pure, dropping tables the deck never uses), then
//   evaluated once in a stub VM with asset() logging its argument: that log is the exact set of paths, including
//   ones assembled from templates (`/assets/projects/${folder}/${i}.jpg`).
// - Images are re-encoded as WebP (alpha kept), sized to the largest box they are drawn in on the 1920×1080 stage.
//   Those sizes come from single-sizes.json (path → long edge in px, measured with a full click-through); images
//   not listed there get DEFAULT_EDGE. Nothing is upscaled. Videos are inlined as-is.
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const DECKS = {
  dtrax: { file: "dtrax-company-profile-2026.html", title: "D'trax Company Profile 2026", description: "D'trax Design company profile deck, 2026." },
  bd: { file: "dtrax-bd-deck-2026.html", title: "D'trax BD Deck 2026", description: "D'trax Design business development deck, 2026." },
  handbook: { file: "dtrax-employee-handbook-2026.html", title: "D'trax Employee Handbook 2026", description: "D'trax Design employee handbook, 2026." },
};
const deck = process.argv[2] ?? "dtrax";
if (!DECKS[deck]) throw new Error(`Unknown deck "${deck}". Use one of: ${Object.keys(DECKS).join(", ")}`);
const out = resolve(process.argv[3] ?? join(root, "share-out", "single", DECKS[deck].file));
const MAX_EDGE = 1920;
const DEFAULT_EDGE = 1400; // referenced but never drawn in the click-through (e.g. unused table entries)
const QUALITY = 76;
const sizesFile = join(here, "single-sizes.json");
const SIZES = existsSync(sizesFile) ? JSON.parse(readFileSync(sizesFile, "utf8")) : {};

// Helpers that only wrap asset() (e.g. `const photos = (folder, files) => files.map(...asset(...))`) must be pure
// too, or esbuild keeps every table built with them. Found by name, repeated until no new wrapper turns up.
// (esbuild's --pure flag only matches global names, so the calls get /* @__PURE__ */ comments in a copy of src/.)
const walk = (dir) => readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)]));
const deckFiles = walk(join(root, "src", "decks")).filter((f) => /\.tsx?$/.test(f));
const sources = deckFiles.map((f) => readFileSync(f, "utf8"));
const pure = new Set(["asset"]);
for (let grew = true; grew; ) {
  grew = false;
  for (const src of sources)
    for (const [, name, body] of src.matchAll(/const (\w+) = \([^)]*\)(?:: [^=]+)? =>([^\n]*)/g))
      if (!pure.has(name) && [...pure].some((p) => new RegExp(`\\b${p}\\(`).test(body))) { pure.add(name); grew = true; }
}

const tmp = mkdtempSync(join(tmpdir(), "deck-single-"));
// Annotated copy of src/, inside the repo (share-out/ is gitignored) so bare imports still resolve to node_modules.
const src = join(root, "share-out", ".single-src", deck);
rmSync(src, { recursive: true, force: true });
cpSync(join(root, "src"), src, { recursive: true });
const callRe = new RegExp(`(?<![\\w.])(${[...pure].join("|")})\\(`, "g");
for (const f of deckFiles) {
  const code = readFileSync(f, "utf8");
  if (/from "@\/lib\/base-path"/.test(code)) writeFileSync(join(src, f.slice(join(root, "src").length)), code.split("\n").map((line) => (/^\s*(\*|\/\/|\/\*)/.test(line) ? line : line.replace(callRe, "/* @__PURE__ */ $1("))).join("\n")); // comment lines untouched
}
const shim = join(tmp, "base-path.ts");
writeFileSync(shim, `const g = globalThis as any;
const map: Record<string, string> = g.__DECK_ASSETS__ ?? {};
export const BASE = "";
export const asset = (path: string) => {
  g.__DECK_ASSET_LOG__?.add(path);
  if (map[path]) return map[path];
  if (!g.__DECK_ASSET_LOG__) console.warn("[deck] asset not inlined:", path);
  return path;
};
`);

try {
  execFileSync("npx", [
    "--yes", "esbuild@0.24.0", join(here, `entry-${deck}.tsx`),
    "--bundle", "--minify", "--format=iife", "--jsx=automatic", "--target=es2020",
    "--log-level=error",
    `--alias:@/lib/base-path=${shim}`,
    `--alias:@=${src}`,
    `--alias:next/font/google=${join(here, "next-font-google.ts")}`,
    "--define:process.env.NODE_ENV=\"production\"",
    `--outfile=${join(tmp, "deck.js")}`,
  ], { stdio: "inherit", cwd: root });
  const js = readFileSync(join(tmp, "deck.js"), "utf8");
  if (js.includes("NEXT_PUBLIC_BASE_PATH")) throw new Error("base-path shim was not applied");

  // Evaluate the bundle against stubs to collect every asset() path. Rendering fails without a real DOM, but by
  // then every module-level table (and the entry's render props) has been evaluated.
  const log = new Set();
  const noop = () => {};
  const el = { nodeType: 1, addEventListener: noop, removeEventListener: noop, setAttribute: noop, style: {}, childNodes: [] };
  const sandbox = { __DECK_ASSET_LOG__: log, console: { ...console, warn: noop, error: noop }, setTimeout: noop, clearTimeout: noop, queueMicrotask: noop, navigator: { userAgent: "node" } };
  sandbox.document = { getElementById: () => el, createElement: () => ({ ...el }), addEventListener: noop, documentElement: el, body: el };
  el.ownerDocument = sandbox.document;
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  try { vm.runInNewContext(js, sandbox, { timeout: 10000 }); } catch (e) { if (process.env.DEBUG_SINGLE) console.error(String(e).slice(0, 300)); }
  if (!log.size) throw new Error("asset() was never called while evaluating the bundle");
  // The entry's own asset() calls (e.g. the BD intro video) run last, inside render(...); make sure we got that far.
  for (const [, path] of readFileSync(join(here, `entry-${deck}.tsx`), "utf8").matchAll(/asset\("([^"]+)"\)/g))
    if (!log.has(path)) throw new Error(`Evaluation stopped before the entry's asset("${path}") ran`);

  const media = [...log].sort().map((path) => ({ path, file: join(root, "public", path) }));
  const missing = media.filter((m) => !existsSync(m.file));
  if (missing.length) throw new Error(`Missing files: ${missing.map((m) => m.path).join(", ")}`);

  const cssPath = join(here, "deck.css");
  const css = (await postcss([tailwind()]).process(readFileSync(cssPath, "utf8"), { from: cssPath })).css;

  const MIME = { ".gif": "image/gif", ".svg": "image/svg+xml", ".mp4": "video/mp4", ".webm": "video/webm" };
  const map = {};
  let raw = 0, packed = 0, images = 0;
  for (const { path, file } of media) {
    const ext = extname(file).toLowerCase();
    const original = readFileSync(file);
    let buf = original, mime = MIME[ext];
    if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      images++;
      const img = sharp(original, { failOn: "none" }).rotate();
      const { width = 0, height = 0, hasAlpha } = await img.metadata();
      const edge = Math.min(MAX_EDGE, SIZES[path] ?? DEFAULT_EDGE);
      const sized = () => (Math.max(width, height) > edge ? img.clone().resize({ width: edge, height: edge, fit: "inside" }) : img.clone());
      buf = await sized().webp({ quality: QUALITY, alphaQuality: 90, effort: 6 }).toBuffer();
      // Flat graphics with alpha (logos, QR codes, signatures) often come out smaller AND sharper lossless.
      if (hasAlpha || ext === ".png") {
        const lossless = await sized().webp({ lossless: true, effort: 6 }).toBuffer();
        if (lossless.length <= buf.length * 1.25) buf = lossless;
      }
      mime = "image/webp";
    }
    if (!mime) throw new Error(`No MIME type for ${path}`);
    raw += original.length;
    packed += buf.length;
    map[path] = `data:${mime};base64,${buf.toString("base64")}`;
  }

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(DECKS[deck].title)}</title>
<meta name="description" content="${esc(DECKS[deck].description)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Instrument+Serif:ital@0;1&display=swap">
<style>${css.replace(/<\/style/gi, "<\\/style")}</style>
</head>
<body>
<div id="deck"></div>
<script>window.__DECK_ASSETS__=${JSON.stringify(map).replace(/</g, "\\u003c")};</script>
<script>${js.replace(/<\/script/gi, "<\\/script")}</script>
</body>
</html>
`;
  execFileSync("mkdir", ["-p", dirname(out)]);
  writeFileSync(out, html);
  writeFileSync(out.replace(/\.html$/, ".assets.json"), JSON.stringify([...log].sort(), null, 1));
  const mb = (n) => (n / 1024 / 1024).toFixed(2) + " MB";
  console.log(`Built ${out}: ${mb(Buffer.byteLength(html))} (${images} images + ${media.length - images} other, ${mb(raw)} → ${mb(packed)} before base64; pure: ${[...pure].join(", ")})`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
  rmSync(src, { recursive: true, force: true });
}
process.exit(0); // nothing async is left that matters; don't let anything the VM scheduled keep node alive
