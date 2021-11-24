import * as websocket from '../ws/websocket';
import * as devClient from '../debug/devclient';
import { version } from '../../package.json';

export function init() {

    // Notify about already connect extensions and newly connected extensions
    Neutralino.events.on("ready", async () => {
        let stats = await Neutralino.extensions.getStats();
        for(let extension of stats.connected) {
            await Neutralino.events.dispatch("extensionReady", extension);
        }

        Neutralino.events.on("extClientConnect", async (evt) => {
            await Neutralino.events.dispatch("extensionReady", evt.detail);
        });
    });

    websocket.init();

    if(window.NL_ARGS.find((arg) => arg == '--debug-mode')) {
        devClient.startAsync();
    }

    window.NL_CVERSION = version;
}
