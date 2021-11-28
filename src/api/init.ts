import * as websocket from '../ws/websocket';
import * as devClient from '../debug/devclient';
import { version } from '../../package.json';

let initialized = false;

export function init() {
    if(initialized) {
        return;
    }

    websocket.init();

    if(window.NL_ARGS.find((arg) => arg == '--debug-mode')) {
        devClient.startAsync();
    }

    window.NL_CVERSION = version;
    initialized = true;
}
