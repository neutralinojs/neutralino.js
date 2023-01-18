
/*/
    This script generates the files `neutralino.js`, `neutralino.mjs`, and `neutralino.d.ts`.
    For a development version, use: `node ./build.mjs --dev`
    this will produce an unminified `neutralino.js` file and the neutralino.js.map file.
    neutralino.js.map can be moved without the source code.

    ISSUE:
        rollup-plugin-ts produce an empty `neutralino.d.ts.map`
/*/

// @ts-check

import { readFileSync, writeFile, writeFileSync, mkdirSync, existsSync } from 'fs'
import { exec } from 'child_process'
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

let commitHash = null

if (existsSync (outdir) === false)
    mkdirSync (outdir, { recursive: true })


console.log ('Preprocessing files...')
addCommitHash ()

console.log ('import src/index.ts')

rollup ({
    input: 'src/index.ts',
    plugins: [
        Json (),
        Ts ({
            tsconfig: config => ({
                ...config,
                // rollup-plugin-ts produce an empty map, maybe we will find a solution in the future.
                // declarationMap: devmode
            })
        }),
        devmode ? cleanup({comments: 'none'}) : Minify ({ format: { comments: false } })
    ]
})
.then (build =>
{
    console.log ('generate dist/neutralino.mjs')

    build.write ({
        file      : joinPath (outdir, 'neutralino.mjs'),
        format    : 'esm',
        name      : 'Neutralino',
        sourcemap : devmode
    })

    console.log ('generate lib')

    build.write ({
        dir       : outdir,
        format    : 'cjs',
        sourcemap : devmode
    })

    console.log ('generate dist/neutralino.js')

    return build.generate ({
        file      : 'neutralino.js',
        format    : 'iife',
        name      : 'Neutralino',
        sourcemap : devmode,
        freeze    : false,
        esModule  : false
    })
})
.then (({ output }) =>
{
    for (var entry of output)
    {
        var filepath = joinPath (outdir, entry.fileName)

        if (entry.type === 'chunk')
        {
            // rollup-plugin-ts does not move the map in individual chunk
            if (entry.map) {
                write (filepath + '.map', entry.map.toString ())
                var code = entry.code + '\n//# sourceMappingURL=neutralino.js.map'
            } else {
                var code = entry.code
            }
            write (filepath, code)
        }
        else if (entry.fileName === 'neutralino.d.ts')
        {
            var code = entry.source.toString ()
            writeDts (joinPath (outdir, 'neutralino.d.ts'), code.substring (0, code.lastIndexOf ("export")))
        }
        else
        {
            write (filepath, entry.source)
        }
    }
    resetCommitHash()
})
.catch (err =>
{
    console.error (
        '\n' + err +
        // RollupLogProps, https://github.com/rollup/rollup/blob/master/src/rollup/types.d.ts#L24
        (typeof err.loc   === 'object' ? '\n' + err.loc.file + ':' + err.loc.line : '') +
        (typeof err.frame === 'string' ? '\n' + err.frame : '')
    )
})

function write (filepath, content)
{
    console.log ('write', filepath)
    writeFile (filepath, content, { encoding: 'utf8' }, (err) =>
    {
        if (err)
            console.error (''+err)
    })
}

function patchInitFile (search, replace)
{
    let initSource = readFileSync ('./src/api/init.ts', { encoding: 'utf8' })
    initSource = initSource.replace (search, replace)
    writeFileSync ('./src/api/init.ts', initSource, { encoding: 'utf8' })
}

function addCommitHash ()
{
    exec ('git log -n 1 main --pretty=format:"%H"', (err, stdout) => {
        let hash = stdout.trim()
        patchInitFile ('<git_commit_hash_latest>', hash)
        commitHash = hash
    })
}

function resetCommitHash ()
{
    patchInitFile (commitHash, '<git_commit_hash_latest>')
}

const writeDts = (filepath, definitions) => {
    // A 'declare' modifier cannot be used in an already ambient context.
    definitions = definitions.replaceAll ('declare namespace', 'namespace')
    definitions = definitions.replaceAll ('declare function', 'function')
    write (filepath,
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

/** Release commit of the client library */
declare const NL_CCOMMIT: string;

/** An array of custom methods */
NL_CMETHODS: string[];

${
    // rollup-plugin-ts produce an empty map, maybe we will find a solution in the future.
    // devmode ? '//# sourceMappingURL=neutralino.d.ts.map' : ''
    ''
}`/*dtsTemplate*/)
}
