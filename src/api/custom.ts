import { sendMessage } from '../ws/websocket';

export async function getMethods(): Promise<string[]> {
    return await sendMessage('custom.getMethods');
};
