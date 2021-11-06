import { sendMessage } from '../ws/websocket';

export function dispatch(extensionId: string, event: string, data?: any): Promise<any> {
    return sendMessage('extensions.dispatch', {extensionId, event, data});
};

export function broadcast(event: string, data?: any): Promise<any> {
    return sendMessage('extensions.broadcast', {event, data});
};
