/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  setupFiles: ['raf/polyfill'],
  coverageReporters: ['html', 'text'],
  roots: ['src'],
  testRegex: '/__tests__/.*\\.test\\.(ts|tsx|js)$',
  setupFilesAfterEnv: ['./src/__tests__/setup.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  moduleNameMapper: {
    '^(\\.\\.?\\/.+)\\.js$': '$1',
  },
};
