import { sendMessage } from '../ws/websocket';
import { base64ToBytesArray, arrayBufferToBase64 } from '../helpers';
import type {
    DirectoryEntry,
    DirectoryReaderOptions,
    FileReaderOptions,
    CopyOptions,
    OpenedFile,
    Stats,
    Watcher
} from '../types/api/filesystem';

export function createDirectory(path: string): Promise<void> {
    return sendMessage('filesystem.createDirectory', { path });
};

export function remove(path: string): Promise<void> {
    return sendMessage('filesystem.remove', { path });
};

export function writeFile(path: string, data: string): Promise<void> {
    return sendMessage('filesystem.writeFile', { path, data });
};

export function appendFile(path: string, data: string): Promise<void> {
    return sendMessage('filesystem.appendFile', { path, data });
};

export function writeBinaryFile(path: string, data: ArrayBuffer): Promise<void> {
    return sendMessage('filesystem.writeBinaryFile', {
        path,
        data: arrayBufferToBase64(data)
    });
};

export function appendBinaryFile(path: string, data: ArrayBuffer): Promise<void> {
    return sendMessage('filesystem.appendBinaryFile', {
        path,
        data: arrayBufferToBase64(data)
    });
};

export function readFile(path: string, options?: FileReaderOptions): Promise<string> {
    return sendMessage('filesystem.readFile', { path, ...options });
};

export function readBinaryFile(path: string, options?: FileReaderOptions): Promise<ArrayBuffer> {
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
    return sendMessage('filesystem.openFile', { path });
};

export function createWatcher(path: string): Promise<number> {
    return sendMessage('filesystem.createWatcher', { path });
};

export function removeWatcher(id: number): Promise<number> {
    return sendMessage('filesystem.removeWatcher', { id });
};

export function getWatchers(): Promise<Watcher[]> {
    return sendMessage('filesystem.getWatchers');
};

export function updateOpenedFile(id: number, event: string, data?: any): Promise<void> {
    return sendMessage('filesystem.updateOpenedFile', { id, event, data });
};

export function getOpenedFileInfo(id: number): Promise<OpenedFile> {
    return sendMessage('filesystem.getOpenedFileInfo', { id });
};

export function readDirectory(path: string, options?: DirectoryReaderOptions): Promise<DirectoryEntry[]> {
    return sendMessage('filesystem.readDirectory', { path, ...options });
};

export function copy(source: string, destination: string, options?: CopyOptions ): Promise<void> {
    return sendMessage('filesystem.copy', { source, destination, ...options } );
};

export function move(source: string, destination: string): Promise<void> {
    return sendMessage('filesystem.move', { source, destination });
};

export function getStats(path: string): Promise<Stats> {
    return sendMessage('filesystem.getStats', { path });
};

export function getAbsPath(path: string): Promise<string> {
    return sendMessage('filesystem.getAbsPath', { path });
};
