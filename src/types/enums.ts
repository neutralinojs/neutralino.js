// debug
export enum LoggerType {
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    INFO = 'INFO'
  }

// os
export enum Icon {
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    INFO = 'INFO',
    QUESTION = 'QUESTION'
}

export enum MessageBoxChoice {
    OK = 'OK',
    OK_CANCEL = 'OK_CANCEL',
    YES_NO = 'YES_NO',
    YES_NO_CANCEL = 'YES_NO_CANCEL',
    RETRY_CANCEL = 'RETRY_CANCEL',
    ABORT_RETRY_IGNORE = 'ABORT_RETRY_IGNORE'
}

//clipboard
export enum ClipboardFormat {
    unknown,
    text,
    image
}

// NL_GLOBALS
export enum Mode {
    window,
    browser,
    cloud,
    chrome
}

export enum OperatingSystem {
    Linux,
    Windows,
    Darwin,
    FreeBSD,
    Unknown
}

export enum Architecture {
    x64,
    arm,
    itanium,
    ia32,
    unknown
}
