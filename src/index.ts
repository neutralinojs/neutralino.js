export * as filesystem from './api/filesystem';
export * as os from './api/os';
export * as computer from './api/computer';
export * as storage from './api/storage';
export * as debug from './api/debug';
export * as app from './api/app';
export * as window from './api/window';

export { init } from './api/init';

declare global {
    interface Window {
        NL_MODE: string;
        NL_PORT: number;
        NL_ARGS: string[];
        NL_TOKEN: string;
        NL_CVERSION: string;
    }
}
