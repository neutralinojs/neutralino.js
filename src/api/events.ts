import { sendMessage } from '../ws/websocket';

export * from '../browser/events';

export function broadcast(event: string, data?: any): Promise<any> {
    return sendMessage('events.broadcast', {event, data});
};
