import { sendMessage } from '../ws/websocket';
import type { LoggerType } from '../types/enums';
import type { SuccessResponse } from '../types/api/protocol';

export function log(message: string, type?: LoggerType): Promise<SuccessResponse> {
    return sendMessage('debug.log', { message, type });
};
