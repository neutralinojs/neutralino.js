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

export async function createDirectory(path: string): Promise<void> {
    return await sendMessage('filesystem.createDirectory', { path });
}

export async function remove(path: string): Promise<void> {
    return await sendMessage('filesystem.remove', { path });
}

export async function writeFile(path: string, data: string): Promise<void> {
    return await sendMessage('filesystem.writeFile', { path, data });
}

export async function appendFile(path: string, data: string): Promise<void> {
    return await sendMessage('filesystem.appendFile', { path, data });
}

export async function writeBinaryFile(path: string, data: ArrayBuffer): Promise<void> {
    return await sendMessage('filesystem.writeBinaryFile', {
        path,
        data: arrayBufferToBase64(data)
    });
}

export async function appendBinaryFile(path: string, data: ArrayBuffer): Promise<void> {
    return await sendMessage('filesystem.appendBinaryFile', {
        path,
        data: arrayBufferToBase64(data)
    });
}

export async function readFile(path: string, options?: FileReaderOptions): Promise<string> {
    return await sendMessage('filesystem.readFile', { path, ...options });
}

export async function readBinaryFile(path: string, options?: FileReaderOptions): Promise<ArrayBufferLike> {
    const base64Data = await sendMessage(
        'filesystem.readBinaryFile',
        { path, ...options }
    );
    return base64ToBytesArray(base64Data);
}

export async function openFile(path: string): Promise<number> {
    return await sendMessage('filesystem.openFile', { path });
}

export async function createWatcher(path: string): Promise<number> {
    return await sendMessage('filesystem.createWatcher', { path });
}

export async function removeWatcher(id: number): Promise<number> {
    return await sendMessage('filesystem.removeWatcher', { id });
}

export async function getWatchers(): Promise<Watcher[]> {
    return await sendMessage('filesystem.getWatchers');
}

export async function updateOpenedFile(id: number, event: string, data?: any): Promise<void> {
    return await sendMessage('filesystem.updateOpenedFile', { id, event, data });
}

export async function getOpenedFileInfo(id: number): Promise<OpenedFile> {
    return await sendMessage('filesystem.getOpenedFileInfo', { id });
}

export async function readDirectory(path: string, options?: DirectoryReaderOptions): Promise<DirectoryEntry[]> {
    return await sendMessage('filesystem.readDirectory', { path, ...options });
}

export async function copy(source: string, destination: string, options?: CopyOptions ): Promise<void> {
    return await sendMessage('filesystem.copy', { source, destination, ...options } );
}

export async function move(source: string, destination: string): Promise<void> {
    return await sendMessage('filesystem.move', { source, destination });
}

export async function getStats(path: string): Promise<Stats> {
    return await sendMessage('filesystem.getStats', { path });
}

export async function getAbsolutePath(path: string): Promise<string> {
    return await sendMessage('filesystem.getAbsolutePath', { path });
}

export async function getRelativePath(path: string, base?: string): Promise<string> {
    return await sendMessage('filesystem.getRelativePath', { path, base });
}

export async function getPathParts(path: string): Promise<PathParts> {
    return await sendMessage('filesystem.getPathParts', { path });
}

export async function getPermissions(path: string): Promise<Permissions> {
    return await sendMessage('filesystem.getPermissions', { path });
}

export async function setPermissions(path: string, permissions: Permissions, mode: PermissionsMode): Promise<void> {
    return await sendMessage('filesystem.setPermissions', { path, ...permissions, mode });
}

export async function getJoinedPath(...paths: string[]): Promise<string> {
    return await sendMessage('filesystem.getJoinedPath', { paths });
}

export async function getNormalizedPath(path: string): Promise<string> {
    return await sendMessage('filesystem.getNormalizedPath', { path });
}

export async function getUnnormalizedPath(path: string): Promise<string> {
    return await sendMessage('filesystem.getUnnormalizedPath', { path });
}

export async function access(path: string, mode?: number): Promise<string> {
    return await sendMessage('filesystem.access', { path, mode });
}

export async function chmod(path: string, mode: number): Promise<string> {
    return await sendMessage('filesystem.chmod', { path, mode });
}

export async function chown(path: string, uid: number, gid: number): Promise<string> {
    return await sendMessage('filesystem.chown', { path, uid, gid });
}
