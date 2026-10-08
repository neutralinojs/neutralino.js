import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'coverage/**',
            'build/Release/**',
            '.cache/**',
            '.parcel-cache/**',
            '.serverless/**',
            'tmp/**',
            'temp/**',
            '*.tgz',
            '*.tsbuildinfo',
            '.eslintcache',
            '.stylelintcache',
        ],
    },

    js.configs.recommended,

    {
        files: ['**/*.js', '**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
                Neutralino: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            'no-undef': 'off',
        },
    },

    {
        files: ['*.mjs', '**/*.mjs'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
        },
    },

    prettier,
];
