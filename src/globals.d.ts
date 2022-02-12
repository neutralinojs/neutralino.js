declare interface Window {
    /** Mode of the application: window, browser, cloud, or chrome */
    NL_MODE: string;
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
    /** Operating system name: Linux, Windows, or Darwin */
    NL_OS: string;
    /** Neutralinojs server version */
    NL_VERSION: string;
    /** Current working directory */
    NL_CWD: string;
    /** Identifier of the current process */
    NL_PID: string;
    /** Source of application resources: bundle or directory */
    NL_RESMODE: string;
}

declare let Neutralino: any;
