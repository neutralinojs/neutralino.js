import { sendMessage } from '../ws/websocket';
import type { SuccessResponse } from '../types/api/protocol';

export function setData(key: string, data?: string | null): Promise<SuccessResponse> {
    const payload: Record<string, unknown> = { key };
    if (data != null) payload.data = data;
    return sendMessage('storage.setData', payload);
};

export function getData(key: string): Promise<string> {
    return sendMessage('storage.getData', { key });
};

export function removeData(key: string): Promise<SuccessResponse> {
    return sendMessage('storage.removeData', { key });
};

export function getKeys(): Promise<string[]> {
    return sendMessage('storage.getKeys');
};

export function clear(): Promise<SuccessResponse> {
    return sendMessage('storage.clear');
};
