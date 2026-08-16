import { sendMessage } from '../ws/websocket';

export * from '../browser/events';

export async function broadcast(event: string, data?: any): Promise<void> {
    return await sendMessage('events.broadcast', {event, data});
}
