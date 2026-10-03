import { sendMessage } from '../ws/websocket';

export * from '../browser/events';

export function broadcast(event: string, data?: unknown): Promise<void> {
    return sendMessage('events.broadcast', { event, data });
}
