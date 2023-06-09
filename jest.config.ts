import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
    // [...]
    preset: 'ts-jest/presets/default-esm', // or other ESM presets
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
        // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    transformIgnorePatterns: ['/node_modules/@geometryzen/multivectors/dist/esm/index.min.js'],
};

export default jestConfig;
//export default {
    // collectCoverage: true,
    // collectCoverageFrom: ['**/src/**/*.js', '!**/node_modules/**'],
    // coverageReporters: ['json', 'lcov', 'text', 'clover', 'text-summary'],
    // modulePathIgnorePatterns: ['dist'],
    //preset: 'ts-jest',
    //resolver: 'ts-jest-resolver',
    //testMatch: ['**/src/**/*.spec.ts'],    // Why do we need the ** prefix?
    //transform: {}
//};
