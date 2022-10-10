import { sendMessage } from '../ws/websocket';

export function getMethods(): Promise<string[]> {
    return sendMessage('custom.getMethods');
};
