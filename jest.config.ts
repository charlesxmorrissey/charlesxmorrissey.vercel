export default {
  cacheDirectory: '<rootDir>/.jest-cache',
  clearMocks: true,
  moduleDirectories: ['node_modules', 'src', 'tests'],
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '\\.svg': '<rootDir>/src/tests/__mocks__/svgrMock.ts',
  },
  resetMocks: true,
  restoreMocks: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/.[jt]s?(x)',
    '<rootDir>/src/**/*.test.[jt]s?(x)',
  ],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next)[/\\\\]'],
  transform: {
    '\\.[jt]sx?$': ['@swc/jest'],
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
}
