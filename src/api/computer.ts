import { sendMessage } from '../ws/websocket';
import type {
    MemoryInfo,
    KernelInfo,
    OSInfo,
    CPUInfo,
    Display,
    Disk,
    MousePosition,
    NetworkInterfaceInfo
} from '../types/api/computer';
import type { SendKeyState } from '../types/enums';

export async function getMemoryInfo(): Promise<MemoryInfo> {
    return await sendMessage('computer.getMemoryInfo');
}

export async function getArch(): Promise<string> {
    return await sendMessage('computer.getArch');
}

export async function getKernelInfo(): Promise<KernelInfo> {
    return await sendMessage('computer.getKernelInfo');
}

export async function getOSInfo(): Promise<OSInfo> {
    return await sendMessage('computer.getOSInfo');
}

export async function getCPUInfo(): Promise<CPUInfo> {
    return await sendMessage('computer.getCPUInfo');
}

export async function getDisplays(): Promise<Display[]> {
    return await sendMessage('computer.getDisplays');
}

export async function getDisks(): Promise<Disk> {
    return await sendMessage('computer.getDisks');
}

export async function getHostname(): Promise<string> {
    return await sendMessage('computer.getHostname');
}

export async function getMousePosition(): Promise<MousePosition> {
    return await sendMessage('computer.getMousePosition');
}

export async function setMousePosition(x: number, y: number): Promise<void> {
    return await sendMessage('computer.setMousePosition', { x, y });
}

export async function setMouseGrabbing(grabbing: boolean): Promise<void> {
    return await sendMessage('computer.setMouseGrabbing', { grabbing });
}

export async function sendKey(key: number, state: SendKeyState): Promise<void> {
    return await sendMessage('computer.sendKey', { key, state });
}

export async function getNetworkInterfaces(): Promise<NetworkInterfaceInfo> {
    return await sendMessage('computer.getNetworkInterfaces');
}

export async function getMachineId(): Promise<string> {
    return await sendMessage('computer.getMachineId');
}
