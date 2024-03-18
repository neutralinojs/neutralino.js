import { sendMessage } from '../ws/websocket';
import type { LoggerType } from '../../types/enums';

export function log(message: string, type?: LoggerType): Promise<void> {
    return sendMessage('debug.log', { message, type });
};
