// Marks dist/cjs as CommonJS, overriding the root "type": "module".

import { copyFileSync } from 'node:fs';

copyFileSync(
  new URL('./cjs-package.json', import.meta.url),
  new URL('../dist/cjs/package.json', import.meta.url),
);
