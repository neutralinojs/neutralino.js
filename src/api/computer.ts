import { sendMessage } from '../ws/websocket';
import type {
    MemoryInfo,
    KernelInfo,
    OSInfo,
    CPUInfo,
    Display,
    MousePosition
} from '../types/api/computer';

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

export function getCPUInfo(): Promise<CPUInfo> {
    return sendMessage('computer.getCPUInfo');
};

export function getDisplays(): Promise<Display[]> {
    return sendMessage('computer.getDisplays');
};

export function getMousePosition(): Promise<MousePosition> {
    return sendMessage('computer.getMousePosition');
};
