import * as websocket from '../ws/websocket';
import * as devClient from '../debug/devclient';
import { version } from '../../package.json';

export function init() {
    websocket.init();

    if(typeof window.NL_ARGS != 'undefined') {
        for(let i = 0; i < window.NL_ARGS.length; i++) {
            if(window.NL_ARGS[i] == '--debug-mode') {
                devClient.startAsync();
                break;
            }
        }
    }

    window.NL_CVERSION = version;
}
