import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

import { loadDocs } from './loadDocs.js';

const declarationsPath = './dist/declarations/api';

function getSummary(markdown) {
    if (!markdown) return '';
    return markdown.split(/\n\s*\n/)[0]
        .replace(/\s+/g, ' ')
        .trim();
}

function getParameterDescription(parameter) {
    return parameter.description
        .replace(/^[A-Za-z][A-Za-z0-9[\]]*(?:\s+\(optional\))?\s*:\s*/, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function addOptions(parameterDocs, documentation) {
    parameterDocs.push({
        name: 'options',
        description: 'Options.',
    });

    for (const option of documentation.options) {
        parameterDocs.push({
            name: `options.${option.name}`,
            description: getParameterDescription(option),
        });
    }
}

function getParameterDocs(declaration, documentation) {
    const parameterDocs = [];

    for (let index = 0; index < documentation.parameters.length; index++) {
        const declarationParameter = declaration.parameters[index];
        const documentationParameter = documentation.parameters[index];
        if (!declarationParameter || !documentationParameter) continue;
        parameterDocs.push({
            name: declarationParameter.name.getText(),
            description: getParameterDescription(documentationParameter),
        });
    }

    if (documentation.options.length) {
        const optionsParameter = declaration.parameters.find(
            parameter => parameter.name.getText() === 'options',
        );
        if (optionsParameter) addOptions(parameterDocs, documentation);
    }

    return parameterDocs;
}

function jsDocSection(include, getLines) {
    return include
        ? [' *', ...getLines()]
        : [];
}

function createJsDoc(declaration, documentation) {
    const params = getParameterDocs(declaration, documentation);
    return [
        '/**',
        ` * ${getSummary(documentation.description)}`,
        ...jsDocSection(params.length, () => params.map(
            param => ` * @param ${param.name} - ${param.description}`,
        )),
        ' */'
    ].join('\n') + '\n';
}

function isExportedFunction(node) {
    if (!ts.isFunctionDeclaration(node) || !node.name) return false;
    return (
        node.modifiers?.some(
            modifier => modifier.kind === ts.SyntaxKind.ExportKeyword,
        ) ?? false
    );
}

function getPatches(sourceFile, namespace, docs) {
    const patches = [];
    for (const declaration of sourceFile.statements) {
        if (!isExportedFunction(declaration)) continue;
        const functionName = declaration.name.text;
        const symbol = `${namespace}.${functionName}`;
        const documentation = docs.bySymbol[symbol];
        if (!documentation) {
            console.warn(`No documentation found for ${symbol}`);
            continue;
        }

        patches.push({
            position: declaration.getStart(sourceFile),
            text: createJsDoc(declaration, documentation),
        });
    }

    return patches;
}

function patchSource(source, namespace, docs) {
    const sourceFile = ts.createSourceFile(
        `${namespace}.d.ts`,
        source,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
    );

    const patches = getPatches(sourceFile, namespace, docs)
        .sort((a, b) => b.position - a.position);
    for (const patch of patches) {
        source = source.slice(0, patch.position)
            + patch.text
            + source.slice(patch.position);
    }

    return source;
}

async function patchDeclarationFile(filePath, docs) {
    const namespace = path.basename(filePath, '.d.ts');
    const source = await fs.readFile(filePath, 'utf8');
    const patchedSource = patchSource(source, namespace, docs);
    await fs.writeFile(filePath, patchedSource);
}

async function getDeclarationFiles() {
    const entries = await fs.readdir(declarationsPath, {
        withFileTypes: true,
    });

    return entries
        .filter(entry => entry.isFile())
        .filter(entry => entry.name.endsWith('.d.ts'))
        .map(entry => path.join(declarationsPath, entry.name));
}

export async function patchWithDocs() {
    const docs = await loadDocs();
    const files = await getDeclarationFiles();
    for (const file of files)
        await patchDeclarationFile(file, docs);
}
