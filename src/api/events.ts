import { sendMessage } from '../ws/websocket';
import type { SuccessResponse } from '../types/api/protocol';

export * from '../browser/events';

export function broadcast(event: string, data?: any): Promise<SuccessResponse> {
    return sendMessage('events.broadcast', {event, data});
};
