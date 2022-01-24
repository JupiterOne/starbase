module.exports = {
  ...require('@jupiterone/integration-sdk-dev-tools/config/jest'),
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  testMatch: [
    '<rootDir>/src/**/*.test.ts',
  ],
};
