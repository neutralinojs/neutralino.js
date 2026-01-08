import { version } from '../../package.json';
import * as websocket from '../ws/websocket';
import * as debug from './debug';
import * as events from './events';
import type { InitOptions } from '../types/api/init';

let initialized = false;

export async function init(options: InitOptions = {}): Promise<void> {
    options = { exportCustomMethods: true ,...options };

    if(initialized) {
        return;
    }
    await waitForGlobals();

    websocket.init();

    if(window.NL_ARGS.find((arg) => arg == '--neu-dev-auto-reload')) {
        events.on('neuDev_reloadApp', async () => {
            await debug.log('Reloading the application...');
            location.reload();
        });
    }

    if(options.exportCustomMethods && window.NL_CMETHODS && window.NL_CMETHODS.length > 0) {
        for(const method of window.NL_CMETHODS) {
            Neutralino.custom[method] = (...args) => {
                let data = {};
                for(const [argi, argv] of args.entries()) {
                    if(typeof argv == 'object' && !Array.isArray(argv) && argv != null) {
                        data = {...data, ...argv};
                    }
                    else {
                        data = {...data, ['arg' + argi]: argv};
                    }
                }
                return websocket.sendMessage('custom.' + method, data);
            };
        }
    }

    window.NL_CVERSION = version;
    window.NL_CCOMMIT = '425c526c318342e0e5d0f17caceef2a53049eda4'; // only the build server will update this
    initialized = true;
}
async function waitForGlobals(): Promise<void> {
    const timeout = 5000; 
    const interval = 100;
    let elapsed = 0;

    return new Promise((resolve, reject) => {
        const check = () => {
            if (typeof window.NL_PORT !== 'undefined' && typeof window.NL_TOKEN !== 'undefined') {
                resolve();
                return;
            }

            if (elapsed >= timeout) {
                reject(new Error("Neutralinojs: Initialization timeout. Native layer not ready."));
                return;
            }

            elapsed += interval;
            setTimeout(check, interval);
        };
        check();
    });
}
