// Marks dist/cjs as CommonJS, overriding the root "type": "module".

import { writeFileSync } from 'node:fs';

writeFileSync(
  new URL('../dist/cjs/package.json', import.meta.url),
  `${JSON.stringify({ type: 'commonjs' }, null, 2)}\n`,
);
