import { sendMessage } from '../ws/websocket';

export function mount(path: string, target: string): Promise<void> {
    return sendMessage('server.mount', { path, target });
}

export function unmount(path: string): Promise<void> {
    return sendMessage('server.unmount', { path });
}

export function getMounts(): Promise<void> {
    return sendMessage('server.getMounts');
}

export function setVDocRoot(path: string): Promise<void> {
    return sendMessage('server.setVDocRoot', { path });
}
