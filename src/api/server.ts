import { sendMessage } from '../ws/websocket';

export interface Mount {
    source: string;
    isReadOnly: boolean;
}

export type Mounts = Record<string, Mount>;


export function mount(path: string, target: string): Promise<void> {
    return sendMessage('server.mount', { path, target });
}

export function unmount(path: string): Promise<void> {
    return sendMessage('server.unmount', { path });
}

export function getMounts(): Promise<Mounts> {
    return sendMessage('server.getMounts');
}
