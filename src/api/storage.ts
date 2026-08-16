import { sendMessage } from '../ws/websocket';

export async function setData(key: string, data: string | null): Promise<void> {
    return await sendMessage('storage.setData', { key, data });
}

export async function getData(key: string): Promise<string> {
    return await sendMessage('storage.getData', { key });
}

export async function removeData(key: string): Promise<void> {
    return await sendMessage('storage.removeData', { key });
}

export async function getKeys(): Promise<string[]> {
    return await sendMessage('storage.getKeys');
}

export async function clear(): Promise<void> {
    return await sendMessage('storage.clear');
}
