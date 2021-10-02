
// @ts-check

import { readFileSync, writeFile, mkdirSync, existsSync } from 'fs'
import { join as joinPath } from 'path'
import { rollup } from 'rollup'
import Ts   from 'rollup-plugin-ts'
import Json from '@rollup/plugin-json'
import { terser as Minify } from 'rollup-plugin-terser'

// JSON modules is experimental https://nodejs.org/api/esm.html#esm_experimental_json_modules
const { version } = JSON.parse (readFileSync ('./package.json', { encoding: 'utf8' }))
const outdir  = 'dist'

if (existsSync (outdir) === false)
    mkdirSync (outdir, { recursive: true })

console.log ('import src/index.ts')
rollup ({
    input: 'src/index.ts',
    plugins: [
        Json (),
        Ts ({
            tsconfig: './tsconfig.json'
        }),
        Minify ({ format: { comments: false } })
    ]
})
.then (build =>
{
    console.log ('generate dist/neutralino.js')
    return build.generate ({
        file      : 'neutralino.js',
        format    : "iife",
        name      : "Neutralino",
        sourcemap : true
    })
})
.then (({ output }) => 
{
    /** @type {string} */
    var dts = null

    /** @type {string} */
    var filepath

    // Currently there are only two generated files, the .js and the .d.ts,
    // but maybe in the future if there are dynamic imports, this loop will work.
    for (var entry of output)
    {
        filepath = joinPath (outdir, entry.fileName)

        if (entry.type === 'chunk')
        {
            console.log ('write', filepath)
            writeFile (filepath, entry.code, { encoding: 'utf8' }, logError)
        }
        else if (entry.fileName !== 'neutralino.d.ts')
        {
            console.log ('write', filepath)
            writeFile (filepath, entry.source, { encoding: 'utf8' }, logError)
        }
        else
        {
            dts = entry.source.toString ()
        }
    }

    return dts
})
.then (dts => 
{
    const filepath = joinPath (outdir, 'neutralino.d.ts')
    console.log ('write', filepath)
    writeDts (filepath, dts.substring (0, dts.lastIndexOf ("export")))
})

const logError = (err) => { if (err) console.error (''+err) }

const writeDts = (filepath, definitions) => writeFile (filepath, 
`// Type definitions for Neutralino ${version}
// Project: https://github.com/neutralinojs
// Definitions project: https://github.com/neutralinojs/neutralino.js

declare namespace Neutralino {

${definitions}
}

/** Exists but not documented: https://neutralino.js.org/docs/developer-environment/global-variables */
declare const NL_TOKEN: string;

/** Operating system name: Linux, Windows, or Darwin */
declare const NL_OS: "Linux"|"Windows"|"Darwin";

/** Application identifier */
declare const NL_APPID: string;

/** Application port */
declare const NL_PORT: number;

/** Mode of the application: window, browser, or cloud */
declare const NL_MODE: "window"|"browser"|"cloud";

/** Neutralinojs server version */
declare const NL_VERSION: string;

/** Neutralinojs client version */
declare const NL_CVERSION: "${version}";

/** Current working directory */
declare const NL_CWD: string;

/** Application path */
declare const NL_PATH: string;

/** Command-line arguments */
declare const NL_ARGS: string[];

/** Current process's identifier */
declare const NL_PID: number

`/*dtsTemplate*/, { encoding: 'utf8' }, logError)
