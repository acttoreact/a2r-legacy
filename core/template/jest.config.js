module.exports = {
  roots: ['<rootDir>/src'],
  "typeRoots": [
    "../node_modules/@types",
  ],
  testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
