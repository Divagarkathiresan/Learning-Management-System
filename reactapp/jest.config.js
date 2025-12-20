module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  // Ignore all of node_modules except (transpile CJS lib folder within axios/follow-redirects for commonjs)
  transformIgnorePatterns: [
    '/node_modules/(?!(axios/lib|follow-redirects/lib)/)'
  ],
  moduleNameMapper: {
    '^axios$': require.resolve('axios/lib/axios.js'),
  },
};
