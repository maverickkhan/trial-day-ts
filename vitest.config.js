"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.spec.ts'],
        coverage: {
            provider: 'v8', // built-in V8/C8 engine
            all: true,
            thresholds: {
                lines: 100,
                functions: 100,
                branches: 100,
                statements: 100,
            },
            exclude: [
                'src/load-env.ts',
                'src/**/responses.ts',
                'src/**/docs/**',
                '**/*config.ts',
                '**/*.config.ts',
                '**/index.ts'
            ],
        },
    },
});
