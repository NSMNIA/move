import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { minify } from 'html-minifier-terser';

const popupDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(popupDir, '../..');
const outDir = path.join(repoRoot, 'output');

fs.mkdirSync(outDir, { recursive: true });

const htmlPath = path.join(popupDir, 'popup.html');
const outPath = path.join(outDir, 'popup.html');

const html = fs.readFileSync(htmlPath, 'utf-8');

const minified = await minify(html, {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  minifyCSS: true,
  minifyJS: true,
});

fs.writeFileSync(outPath, minified);