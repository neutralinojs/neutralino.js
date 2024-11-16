import { sendMessage } from '../ws/websocket';

export function setData(key: string, data: string): Promise<void> {
    return sendMessage('storage.setData', { key: key.toLowerCase(), data });
}

export function getData(key: string): Promise<string> {
    return sendMessage('storage.getData', { key: key.toLowerCase() });
}

export function getKeys(): Promise<string[]> {
    return sendMessage('storage.getKeys');
};
