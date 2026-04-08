import { sendMessage } from '../ws/websocket';
import { base64ToBytesArray, arrayBufferToBase64 } from '../helpers';
import type {
    DirectoryEntry,
    DirectoryReaderOptions,
    FileReaderOptions,
    CopyOptions,
    OpenedFile,
    Stats,
    Watcher,
    PathParts,
    Permissions,
    PermissionsMode,
} from '../types/api/filesystem';


function rejectInvalidParam(message: string): Promise<any> {
    return Promise.reject({
        code: 'NE_RT_INVPARM',
        message: message
    });
}

export function createDirectory(path: string): Promise<void> {
    if (typeof path !== 'string' || !path) return rejectInvalidParam('Directory path must be a non-empty string.');
    return sendMessage('filesystem.createDirectory', { path });
};

export function remove(path: string): Promise<void> {
    if (typeof path !== 'string' || !path) return rejectInvalidParam('Path must be a non-empty string.');
    return sendMessage('filesystem.remove', { path });
};

export function writeFile(path: string, data: string): Promise<void> {
    if (typeof path !== 'string' || typeof data !== 'string') {
        return rejectInvalidParam('Both path and data must be strings.');
    }
    return sendMessage('filesystem.writeFile', { path, data });
};

export function appendFile(path: string, data: string): Promise<void> {
    if (typeof path !== 'string' || typeof data !== 'string') {
        return rejectInvalidParam('Both path and data must be strings.');
    }
    return sendMessage('filesystem.appendFile', { path, data });
};

export function writeBinaryFile(path: string, data: ArrayBuffer): Promise<void> {
    if (typeof path !== 'string' || !(data instanceof ArrayBuffer)) {
        return rejectInvalidParam('Path must be a string and data must be an ArrayBuffer.');
    }
    return sendMessage('filesystem.writeBinaryFile', {
        path,
        data: arrayBufferToBase64(data)
    });
};

export function appendBinaryFile(path: string, data: ArrayBuffer): Promise<void> {
    if (typeof path !== 'string' || !(data instanceof ArrayBuffer)) {
        return rejectInvalidParam('Path must be a string and data must be an ArrayBuffer.');
    }
    return sendMessage('filesystem.appendBinaryFile', {
        path,
        data: arrayBufferToBase64(data)
    });
};

export function readFile(path: string, options?: FileReaderOptions): Promise<string> {
    if (typeof path !== 'string') return rejectInvalidParam('Path must be a string.');
    return sendMessage('filesystem.readFile', { path, ...options });
};

export function readBinaryFile(path: string, options?: FileReaderOptions): Promise<ArrayBuffer> {
    if (typeof path !== 'string') return rejectInvalidParam('Path must be a string.');
    return new Promise((resolve: any, reject: any) => {
        sendMessage('filesystem.readBinaryFile', { path, ...options })
        .then((base64Data: string) => {
            resolve(base64ToBytesArray(base64Data));
        })
        .catch((error: any) => {
            reject(error);
        });
    });
};

export function openFile(path: string): Promise<number> {
    if (typeof path !== 'string') return rejectInvalidParam('Path must be a string.');
    return sendMessage('filesystem.openFile', { path });
};

export function createWatcher(path: string): Promise<number> {
    if (typeof path !== 'string') return rejectInvalidParam('Path must be a string.');
    return sendMessage('filesystem.createWatcher', { path });
};

export function removeWatcher(id: number): Promise<number> {
    if (typeof id !== 'number') return rejectInvalidParam('Watcher ID must be a number.');
    return sendMessage('filesystem.removeWatcher', { id });
};

export function getWatchers(): Promise<Watcher[]> {
    return sendMessage('filesystem.getWatchers');
};

export function updateOpenedFile(id: number, event: string, data?: any): Promise<void> {
    if (typeof id !== 'number' || typeof event !== 'string') {
        return rejectInvalidParam('File ID must be a number and event must be a string.');
    }
    return sendMessage('filesystem.updateOpenedFile', { id, event, data });
};

export function getOpenedFileInfo(id: number): Promise<OpenedFile> {
    if (typeof id !== 'number') return rejectInvalidParam('File ID must be a number.');
    return sendMessage('filesystem.getOpenedFileInfo', { id });
};

export function readDirectory(path: string, options?: DirectoryReaderOptions): Promise<DirectoryEntry[]> {
    if (typeof path !== 'string') return rejectInvalidParam('Path must be a string.');
    return sendMessage('filesystem.readDirectory', { path, ...options });
};

export function copy(source: string, destination: string, options?: CopyOptions ): Promise<void> {
    if (typeof source !== 'string' || typeof destination !== 'string') {
        return rejectInvalidParam('Source and destination must be strings.');
    }
    return sendMessage('filesystem.copy', { source, destination, ...options } );
};

export function move(source: string, destination: string): Promise<void> {
    if (typeof source !== 'string' || typeof destination !== 'string') {
        return rejectInvalidParam('Source and destination must be strings.');
    }
    return sendMessage('filesystem.move', { source, destination });
};

export function getStats(path: string): Promise<Stats> {
    if (typeof path !== 'string') return rejectInvalidParam('Path must be a string.');
    return sendMessage('filesystem.getStats', { path });
};

export function getAbsolutePath(path: string): Promise<string> {
    if (typeof path !== 'string') return rejectInvalidParam('Path must be a string.');
    return sendMessage('filesystem.getAbsolutePath', { path });
};

export function getRelativePath(path: string, base?: string): Promise<string> {
    if (typeof path !== 'string') return rejectInvalidParam('Path must be a string.');
    return sendMessage('filesystem.getRelativePath', { path, base });
};

export function getPathParts(path: string): Promise<PathParts> {
    if (typeof path !== 'string') return rejectInvalidParam('Path must be a string.');
    return sendMessage('filesystem.getPathParts', { path });
};

export function getPermissions(path: string): Promise<Permissions> {
    if (typeof path !== 'string') return rejectInvalidParam('Path must be a string.');
    return sendMessage('filesystem.getPermissions', { path });
};

export function setPermissions(path: string, permissions: Permissions, mode: PermissionsMode): Promise<void> {
    if (typeof path !== 'string' || typeof permissions !== 'object') {
        return rejectInvalidParam('Path must be a string and permissions must be an object.');
    }
    return sendMessage('filesystem.setPermissions', { path, ...permissions, mode });
};

export function getJoinedPath(...paths: string[]): Promise<string> {
    if (paths.some(p => typeof p !== 'string')) return rejectInvalidParam('All paths must be strings.');
    return sendMessage('filesystem.getJoinedPath', { paths });
};

export function getNormalizedPath(path: string): Promise<string> {
    if (typeof path !== 'string') return rejectInvalidParam('Path must be a string.');
    return sendMessage('filesystem.getNormalizedPath', { path });
};

export function getUnnormalizedPath(path: string): Promise<string> {
    if (typeof path !== 'string') return rejectInvalidParam('Path must be a string.');
    return sendMessage('filesystem.getUnnormalizedPath', { path });
};