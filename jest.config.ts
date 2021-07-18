export default {
  testEnvironment: 'node',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  testMatch: [
    '**/?(*.)+(spec|test).+(ts)'
  ],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  coverageProvider: 'v8',
  roots: [
    '<rootDir>/src'
  ],
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}