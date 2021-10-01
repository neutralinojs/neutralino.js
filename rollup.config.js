// @ts-check

import Ts   from 'rollup-plugin-ts'
import Json from '@rollup/plugin-json'
import { terser as Minify } from 'rollup-plugin-terser'

/** @type {import ("rollup").RollupOptions[]} RollupOptions */
const options = [
    {
        input: 'src/index.ts',
        output: {
            file      : 'dist/neutralino.js',
            format    : "iife",
            name      : "Neutralino",
            sourcemap : true
        },
        plugins: [
            Json (),
            Ts ({
                tsconfig: './tsconfig.json'
            }),
            Minify ({ format: { comments: false } })
        ]
    }
]

export default options