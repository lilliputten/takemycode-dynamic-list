const { pathsToModuleNameMapper, createDefaultPreset } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.app.json');

const tsJestTransformCfg = createDefaultPreset().transform;
const tsconfigPaths = pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' });

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.', // ensure rootDir is project root
  testMatch: ['**/*.test.ts'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    ...tsconfigPaths,
    '^@shared-types/(.*)$': '<rootDir>/../server/src/shared-types/$1',
    // '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: tsJestTransformCfg,
};
