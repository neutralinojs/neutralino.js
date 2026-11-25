// @ts-expect-error this does not interfere with bundling
import type { Architecture, Mode, OperatingSystem } from './types/enums';

declare global {
    // --- globals ---
    /** Mode of the application: window, browser, cloud, or chrome */
    const NL_MODE: Mode;
    /** Application port */
    const NL_PORT: number;
    /** Command-line arguments */
    const NL_ARGS: string[];
    /** Basic authentication token */
    const NL_TOKEN: string;
    /** Neutralinojs client version */
    const NL_CVERSION: string;
    /** Application identifier */
    const NL_APPID: string;
    /** Application version */
    const NL_APPVERSION: string;
    /** Application path */
    const NL_PATH: string;
    /** Application data path */
    const NL_DATAPATH: string;
    /** Returns true if extensions are enabled */
    const NL_EXTENABLED: boolean;
    /** Returns true if the client library is injected */
    const NL_GINJECTED: boolean;
    /** Returns true if globals are injected */
    const NL_CINJECTED: boolean;
    /** Operating system name: Linux, Windows, Darwin, FreeBSD, or Uknown */
    const NL_OS: OperatingSystem;
    /** CPU architecture: x64, arm, itanium, ia32, or unknown */
    const NL_ARCH: Architecture;
    /** Neutralinojs server version */
    const NL_VERSION: string;
    /** Current working directory */
    const NL_CWD: string;
    /** Identifier of the current process */
    const NL_PID: string;
    /** Source of application resources: bundle or directory */
    const NL_RESMODE: string;
    /** Release commit of the client library */
    const NL_CCOMMIT: string;
    /** An array of custom methods */
    const NL_CMETHODS: string[];
    // --- globals ---
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
export * as server from './api/server';
export * as net from './api/net';
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
export type * from './types/api/net';
export type * from './types/enums';
export type * from './types/events';
