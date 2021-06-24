import { ping } from '../ping/ping';
import { devClient } from '../debug/devclient';
import { version } from '../../package.json';

export function init() {
    if(window.NL_MODE && window.NL_MODE == 'browser')
        ping.start();

    if(typeof window.NL_ARGS != "undefined") {
        for(let i = 0; i < window.NL_ARGS.length; i++) {
            if(window.NL_ARGS[i] == '--debug-mode') {
                devClient.start();
                break;
            }
        }
    }
    
    window.NL_CVERSION = version;
}
