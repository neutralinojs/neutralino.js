import * as websocket from '../ws/websocket';
import type { ExtensionStats } from '../types/api/extensions';

export async function dispatch(
    extensionId: string,
    event: string,
    data?: unknown,
): Promise<void> {
    const stats = await getStats();

    if (!stats.loaded.includes(extensionId)) {
        throw {
            code: 'NE_EX_EXTNOTL',
            message: `${extensionId} is not loaded`,
        };
    }

    if (stats.connected.includes(extensionId)) {
        await websocket.sendMessage('extensions.dispatch', {
            extensionId,
            event,
            data,
        });
    } else {
        await new Promise<void>((resolve, reject) => {
            websocket.sendWhenExtReady(extensionId, {
                method: 'extensions.dispatch',
                data: { extensionId, event, data },
                resolve: () => resolve(),
                reject,
            });
        });
    }
}

export function broadcast(event: string, data?: unknown): Promise<void> {
    return websocket.sendMessage('extensions.broadcast', { event, data });
}

export function getStats(): Promise<ExtensionStats> {
    return websocket.sendMessage('extensions.getStats');
}
