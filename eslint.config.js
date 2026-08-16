import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
    {
        ignores: ['node_modules/', 'dist/'],
    },

    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: ['**/*.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },

    {
        files: ['*.mjs', '*.js'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },

    prettier,
];
