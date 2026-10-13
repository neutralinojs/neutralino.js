import { sendMessage } from '../ws/websocket';
import type { SuccessResponse } from '../types/api/protocol';

export function mount(path: string, target: string): Promise<SuccessResponse> {
    return sendMessage('server.mount', { path, target });
}

export function unmount(path: string): Promise<SuccessResponse> {
    return sendMessage('server.unmount', { path });
}

export function getMounts(): Promise<Record<string, string>> {
    return sendMessage('server.getMounts');
}