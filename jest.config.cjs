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
  testRegex: '/__tests__/.*\\.(ts|tsx|js)$',
  setupFilesAfterEnv: ['./src/setupTests.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  moduleNameMapper: {
    '^(\\.\\.?\\/.+)\\.js$': '$1',
  },
};
