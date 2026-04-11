import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());
const srcRoot = path.join(projectRoot, 'src');

function isCodeFile(filePath) {
  return (
    filePath.endsWith('.ts') ||
    filePath.endsWith('.tsx') ||
    filePath.endsWith('.js') ||
    filePath.endsWith('.jsx')
  );
}

function walk(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (
      e.name === 'node_modules' ||
      e.name === 'dist' ||
      e.name.startsWith('.umi') ||
      e.name === '.umi-production' ||
      e.name === '.umi-test' ||
      e.name === '.umi-test-production'
    ) {
      continue;
    }
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function extractImports(code) {
  const imports = new Set();
  const re = /(?:import\s+(?:[^'"]*?\s+from\s+)?|require\()\s*['"]([^'"]+)['"]\s*\)?/g;
  for (;;) {
    const m = re.exec(code);
    if (!m) break;
    imports.add(m[1]);
  }
  return [...imports];
}

function resolveImport(fromFile, spec) {
  if (spec.startsWith('@/')) {
    const rel = spec.slice(2);
    return path.join(srcRoot, rel);
  }
  if (spec.startsWith('./') || spec.startsWith('../')) {
    return path.resolve(path.dirname(fromFile), spec);
  }
  return null;
}

function resolveWithExt(p) {
  const candidates = [
    p,
    `${p}.ts`,
    `${p}.tsx`,
    `${p}.js`,
    `${p}.jsx`,
    path.join(p, 'index.ts'),
    path.join(p, 'index.tsx'),
    path.join(p, 'index.js'),
    path.join(p, 'index.jsx'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

const allFiles = walk(srcRoot).filter(isCodeFile);
const entryFiles = allFiles.filter((f) => f.includes(`${path.sep}pages${path.sep}`));
entryFiles.push(path.join(srcRoot, 'app.tsx'));
entryFiles.push(path.join(srcRoot, 'requestErrorConfig.ts'));

const queue = [...new Set(entryFiles)].filter((f) => fs.existsSync(f));
const used = new Set(queue.map((f) => path.normalize(f)));

while (queue.length) {
  const cur = queue.shift();
  const code = readFileSafe(cur);
  for (const spec of extractImports(code)) {
    const base = resolveImport(cur, spec);
    if (!base) continue;
    const resolved = resolveWithExt(base);
    if (!resolved) continue;
    const norm = path.normalize(resolved);
    if (used.has(norm)) continue;
    used.add(norm);
    queue.push(norm);
  }
}

const unusedCandidates = allFiles
  .map((f) => path.normalize(f))
  .filter((f) => !used.has(f))
  .filter((f) => !f.includes(`${path.sep}locales${path.sep}`))
  .filter((f) => !f.includes(`${path.sep}assets${path.sep}`))
  .filter((f) => !f.includes(`${path.sep}.umi`));

const alwaysKeep = new Set(
  [
    'src/access.ts',
    'src/global.tsx',
    'src/global.style.ts',
    'src/loading.tsx',
    'src/service-worker.js',
    'src/typings.d.ts',
    'src/services/ant-design-pro/typings.d.ts',
  ].map((p) => path.normalize(path.join(projectRoot, p))),
);

const filteredUnused = unusedCandidates.filter((f) => !alwaysKeep.has(f));

const report = {
  generatedAt: new Date().toISOString(),
  srcRoot,
  totalFiles: allFiles.length,
  usedFiles: used.size,
  unusedCandidatesCount: filteredUnused.length,
  unusedCandidates: filteredUnused.map((f) => path.relative(projectRoot, f)),
};

const outPath = path.join(projectRoot, 'unused-files-report.json');
fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');
console.log(outPath);
