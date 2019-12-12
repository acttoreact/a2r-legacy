module.exports = {
  roots: ['<rootDir>/src'],
  typeRoots: ['../node_modules/@types'],
  testMatch: ['**/tests/**/*.ts?(x)', '**/?(*.)+(spec|test).js?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
