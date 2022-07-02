import { sendMessage } from '../ws/websocket';

export interface MemoryInfo {
    total: number;
    available: number;
}

export interface KernelInfo {
    variant: string;
    version: string;
}

export interface OSInfo {
    name: string;
    description: string;
    version: string;
}

export interface Display {
    id: number;
    resolution: Resolution;
    dpi: number;
    bpp: number;
    refreshRate: number;
}

interface Resolution {
    width: number;
    height: number;
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

export function getOSInfo(): Promise<OSInfo> {
    return sendMessage('computer.getOSInfo');
};

export function getDisplays(): Promise<Display[]> {
    return sendMessage('computer.getDisplays');
};
