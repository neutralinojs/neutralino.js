import * as websocket from '../ws/websocket';
import { version } from '../../package.json';

let initialized = false;

export function init(): void {
    if(initialized) {
        return;
    }

    websocket.init();

    if(window.NL_ARGS.find((arg) => arg == '--neu-dev-auto-reload')) {
        Neutralino.events.on('neuDev_reloadApp', async () => {
            await Neutralino.debug.log('Reloading the application...');
            location.reload();
        });
    }

    window.NL_CVERSION = version;
    initialized = true;
}

export function isInitialized(): boolean {
    return initialized;
}