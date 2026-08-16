import * as websocket from '../ws/websocket';
import type { ExtensionStats } from '../types/api/extensions';
import { NeutralinoApiError } from '../types/errors';

export async function dispatch(extensionId: string, event: string, data?: any): Promise<void> {
    const stats = await getStats();
    if (!stats.loaded.includes(extensionId)) {
        throw new NeutralinoApiError({
            code: 'NE_EX_EXTNOTL',
            message: `${extensionId} is not loaded`,
        });
    } else if (stats.connected.includes(extensionId)) {
        return await websocket.sendMessage('extensions.dispatch', {
            extensionId,
            event,
            data,
        });
    } else {
        // loaded but not connected yet.
        return await new Promise((resolve, reject) => {
            websocket.sendWhenExtReady(extensionId, {
                method: 'extensions.dispatch',
                data: { extensionId, event, data },
                resolve,
                reject,
            });
        });
    }
}

export async function broadcast(event: string, data?: any): Promise<void> {
    return await websocket.sendMessage('extensions.broadcast', {event, data});
}

export async function getStats(): Promise<ExtensionStats> {
    return await websocket.sendMessage('extensions.getStats');
}
