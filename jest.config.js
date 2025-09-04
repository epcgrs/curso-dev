const nextJest = require('next/jest');
const dotenv = require('dotenv');

dotenv.config({
  path: './.env.development'
});

const createJestConfig = nextJest({
  dir: "."
});
const jestConfig = createJestConfig({
  moduleDirectories: ['node_modules', '<rootDir>'],
  setupFiles: ['dotenv/config'],
  testTimeout: 30000
});

module.exports = jestConfig;