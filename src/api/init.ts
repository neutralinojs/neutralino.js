import { version } from '../../package.json';
import * as websocket from '../ws/websocket';
import * as debug from './debug';
import * as events from './events';

let initialized = false;

export function init(): void {
    if(initialized) {
        return;
    }

    websocket.init();

    if(window.NL_ARGS.find((arg) => arg == '--neu-dev-auto-reload')) {
        events.on('neuDev_reloadApp', async () => {
            await debug.log('Reloading the application...');
            location.reload();
        });
    }

    window.NL_CVERSION = version;
    window.NL_CCOMMIT = '<git_commit_hash_latest>'; // only the build server will update this
    initialized = true;
}
