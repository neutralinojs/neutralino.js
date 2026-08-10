import { beforeEach, describe, expect, it, vi } from 'vitest';

const { sendMessage } = vi.hoisted(() => ({
    sendMessage: vi.fn(),
}));

vi.mock('../../src/ws/websocket', () => ({
    sendMessage,
}));

import * as filesystem from '../../src/api/filesystem';

describe('filesystem API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls filesystem.createDirectory', async () => {
        sendMessage.mockResolvedValue(undefined);

        await filesystem.createDirectory('/tmp/test');

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.createDirectory',
            { path: '/tmp/test' },
        );
    });

    it('calls filesystem.remove', async () => {
        sendMessage.mockResolvedValue(undefined);

        await filesystem.remove('/tmp/test');

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.remove',
            { path: '/tmp/test' },
        );
    });

    it('calls filesystem.writeFile', async () => {
        sendMessage.mockResolvedValue(undefined);

        await filesystem.writeFile('/tmp/test.txt', 'hello');

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.writeFile',
            {
                path: '/tmp/test.txt',
                data: 'hello',
            },
        );
    });

    it('calls filesystem.appendFile', async () => {
        sendMessage.mockResolvedValue(undefined);

        await filesystem.appendFile('/tmp/test.txt', ' world');

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.appendFile',
            {
                path: '/tmp/test.txt',
                data: ' world',
            },
        );
    });

    it('encodes data when calling filesystem.writeBinaryFile', async () => {
        sendMessage.mockResolvedValue(undefined);

        const data = new Uint8Array([1, 2, 3, 4]).buffer;

        await filesystem.writeBinaryFile('/tmp/test.bin', data);

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.writeBinaryFile',
            {
                path: '/tmp/test.bin',
                data: 'AQIDBA==',
            },
        );
    });

    it('encodes data when calling filesystem.appendBinaryFile', async () => {
        sendMessage.mockResolvedValue(undefined);

        const data = new Uint8Array([5, 6, 7]).buffer;

        await filesystem.appendBinaryFile('/tmp/test.bin', data);

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.appendBinaryFile',
            {
                path: '/tmp/test.bin',
                data: 'BQYH',
            },
        );
    });

    it('calls filesystem.readFile with options', async () => {
        sendMessage.mockResolvedValue('file contents');

        const result = await filesystem.readFile('/tmp/test.txt', {
            offset: 10,
            length: 20,
        });

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.readFile',
            {
                path: '/tmp/test.txt',
                offset: 10,
                length: 20,
            },
        );

        expect(result).toBe('file contents');
    });

    it('decodes data returned by filesystem.readBinaryFile', async () => {
        sendMessage.mockResolvedValue('AQIDBA==');

        const result = await filesystem.readBinaryFile('/tmp/test.bin');

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.readBinaryFile',
            {
                path: '/tmp/test.bin',
            },
        );

        expect(Array.from(new Uint8Array(result))).toEqual([1, 2, 3, 4]);
    });

    it('rejects when filesystem.readBinaryFile fails', async () => {
        const error = {
            code: 'NE_FS_FILRDER',
            message: 'File could not be read',
        };

        sendMessage.mockRejectedValue(error);

        await expect(
            filesystem.readBinaryFile('/tmp/test.bin'),
        ).rejects.toEqual(error);
    });

    it('calls filesystem.openFile', async () => {
        sendMessage.mockResolvedValue(42);

        const result = await filesystem.openFile('/tmp/test.txt');

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.openFile',
            { path: '/tmp/test.txt' },
        );

        expect(result).toBe(42);
    });

    it('calls filesystem.createWatcher', async () => {
        sendMessage.mockResolvedValue(7);

        const result = await filesystem.createWatcher('/tmp');

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.createWatcher',
            { path: '/tmp' },
        );

        expect(result).toBe(7);
    });

    it('calls filesystem.removeWatcher', async () => {
        sendMessage.mockResolvedValue(7);

        const result = await filesystem.removeWatcher(7);

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.removeWatcher',
            { id: 7 },
        );

        expect(result).toBe(7);
    });

    it('calls filesystem.getWatchers', async () => {
        const watchers = [
            { id: 1, path: '/tmp' },
        ];

        sendMessage.mockResolvedValue(watchers);

        const result = await filesystem.getWatchers();

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.getWatchers',
        );

        expect(result).toEqual(watchers);
    });

    it('calls filesystem.updateOpenedFile', async () => {
        sendMessage.mockResolvedValue(undefined);

        await filesystem.updateOpenedFile(
            10,
            'write',
            { data: 'hello' },
        );

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.updateOpenedFile',
            {
                id: 10,
                event: 'write',
                data: { data: 'hello' },
            },
        );
    });

    it('calls filesystem.getOpenedFileInfo', async () => {
        const fileInfo = {
            id: 10,
            path: '/tmp/test.txt',
        };

        sendMessage.mockResolvedValue(fileInfo);

        const result = await filesystem.getOpenedFileInfo(10);

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.getOpenedFileInfo',
            { id: 10 },
        );

        expect(result).toEqual(fileInfo);
    });

    it('calls filesystem.readDirectory with options', async () => {
        const entries = [
            {
                entry: 'test.txt',
                type: 'FILE',
            },
        ];

        sendMessage.mockResolvedValue(entries);

        const result = await filesystem.readDirectory('/tmp', {
            recursive: true,
        });

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.readDirectory',
            {
                path: '/tmp',
                recursive: true,
            },
        );

        expect(result).toEqual(entries);
    });

    it('calls filesystem.copy with options', async () => {
        sendMessage.mockResolvedValue(undefined);

        await filesystem.copy(
            '/tmp/source.txt',
            '/tmp/destination.txt',
            { overwrite: true },
        );

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.copy',
            {
                source: '/tmp/source.txt',
                destination: '/tmp/destination.txt',
                overwrite: true,
            },
        );
    });

    it('calls filesystem.move', async () => {
        sendMessage.mockResolvedValue(undefined);

        await filesystem.move(
            '/tmp/source.txt',
            '/tmp/destination.txt',
        );

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.move',
            {
                source: '/tmp/source.txt',
                destination: '/tmp/destination.txt',
            },
        );
    });

    it('calls filesystem.getStats', async () => {
        const stats = {
            size: 100,
        };

        sendMessage.mockResolvedValue(stats);

        const result = await filesystem.getStats('/tmp/test.txt');

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.getStats',
            { path: '/tmp/test.txt' },
        );

        expect(result).toEqual(stats);
    });

    it('calls filesystem.getAbsolutePath', async () => {
        sendMessage.mockResolvedValue('/tmp/test.txt');

        const result = await filesystem.getAbsolutePath('test.txt');

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.getAbsolutePath',
            { path: 'test.txt' },
        );

        expect(result).toBe('/tmp/test.txt');
    });

    it('calls filesystem.getRelativePath', async () => {
        sendMessage.mockResolvedValue('test.txt');

        const result = await filesystem.getRelativePath(
            '/tmp/test.txt',
            '/tmp',
        );

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.getRelativePath',
            {
                path: '/tmp/test.txt',
                base: '/tmp',
            },
        );

        expect(result).toBe('test.txt');
    });

    it('calls filesystem.getJoinedPath', async () => {
        sendMessage.mockResolvedValue('/tmp/test.txt');

        const result = await filesystem.getJoinedPath(
            '/tmp',
            'test.txt',
        );

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.getJoinedPath',
            {
                paths: ['/tmp', 'test.txt'],
            },
        );

        expect(result).toBe('/tmp/test.txt');
    });

    it('calls filesystem.getNormalizedPath', async () => {
        sendMessage.mockResolvedValue('/tmp/test.txt');

        const result = await filesystem.getNormalizedPath(
            '/tmp/./test.txt',
        );

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.getNormalizedPath',
            {
                path: '/tmp/./test.txt',
            },
        );

        expect(result).toBe('/tmp/test.txt');
    });

    it('calls filesystem.getUnnormalizedPath', async () => {
        sendMessage.mockResolvedValue('/tmp/./test.txt');

        const result = await filesystem.getUnnormalizedPath(
            '/tmp/test.txt',
        );

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.getUnnormalizedPath',
            {
                path: '/tmp/test.txt',
            },
        );

        expect(result).toBe('/tmp/./test.txt');
    });

    it('calls filesystem.access', async () => {
        sendMessage.mockResolvedValue('OK');

        const result = await filesystem.access('/tmp/test.txt', 4);

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.access',
            {
                path: '/tmp/test.txt',
                mode: 4,
            },
        );

        expect(result).toBe('OK');
    });

    it('calls filesystem.chmod', async () => {
        sendMessage.mockResolvedValue('OK');

        const result = await filesystem.chmod('/tmp/test.txt', 644);

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.chmod',
            {
                path: '/tmp/test.txt',
                mode: 644,
            },
        );

        expect(result).toBe('OK');
    });

    it('calls filesystem.chown', async () => {
        sendMessage.mockResolvedValue('OK');

        const result = await filesystem.chown(
            '/tmp/test.txt',
            1000,
            1000,
        );

        expect(sendMessage).toHaveBeenCalledWith(
            'filesystem.chown',
            {
                path: '/tmp/test.txt',
                uid: 1000,
                gid: 1000,
            },
        );

        expect(result).toBe('OK');
    });
});