import { sendMessage } from '../ws/websocket';

export function getFiles(): Promise<void> {
    return sendMessage('resources.getFiles');
};
