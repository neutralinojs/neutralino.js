import * as websocket from '../ws/websocket';
import * as devClient from '../debug/devclient';
import { version } from '../../package.json';

export function init() {
    if(window.NL_APPINIT) {
        return;
    }

    // Notify about already connect extensions and newly connected extensions
    Neutralino.events.on('ready', async () => {
        let stats = await Neutralino.extensions.getStats();

        Neutralino.events.on('extClientConnect', async (evt) => {
            await Neutralino.events.dispatch('extensionReady', evt.detail);
        });

        for(let extension of stats.connected) {
            await Neutralino.events.dispatch('extensionReady', extension);
        }
    });

    websocket.init();

    if(window.NL_ARGS.find((arg) => arg == '--debug-mode')) {
        devClient.startAsync();
    }

    window.NL_CVERSION = version;
    window.NL_APPINIT = true;
}
