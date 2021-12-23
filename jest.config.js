module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  restoreMocks: true,
  testMatch: [
    '<rootDir>/**/*.test.ts',
    '!**/node_modules/*',
    '!**/dist/*',
    '!**/*.bak/*',
  ],
  collectCoverage: false,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: ['.integrations']
};
