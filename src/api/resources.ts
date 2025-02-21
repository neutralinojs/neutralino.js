import { sendMessage } from '../ws/websocket';
import { base64ToBytesArray } from '../helpers';
import { Stats } from '../types/api/resources';

export function getFiles(): Promise<string[]> {
    return sendMessage('resources.getFiles');
};

export function getStats(path: string): Promise<Stats> {
    return sendMessage('resources.getStats', { path });
};

export function extractFile(path: string, destination: string): Promise<void> {
    return sendMessage('resources.extractFile', { path, destination });
};

export function extractDirectory(path: string, destination: string): Promise<void> {
    return sendMessage('resources.extractDirectory', { path, destination });
};

export function readFile(path: string): Promise<string> {
    return sendMessage('resources.readFile', { path });
};

export function readBinaryFile(path: string): Promise<ArrayBuffer> {
    return new Promise((resolve: any, reject: any) => {
        sendMessage('resources.readBinaryFile', { path })
        .then((base64Data: string) => {
            resolve(base64ToBytesArray(base64Data));
        })
        .catch((error: any) => {
            reject(error);
        });
    });
};
