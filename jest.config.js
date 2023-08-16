module.exports = {
  cacheDirectory: '<rootDir>/.jest-cache',
  moduleDirectories: ['node_modules', 'src', 'tests'],
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|png)$': '<rootDir>/src/tests/__mocks__/fileMock.ts',
    '\\.svg': '<rootDir>/src/tests/__mocks__/svgrMock.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/.[jt]s?(x)',
    '<rootDir>/src/**/*.test.[jt]s?(x)',
    '<rootDir>/test/pages/**/*.test.[jt]s?(x)',
  ],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next)[/\\\\]'],
  transform: {
    '\\.[jt]sx?$': [
      'babel-jest',
      {
        plugins: ['@babel/plugin-proposal-private-methods'],
        presets: ['next/babel'],
      },
    ],
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
}
