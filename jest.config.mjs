/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  "clearMocks": true,
  "collectCoverage": true,
  "coverageDirectory": "coverage",
  "coverageProvider": "v8",
  "testEnvironment": "node",
  "transform": {
    "^.+\\.jsx?$": "babel-jest"
  }
};
