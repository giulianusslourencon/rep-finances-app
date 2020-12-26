const { name } = require('./package.json')
const { compilerOptions } = require('./tsconfig.json')

const { pathsToModuleNameMapper } = require('ts-jest/utils')

module.exports = {
  displayName: name,
  name,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/services/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>'
  }),
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/**/__tests__/*.spec.ts',
    '<rootDir>/src/**/*.test.ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
}
