import { sendMessage } from '../ws/websocket';
import { base64ToBytesArray } from '../helpers';
import { Stats } from '../types/api/resources';

export async function getFiles(): Promise<string[]> {
    return await sendMessage('resources.getFiles');
}

export async function getStats(path: string): Promise<Stats> {
    return await sendMessage('resources.getStats', { path });
}

export async function extractFile(path: string, destination: string): Promise<void> {
    return await sendMessage('resources.extractFile', { path, destination });
}

export async function extractDirectory(path: string, destination: string): Promise<void> {
    return await sendMessage('resources.extractDirectory', { path, destination });
}

export async function readFile(path: string): Promise<string> {
    return await sendMessage('resources.readFile', { path });
}

export async function readBinaryFile(path: string): Promise<ArrayBuffer> {
    return new Promise((resolve: any, reject: any) => {
        sendMessage('resources.readBinaryFile', { path })
        .then((base64Data: string) => {
            resolve(base64ToBytesArray(base64Data));
        })
        .catch((error: any) => {
            reject(error);
        });
    });
}
