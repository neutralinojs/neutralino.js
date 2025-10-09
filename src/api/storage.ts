import { sendMessage } from '../ws/websocket';

export function setData(key: string, data: string | null): Promise<void> {
    return sendMessage('storage.setData', { key, data });
};

export function getData(key: string): Promise<string> {
    return sendMessage('storage.getData', { key });
};

export function removeData(key: string): Promise<void> {
    return sendMessage('storage.removeData', { key });
};

export function getKeys(): Promise<string[]> {
    return sendMessage('storage.getKeys');
};

export function clear(): Promise<void> {
    return sendMessage('storage.clear');
};
