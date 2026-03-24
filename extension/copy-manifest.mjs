import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const extRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(extRoot, '..');
const outDir = path.join(repoRoot, 'output');

fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(
  path.join(extRoot, 'manifest.json'),
  path.join(outDir, 'manifest.json'),
);

const iconsSrc = path.join(extRoot, 'icons');
const iconsDest = path.join(outDir, 'icons');
if (fs.existsSync(iconsSrc)) {
  fs.mkdirSync(iconsDest, { recursive: true });
  for (const name of fs.readdirSync(iconsSrc)) {
    fs.copyFileSync(path.join(iconsSrc, name), path.join(iconsDest, name));
  }
}
