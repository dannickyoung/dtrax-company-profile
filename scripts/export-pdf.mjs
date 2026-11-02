// Prints a deck's /print page to a PDF with headless Chrome.
// Usage: node scripts/export-pdf.mjs [url] [output]
// Default url is the local preview server (npm run preview).
// Chrome can stay alive after writing the PDF (the decks' looping animations keep it busy),
// so we stop it once the file has been written and stopped growing, with a hard time limit.
import { spawn } from "node:child_process";
import { existsSync, rmSync, statSync } from "node:fs";
import { resolve } from "node:path";

const url = process.argv[2] ?? "http://127.0.0.1:3010/present/dtrax-company-profile/print/";
const output = resolve(process.argv[3] ?? "public/dtrax-company-profile-2026.pdf");
const chrome = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const LIMIT_MS = 900_000;

rmSync(output, { force: true });
const child = spawn(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=20000",
  `--print-to-pdf=${output}`,
  url,
], { stdio: "ignore" });

const started = Date.now();
let lastSize = -1;
let exited = false;
child.on("exit", () => { exited = true; });

while (true) {
  await new Promise((done) => setTimeout(done, 1000));
  const size = existsSync(output) ? statSync(output).size : 0;
  if (size > 0 && (exited || size === lastSize)) break;
  if (exited) { console.error("Chrome exited without writing the PDF."); process.exit(1); }
  if (Date.now() - started > LIMIT_MS) { child.kill("SIGKILL"); console.error("Timed out waiting for the PDF."); process.exit(1); }
  lastSize = size;
}
if (!exited) child.kill("SIGKILL");
console.log(`Wrote ${output} (${(statSync(output).size / 1e6).toFixed(1)} MB)`);
