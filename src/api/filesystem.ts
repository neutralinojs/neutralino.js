import { sendMessage } from '../ws/websocket';

export interface DirectoryEntry {
    entry: string;
    type: string;
}

export interface Stats {
    size: number;
    isFile: boolean;
    isDirectory: boolean;
}

export function createDirectory(path: string): Promise<void> {
    return sendMessage('filesystem.createDirectory', { path });
};

export function removeDirectory(path: string): Promise<void> {
    return sendMessage('filesystem.removeDirectory', { path });
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

export function readFile(path: string): Promise<string> {
    return sendMessage('filesystem.readFile', { path });
};

export function readBinaryFile(path: string): Promise<ArrayBuffer> {
    return new Promise((resolve: any, reject: any) => {
        sendMessage('filesystem.readBinaryFile', { path })
        .then((base64Data: string) => {
            let binaryData: string = window.atob(base64Data);
            let len: number = binaryData.length;
            let bytes: Uint8Array = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryData.charCodeAt(i);
            }
            resolve(bytes.buffer);
        })
        .catch((error: any) => {
            reject(error);
        });
    });
};

export function removeFile(path: string): Promise<void> {
    return sendMessage('filesystem.removeFile', { path });
};

export function readDirectory(path: string): Promise<DirectoryEntry[]> {
    return sendMessage('filesystem.readDirectory', { path });
};

export function copyFile(source: string, destination: string): Promise<void> {
    return sendMessage('filesystem.copyFile', { source, destination } );
};

export function moveFile(source: string, destination: string): Promise<void> {
    return sendMessage('filesystem.moveFile', { source, destination });
};

export function getStats(path: string): Promise<Stats> {
    return sendMessage('filesystem.getStats', { path });
};

function arrayBufferToBase64(data: ArrayBuffer): string {
    let bytes: Uint8Array = new Uint8Array(data);
    let asciiStr: string = '';

    for(let byte of bytes) {
        asciiStr += String.fromCharCode(byte);
    }

    return window.btoa(asciiStr);
};


