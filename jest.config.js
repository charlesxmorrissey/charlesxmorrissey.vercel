module.exports = {
  cacheDirectory: '<rootDir>/.jest-cache',
  moduleDirectories: ['node_modules', 'src', 'test'],
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '\\.svg': '<rootDir>/src/test/__mocks__/svgrMock.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/.[jt]s?(x)',
    '<rootDir>/src/**/*.test.[jt]s?(x)',
    '<rootDir>/test/**/*.test.[jt]s?(x)',
  ],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
}
