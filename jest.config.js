module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  verbose: true,
  projects: ['<rootDir>/packages/**/jest.config.cjs'],
  testEnvironment: 'node',
  testMatch: ['*.spec.ts', '*.spec.tsx']
}
