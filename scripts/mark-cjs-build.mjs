// The root package.json says "type": "module", so Node would parse the .js
// files in dist/cjs as ESM. This nested package.json makes it read them as
// CommonJS again.

import { writeFileSync } from 'node:fs';

writeFileSync(
  new URL('../dist/cjs/package.json', import.meta.url),
  `${JSON.stringify({ type: 'commonjs' }, null, 2)}\n`,
);
