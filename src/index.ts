import type { Architecture, Mode, OperatingSystem } from './types/enums';

declare global {
interface Window {
    // --- globals ---
    /** Mode of the application: window, browser, cloud, or chrome */
    NL_MODE: Mode;
    /** Application port */
    NL_PORT: number;
    /** Command-line arguments */
    NL_ARGS: string[];
    /** Basic authentication token */
    NL_TOKEN: string;
    /** Neutralinojs client version */
    NL_CVERSION: string;
    /** Application identifier */
    NL_APPID: string;
    /** Application version */
    NL_APPVERSION: string;
    /** Application path */
    NL_PATH: string;
    /** Returns true if extensions are enabled */
    NL_EXTENABLED: boolean;
    /** Operating system name: Linux, Windows, Darwin, FreeBSD, or Uknown */
    NL_OS: OperatingSystem;
    /** CPU architecture: x64, arm, itanium, ia32, or unknown */
    NL_ARCH: Architecture;
    /** Neutralinojs server version */
    NL_VERSION: string;
    /** Current working directory */
    NL_CWD: string;
    /** Identifier of the current process */
    NL_PID: string;
    /** Source of application resources: bundle or directory */
    NL_RESMODE: string;
    /** Release commit of the client library */
    NL_CCOMMIT: string;
    /** An array of custom methods */
    NL_CMETHODS: string[];
    // --- globals ---
}
     /** Neutralino global object for custom methods **/
    const Neutralino: any;
}

export * as filesystem from './api/filesystem';
export * as os from './api/os';
export * as computer from './api/computer';
export * as storage from './api/storage';
export * as debug from './api/debug';
export * as app from './api/app';
export * as window from './api/window';
export * as events from './api/events';
export * as extensions from './api/extensions';
export * as updater from './api/updater';
export * as clipboard from './api/clipboard';
export * as resources from './api/resources';
export * as custom from './api/custom';

export { init } from './api/init';

export type * from './types/api/protocol';
export type * from './types/api/app';
export type * from './types/api/computer';
export type * from './types/api/clipboard';
export type * from './types/api/extensions';
export type * from './types/api/filesystem';
export type * from './types/api/init';
export type * from './types/api/os';
export type * from './types/api/updater';
export type * from './types/api/window';
export type * from './types/enums';
export type * from './types/events';
