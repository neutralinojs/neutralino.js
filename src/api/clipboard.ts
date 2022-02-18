import { sendMessage } from '../ws/websocket';

export function readText(key: string, data: string): Promise<void> {
    return sendMessage('clipboard.readText', { key, data });

};

export function writeText(data: string): Promise<string> {
    return sendMessage('clipboard.writeText', { data });
};
