import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { computeSHA256, verifyChecksum, checkForUpdates, install } from '../src/api/updater';

// Mock the filesystem module so writeBinaryFile is a no-op spy
vi.mock('../src/api/filesystem', () => ({
    writeBinaryFile: vi.fn().mockResolvedValue(undefined),
}));

// --- Helpers ---

/** Encode a string to an ArrayBuffer (UTF-8). */
function stringToBuffer(str: string): ArrayBuffer {
    return new TextEncoder().encode(str).buffer;
}

/** Compute the expected SHA-256 hex string using Node's crypto (reference impl). */
async function referenceSHA256(data: ArrayBuffer): Promise<string> {
    const { createHash } = await import('crypto');
    const hash = createHash('sha256');
    hash.update(Buffer.from(data));
    return hash.digest('hex');
}

// --- Setup: polyfill crypto.subtle.digest for Node (vitest runs in Node) ---

const originalCrypto = globalThis.crypto;

beforeEach(async () => {
    // Node 18+ has crypto.subtle, but just in case, ensure it's available
    if (!globalThis.crypto?.subtle?.digest) {
        const { webcrypto } = await import('crypto');
        Object.defineProperty(globalThis, 'crypto', {
            value: webcrypto,
            writable: true,
            configurable: true,
        });
    }
});

// ---------------------------------------------------------------------------
// computeSHA256
// ---------------------------------------------------------------------------
describe('computeSHA256', () => {
    it('should return a 64-char lowercase hex string', async () => {
        const buf = stringToBuffer('hello world');
        const hash = await computeSHA256(buf);

        expect(hash).toHaveLength(64);
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should match reference SHA-256 for a known input', async () => {
        const buf = stringToBuffer('hello world');
        const expected = await referenceSHA256(buf);
        const actual = await computeSHA256(buf);

        expect(actual).toBe(expected);
    });

    it('should produce the well-known SHA-256 of "hello world"', async () => {
        const buf = stringToBuffer('hello world');
        const hash = await computeSHA256(buf);

        // SHA-256("hello world") is a well-known constant
        expect(hash).toBe(
            'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
        );
    });

    it('should return a different hash for different inputs', async () => {
        const hash1 = await computeSHA256(stringToBuffer('aaa'));
        const hash2 = await computeSHA256(stringToBuffer('bbb'));

        expect(hash1).not.toBe(hash2);
    });

    it('should handle an empty buffer', async () => {
        const buf = stringToBuffer('');
        const hash = await computeSHA256(buf);
        const expected = await referenceSHA256(buf);

        expect(hash).toBe(expected);
        // SHA-256 of empty string is a well-known constant
        expect(hash).toBe(
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        );
    });
});

