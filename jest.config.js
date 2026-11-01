module.exports = {
  preset: 'jest-expo',
  collectCoverageFrom: ['components/**/*.js', '!components/**/__tests__/**'],
  coverageReporters: ['html', 'lcov', 'text-summary', 'cobertura'],
  testPathIgnorePatterns: ['/node_modules/'],
};

