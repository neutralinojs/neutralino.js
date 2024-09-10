import { sendMessage } from '../ws/websocket';

export function getFiles(): Promise<string[]> {
    return sendMessage('resources.getFiles');
};

export function extractFile(path: string, destination: string): Promise<void> {
    return sendMessage('resources.extractFile', { path, destination });
};