// ---------------------------------------------------------------------------
// verifyChecksum
// ---------------------------------------------------------------------------
describe('verifyChecksum', () => {
    it('should return true for identical strings', () => {
        const hex = 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9';
        expect(verifyChecksum(hex, hex)).toBe(true);
    });

    it('should return false when strings differ', () => {
        const a = 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9';
        const b = 'aaaa27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9';
        expect(verifyChecksum(a, b)).toBe(false);
    });

    it('should return false when lengths differ', () => {
        expect(verifyChecksum('abcdef', 'abcde')).toBe(false);
    });

    it('should return false for empty vs non-empty', () => {
        expect(verifyChecksum('', 'abc')).toBe(false);
    });

    it('should return true for two empty strings', () => {
        expect(verifyChecksum('', '')).toBe(true);
    });

    it('should be case-sensitive (uppercase ≠ lowercase)', () => {
        const lower = 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
        const upper = 'ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890';
        expect(verifyChecksum(lower, upper)).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// checkForUpdates
// ---------------------------------------------------------------------------
describe('checkForUpdates', () => {
    beforeEach(() => {
        // Mock window.NL_APPID
        (globalThis as any).window = {
            NL_APPID: 'test.app.id',
            NL_PATH: '/tmp/testapp',
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
        delete (globalThis as any).window;
    });

    it('should reject when url is empty', async () => {
        await expect(checkForUpdates('')).rejects.toEqual({
            code: 'NE_RT_NATRTER',
            message: 'Missing require parameter: url',
        });
    });

    it('should resolve with a valid manifest containing checksum', async () => {
        const validManifest = {
            applicationId: 'test.app.id',
            version: '2.0.0',
            resourcesURL: 'https://example.com/resources.neu',
            checksum: 'abc123def456',
        };

        globalThis.fetch = vi.fn().mockResolvedValue({
            text: () => Promise.resolve(JSON.stringify(validManifest)),
        });

        const result = await checkForUpdates('https://example.com/manifest.json');
        expect(result).toEqual(validManifest);
    });

    it('should reject when manifest is missing checksum field', async () => {
        const noChecksumManifest = {
            applicationId: 'test.app.id',
            version: '2.0.0',
            resourcesURL: 'https://example.com/resources.neu',
            // no checksum!
        };

        globalThis.fetch = vi.fn().mockResolvedValue({
            text: () => Promise.resolve(JSON.stringify(noChecksumManifest)),
        });

        await expect(checkForUpdates('https://example.com/manifest.json')).rejects.toEqual({
            code: 'NE_UP_CUPDMER',
            message: 'Invalid update manifest or mismatching applicationId',
        });
    });

    it('should reject when applicationId does not match', async () => {
        const wrongAppManifest = {
            applicationId: 'wrong.app.id',
            version: '2.0.0',
            resourcesURL: 'https://example.com/resources.neu',
            checksum: 'abc123',
        };

        globalThis.fetch = vi.fn().mockResolvedValue({
            text: () => Promise.resolve(JSON.stringify(wrongAppManifest)),
        });

        await expect(checkForUpdates('https://example.com/manifest.json')).rejects.toEqual({
            code: 'NE_UP_CUPDMER',
            message: 'Invalid update manifest or mismatching applicationId',
        });
    });

    it('should reject when fetch fails', async () => {
        globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        await expect(checkForUpdates('https://example.com/manifest.json')).rejects.toEqual({
            code: 'NE_UP_CUPDERR',
            message: 'Unable to fetch update manifest',
        });
    });
});

// ---------------------------------------------------------------------------
// install  – integrity check behavior
// ---------------------------------------------------------------------------
describe('install', () => {
    beforeEach(() => {
        (globalThis as any).window = {
            NL_APPID: 'test.app.id',
            NL_PATH: '/tmp/testapp',
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
        delete (globalThis as any).window;
    });

    it('should reject when no manifest is loaded', async () => {
        // Get a fresh module instance where manifest is null
        vi.resetModules();
        const freshUpdater = await import('../src/api/updater');

        await expect(freshUpdater.install()).rejects.toEqual({
            code: 'NE_UP_UPDNOUF',
            message: 'No update manifest loaded. Make sure that updater.checkForUpdates() is called before install().',
        });
    });

    it('should reject with NE_UP_UPDCSER when checksum mismatches', async () => {
        const binaryContent = 'fake binary content';
        const wrongChecksum = '0000000000000000000000000000000000000000000000000000000000000000';

        const validManifest = {
            applicationId: 'test.app.id',
            version: '2.0.0',
            resourcesURL: 'https://example.com/resources.neu',
            checksum: wrongChecksum,
        };

        // First call: checkForUpdates fetch
        // Second call: install fetch
        let callCount = 0;
        globalThis.fetch = vi.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
                return Promise.resolve({
                    text: () => Promise.resolve(JSON.stringify(validManifest)),
                });
            }
            return Promise.resolve({
                arrayBuffer: () => Promise.resolve(stringToBuffer(binaryContent)),
            });
        });

        await checkForUpdates('https://example.com/manifest.json');

        await expect(install()).rejects.toEqual({
            code: 'NE_UP_UPDCSER',
            message: 'Resource checksum mismatch: the downloaded update binary integrity check failed',
        });
    });

    it('should succeed when checksum matches', async () => {
        const binaryContent = 'valid binary content';
        const buf = stringToBuffer(binaryContent);
        const correctChecksum = await referenceSHA256(buf);

        const validManifest = {
            applicationId: 'test.app.id',
            version: '2.0.0',
            resourcesURL: 'https://example.com/resources.neu',
            checksum: correctChecksum,
        };

        let callCount = 0;
        globalThis.fetch = vi.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
                return Promise.resolve({
                    text: () => Promise.resolve(JSON.stringify(validManifest)),
                });
            }
            return Promise.resolve({
                arrayBuffer: () => Promise.resolve(stringToBuffer(binaryContent)),
            });
        });

        // filesystem.writeBinaryFile is already mocked at module level via vi.mock

        await checkForUpdates('https://example.com/manifest.json');

        const result = await install();
        expect(result).toEqual({
            success: true,
            message: 'Update installed. Restart the process to see updates',
        });
    });

    it('should reject with NE_UP_UPDINER on fetch failure during install', async () => {
        const validManifest = {
            applicationId: 'test.app.id',
            version: '2.0.0',
            resourcesURL: 'https://example.com/resources.neu',
            checksum: 'abc123',
        };

        let callCount = 0;
        globalThis.fetch = vi.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
                return Promise.resolve({
                    text: () => Promise.resolve(JSON.stringify(validManifest)),
                });
            }
            return Promise.reject(new Error('Download failed'));
        });

        await checkForUpdates('https://example.com/manifest.json');

        await expect(install()).rejects.toEqual({
            code: 'NE_UP_UPDINER',
            message: 'Update installation error',
        });
    });
});
