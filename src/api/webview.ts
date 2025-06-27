import { sendMessage } from '../ws/websocket';

export function print(): Promise<void> {
    return sendMessage('webview.print');
};
