// Packs the built library, installs the tarball into a throwaway consumer, and
// loads every `exports` entry point with both `require` and `import`.
// Expects `dist/` to be built already: `npm run test:package` does both.

import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));

const specifiers = Object.keys(pkg.exports).map((key) =>
  key === '.' ? pkg.name : `${pkg.name}${key.slice(1)}`,
);

// The optional Mux peer is installed because the root and `/video-player`
// entry points load it unconditionally.
const peers = ['react', 'react-dom', '@mux/mux-player-react'].map(
  (name) => `${name}@${pkg.devDependencies[name]}`,
);

/**
 * Runs a command and returns its trimmed stdout, throwing if it exits non-zero.
 */
const run = (command, args, cwd) =>
  execFileSync(command, args, { cwd, encoding: 'utf8', shell: process.platform === 'win32' }).trim();

/**
 * Loads `specifier` in a fresh Node process from `cwd`, returning the error's
 * first line, or `null` when it loads.
 */
const load = (cwd, specifier, mode) => {
  const file = join(cwd, mode === 'require' ? 'load.cjs' : 'load.mjs');
  writeFileSync(
    file,
    mode === 'require' ? `require(${JSON.stringify(specifier)});\n` : `await import(${JSON.stringify(specifier)});\n`,
  );
  const result = spawnSync(process.execPath, [file], { cwd, encoding: 'utf8' });
  return result.status === 0 ? null : (result.stderr.match(/^\w*Error.*$/m)?.[0] ?? result.stderr.trim());
};

const workDir = mkdtempSync(join(tmpdir(), 'react-datocms-package-'));

try {
  const tarball = join(workDir, run('npm', ['pack', '--ignore-scripts', '--silent', '--pack-destination', workDir]));

  const consumerDir = join(workDir, 'consumer');
  mkdirSync(consumerDir);
  writeFileSync(join(consumerDir, 'package.json'), JSON.stringify({ name: 'consumer', private: true }));
  run('npm', ['install', '--silent', '--no-audit', '--no-fund', tarball, ...peers], consumerDir);

  const failures = specifiers.flatMap((specifier) =>
    ['require', 'import'].flatMap((mode) => {
      const error = load(consumerDir, specifier, mode);
      console.log(`${error ? 'FAIL' : 'ok  '} ${mode} ${specifier}${error ? `: ${error}` : ''}`);
      return error ? [specifier] : [];
    }),
  );

  console.log(
    `\nNode ${process.version}: ${specifiers.length * 2 - failures.length}/${specifiers.length * 2} entry point loads succeeded`,
  );
  process.exitCode = failures.length ? 1 : 0;
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
