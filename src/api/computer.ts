import { sendMessage } from '../ws/websocket';

export function getMemoryInfo(): Promise<any> {
    return sendMessage('computer.getMemoryInfo');
};
