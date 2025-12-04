import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@refcompo/shared(.*)$': '<rootDir>/../shared/src$1'
  }
};

export default config;


