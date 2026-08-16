import { sendMessage } from '../ws/websocket';

export async function mount(path: string, target: string): Promise<void> {
    return await sendMessage('server.mount', { path, target });
}

export async function unmount(path: string): Promise<void> {
    return await sendMessage('server.unmount', { path });
}

export async function getMounts(): Promise<Record<string, string>> {
    return await sendMessage('server.getMounts');
}
