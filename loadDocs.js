import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const DOCS_REPO_PATH = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../neutralinojs.github.io',
);
const apiDocsPath = path.join(DOCS_REPO_PATH, 'docs', 'api');

const DOCS_REPO_URL =
    'https://github.com/neutralinojs/neutralinojs.github.io.git';
const DOCS_NOT_FOUND_MESSAGE =
    `Neutralino documentation not found at ${DOCS_REPO_PATH}\n` +
    `Run \`git clone ${DOCS_REPO_URL}\` to clone it.`;

async function assertDocsRepositoryExists() {
    return new Promise((resolve, reject) => {
        fs.stat(apiDocsPath, (err, stats) => {
            if (err || !stats.isDirectory())
                return reject(DOCS_NOT_FOUND_MESSAGE);
            resolve();
        });
    });
}

async function getMarkdownFiles(directoryPath) {
    const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
    return entries
        .filter(entry => entry.isFile())
        .filter(entry => entry.name.endsWith('.md'))
        .map(entry => path.join(directoryPath, entry.name));
}

function parseMethodHeading(heading) {
    const match = heading.match(/^([A-Za-z0-9_]+)\.([A-Za-z0-9_]+)\(/);
    if (!match) return null;

    const [, namespace, method] = match;
    const symbol = `${namespace}.${method}`;
    return { namespace, method, symbol };
}

function splitMethodTokens(tokens) {
    const methods = [];
    let currentMethod = null;

    for (const token of tokens) {
        if (token.type === 'heading' && token.depth === 2) {
            if (currentMethod) methods.push(currentMethod);
            currentMethod = {
                heading: token.text.trim(),
                tokens: [],
            };
            continue;
        }
        if (currentMethod) currentMethod.tokens.push(token);
    }

    if (currentMethod) methods.push(currentMethod);
    return methods;
}

function splitSubsections(tokens) {
    const sections = new Map();

    let currentSection = 'description';
    sections.set(currentSection, []);
    for (const token of tokens) {
        if (token.type === 'heading' && token.depth === 3) {
            currentSection = token.text.trim().toLowerCase();
            if (!sections.has(currentSection))
                sections.set(currentSection, []);
            continue;
        }
        sections.get(currentSection).push(token);
    }

    return sections;
}

function tokensToMarkdown(tokens) {
    return tokens.map(token => token.raw).join('').trim();
}

function getInlineText(tokens = []) {
    return tokens
        .map(token => {
            return token.tokens
                ? getInlineText(token.tokens)
                : token.text || token.raw || '';
        })
        .join('').trim();
}

function parseListItem(item) {
    const firstToken = item.tokens?.[0];
    if (!firstToken) return null;

    const inlineTokens = firstToken.tokens ?? [];
    const nameToken = inlineTokens.find(token => token.type === 'codespan');

    if (!nameToken) {
        return {
            name: null,
            description: getInlineText(inlineTokens),
            markdown: tokensToMarkdown(item.tokens ?? []),
        };
    }

    const name = nameToken.text;
    const nameIndex = inlineTokens.indexOf(nameToken);
    const description = getInlineText(inlineTokens.slice(nameIndex + 1))
        .replace(/^:\s*/, '')
        .trim();

    return {
        name,
        description,
        markdown: tokensToMarkdown(item.tokens ?? []),
    };
}

function parseListSection(tokens) {
    const list = tokens.find(token => token.type === 'list');
    return list
        ? list.items.map(parseListItem).filter(Boolean)
        : [];
}

function findSection(sections, name) {
    return sections.get(name.toLowerCase()) ?? [];
}

function findReturnSection(sections) {
    for (const [heading, tokens] of sections) {
        const match = heading.match(/^return\s+(.+?)(?:\s+\(awaited\))?:?$/);
        if (!match) continue;

        return {
            type: match?.[1] ?? null,
            awaited: heading.includes('(awaited)'),
            description: tokensToMarkdown(tokens),
        };
    }

    return null;
}

function parseMethod(methodSection, sourceFile) {
    const method = parseMethodHeading(methodSection.heading);
    if (!method) return null;

    const sections = splitSubsections(methodSection.tokens);
    return {
        ...method,
        description: tokensToMarkdown(findSection(sections, 'description')),
        parameters: parseListSection(findSection(sections, 'parameters')),
        options: parseListSection(findSection(sections, 'options')),
        returns: findReturnSection(sections),
        sourceFile,
    };
}

function parseApiDocument(markdown, sourceFile) {
    const tokens = marked.lexer(markdown);
    return splitMethodTokens(tokens)
        .map(method => parseMethod(method, sourceFile))
        .filter(Boolean);
}

async function loadApiDocument(filePath) {
    const markdown = fs.readFileSync(filePath, 'utf8');
    return parseApiDocument(markdown, path.basename(filePath));
}

function buildDocumentationIndex(methods) {
    return Object.fromEntries(methods.map(method => [method.symbol, method]));
}

export async function loadDocs() {
    await assertDocsRepositoryExists();
    const files = await getMarkdownFiles(apiDocsPath);
    const documents = await Promise.all(files.map(loadApiDocument));
    const methods = documents.flat();
    return {
        repositoryPath: DOCS_REPO_PATH,
        apiDocsPath,
        methods,
        bySymbol: buildDocumentationIndex(methods),
    };
}
