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

export function setMousePosition(x: number, y: number): Promise<void> {
    return sendMessage('computer.setMousePosition', { x, y });
}

export function setMouseGrabbing(grabbing: boolean): Promise<void> {
    return sendMessage('computer.setMouseGrabbing', { grabbing });
}

export function sendKey(keyCode: number, up: boolean): Promise<void> {
    return sendMessage('computer.sendKey', { keyCode, up });
}
