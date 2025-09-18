/*/
    This script generates the files `neutralino.js`, `neutralino.mjs`, and `neutralino.d.ts`.
    For a development version, use: `node ./build.mjs --dev`
    this will produce an unminified `neutralino.js` file and the neutralino.js.map file.
    neutralino.js.map can be moved without the source code.
/*/

// @ts-check

import {
    readFileSync,
    writeFile,
    writeFileSync,
    mkdirSync,
    existsSync,
    readdirSync,
    rmSync,
} from 'fs';
import { exec } from 'child_process';
import { join as joinPath } from 'path';
import { rollup } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import Json from '@rollup/plugin-json';
import Minify from '@rollup/plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
import { generateDtsBundle } from 'dts-bundle-generator';

// JSON modules is experimental https://nodejs.org/api/esm.html#esm_experimental_json_modules
const { version } = JSON.parse(
    readFileSync('./package.json', { encoding: 'utf8' }),
);
const outdir = 'dist';
const devmode = process.argv.includes('--dev');

let commitHash = null;

if (existsSync(outdir)) {
    rmSync(outdir, { recursive: true });
} else {
    mkdirSync(outdir, { recursive: true });
}

console.log('Preprocessing files...');
addCommitHash();

console.log('import src/index.ts');

rollup({
    input: 'src/index.ts',
    plugins: [
        Json(),
        typescript({
            tsconfig: './tsconfig.json', // Use this tsconfig file to configure TypeScript compilation
        }),
        devmode
            ? cleanup({ comments: 'none' })
            : Minify({ format: { comments: false } }),
    ],
})
    .then(async build => {
        console.log('generate dist/neutralino.mjs');

        await build.write({
            file: joinPath(outdir, 'neutralino.mjs'),
            format: 'esm',
            name: 'Neutralino',
            sourcemap: devmode,
        });

        console.log('generate lib');

        await build.write({
            dir: outdir,
            format: 'cjs',
            sourcemap: devmode,
        });

        console.log('generate dist/neutralino.js');

        await build.write({
            file: joinPath(outdir, 'neutralino.js'),
            format: 'iife',
            name: 'Neutralino',
            sourcemap: devmode,
            freeze: false,
            esModule: false,
        });
        return 0;
    })
    .then(returned => {
        console.log('Rolling up typescript declarations');

        const bundled = generateDtsBundle([
            {
                filePath: './dist/declarations/index.d.ts',
                output: {
                    inlineDeclareGlobals: true,
                    inlineDeclareExternals: true,
                    noBanner: true,
                    exportReferencedTypes: false,
                },
            },
        ]);
        const bundledUnderNamespace = generateDtsBundle([
            {
                filePath: './dist/declarations/index.d.ts',
                output: {
                    inlineDeclareGlobals: true,
                    inlineDeclareExternals: true,
                    noBanner: true,
                    exportReferencedTypes: false,
                    umdModuleName: 'Neutralino',
                },
            },
        ]);
        write(joinPath(outdir, 'neutralino.d.ts'), bundledUnderNamespace[0]);
        write(joinPath(outdir, 'neutralino.d.mts'), bundled[0]);
        write(joinPath(outdir, 'index.d.ts'), bundled[0]);
        rmSync(joinPath(outdir, 'declarations'), { recursive: true });
        resetCommitHash();
    })
    .catch(err => {
        console.error(
            '\n' +
                err +
                // RollupLogProps, https://github.com/rollup/rollup/blob/master/src/rollup/types.d.ts#L24
                (typeof err.loc === 'object'
                    ? '\n' + err.loc.file + ':' + err.loc.line
                    : '') +
                (typeof err.frame === 'string' ? '\n' + err.frame : ''),
        );
    });

function write(filepath, content) {
    console.log('write', filepath);
    writeFile(filepath, content, { encoding: 'utf8' }, err => {
        if (err) console.error('' + err);
    });
}

function patchInitFile(search, replace) {
    let initSource = readFileSync('./src/api/init.ts', { encoding: 'utf8' });
    initSource = initSource.replace(search, replace);
    writeFileSync('./src/api/init.ts', initSource, { encoding: 'utf8' });
}

function addCommitHash() {
    try {
        const hash = exec('git log -n 1 main --pretty=format:"%H"')
            .toString()
            .trim();
        patchInitFile('<git_commit_hash_latest>', hash);
        commitHash = hash;
    } catch (err) {
        console.warn('Warning: Could not get git commit hash:', err.message);
        commitHash = '<git_commit_hash_latest>';
    }
}
function resetCommitHash() {
    patchInitFile(commitHash, '<git_commit_hash_latest>');
}
