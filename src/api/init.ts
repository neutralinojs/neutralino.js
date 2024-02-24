import { version } from '../../package.json';
import * as websocket from '../ws/websocket';
import * as debug from './debug';
import * as events from './events';

let initialized = false;

export interface InitOptions {
  exportCustomMethods?: boolean;
}

export function init(options: InitOptions = {}): void {
  options = { exportCustomMethods: true, ...options };

  if (initialized) {
    return;
  }

  websocket.init();

  if (window.NL_ARGS.find((arg) => arg == '--neu-dev-auto-reload')) {
    events.on('neuDev_reloadApp', async () => {
      await debug.log('Reloading the application...');
      location.reload();
    });
  }

  if (
    options.exportCustomMethods &&
    window.NL_CMETHODS &&
    window.NL_CMETHODS.length > 0
  ) {
    for (let method of window.NL_CMETHODS) {
      Neutralino.custom[method] = (...args) => {
        let data = {};
        for (let [argi, argv] of args.entries()) {
          if (typeof argv == 'object' && !Array.isArray(argv) && argv != null) {
            data = { ...data, ...argv };
          } else {
            data = { ...data, ['arg' + argi]: argv };
          }
        }
        return websocket.sendMessage('custom.' + method, data);
      };
    }
  }

  window.NL_CVERSION = version;
  window.NL_CCOMMIT = '<git_commit_hash_latest>'; // only the build server will update this
  initialized = true;
}
