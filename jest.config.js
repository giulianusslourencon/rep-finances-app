module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  verbose: true,
  projects: ['<rootDir>/packages/**/jest.config.js'],
  testEnvironment: 'node',
  testMatch: ['*.spec.ts', '*.spec.tsx']
}
