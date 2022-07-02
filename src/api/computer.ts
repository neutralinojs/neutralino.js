import { sendMessage } from '../ws/websocket';

export interface MemoryInfo {
    total: number;
    available: number;
}

export interface KernelInfo {
    variant: string;
    version: string;
}

export function getMemoryInfo(): Promise<MemoryInfo> {
    return sendMessage('computer.getMemoryInfo');
};

export function getArch(): Promise<string> {
    return sendMessage('computer.getArch');
};

export function getKernelInfo(): Promise<KernelInfo> {
    return sendMessage('computer.getKernelInfo');
};
