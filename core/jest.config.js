module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/testing/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
