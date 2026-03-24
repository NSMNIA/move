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
