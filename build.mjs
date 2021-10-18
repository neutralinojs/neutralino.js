
/*/
    This script generates the files `neutralino.js` and `neutralino.d.ts`.
    For a development version, use: `node ./build.mjs --dev`
    this will produce an unminified `neutralino.js` file and the neutralino.d.ts.map file.

    ISSUE:
        I don't understand why the source map (`neutralino.js.map`) is not generated.
        https://github.com/wessberg/rollup-plugin-ts#ignoredoverridden-typescript-options
/*/

// @ts-check

import { readFileSync, writeFile, mkdirSync, existsSync } from 'fs'
import { join as joinPath } from 'path'
import { rollup } from 'rollup'
import Ts   from 'rollup-plugin-ts'
import Json from '@rollup/plugin-json'
import { terser as Minify } from 'rollup-plugin-terser'
import cleanup from 'rollup-plugin-cleanup';

// JSON modules is experimental https://nodejs.org/api/esm.html#esm_experimental_json_modules
const { version } = JSON.parse (readFileSync ('./package.json', { encoding: 'utf8' }))
const outdir  = 'dist'
const devmode = process.argv.includes ('--dev')

if (existsSync (outdir) === false)
    mkdirSync (outdir, { recursive: true })

console.log ('import src/index.ts')

rollup ({
    input: 'src/index.ts',
    plugins: [
        Json (),
        Ts ({
            tsconfig: devmode ? config => ({ ...config, declarationMap: true }) : 'tsconfig.json'
        }),
        devmode ? cleanup({comments: 'none'}) : Minify ({ format: { comments: false } })
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
.catch (err =>
{
    console.log (
        '\n' + err +
        (typeof err.loc === 'object' ? err.loc.file + ':' + err.loc.line : '') +
        (typeof err.frame === 'string' ? err.frame : '')
    )
})

const logError = (err) => { if (err) console.error (''+err) }

const writeDts = (filepath, definitions) => writeFile (filepath, 
`// Type definitions for Neutralino ${version}
// Project: https://github.com/neutralinojs
// Definitions project: https://github.com/neutralinojs/neutralino.js

declare namespace Neutralino {

${definitions}
}

/** Basic authentication token */
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
