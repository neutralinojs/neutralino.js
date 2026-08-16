import { sendMessage } from '../ws/websocket';
import type { LoggerType } from '../types/enums';

export async function log(message: string, type?: LoggerType): Promise<void> {
    return await sendMessage('debug.log', { message, type });
}
