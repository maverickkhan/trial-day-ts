import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.spec.ts'],
        coverage: {
            provider: 'v8',      // built-in V8/C8 engine
            all: true,

            thresholds: {        // ← put per-metric limits here
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
