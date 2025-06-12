const { pathsToModuleNameMapper, createDefaultPreset } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.app.json');

const tsJestTransformCfg = createDefaultPreset().transform;

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  transform: tsJestTransformCfg,
};
