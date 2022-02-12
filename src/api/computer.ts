import { sendMessage } from '../ws/websocket';

export interface MemoryInfo {
    total: number;
    available: number;
}

export function getMemoryInfo(): Promise<MemoryInfo> {
    return sendMessage('computer.getMemoryInfo');
};
