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
    unknown = 'unknown',
    text = 'text',
    image = 'image'
}

// NL_GLOBALS
export enum Mode {
    window = 'window',
    browser = 'browser',
    cloud = 'cloud',
    chrome = 'chrome'
}

export enum OperatingSystem {
    Linux = 'Linux',
    Windows = 'Windows',
    Darwin = 'Darwin',
    FreeBSD = 'FreeBSD',
    Unknown = 'Unknown'
}

export enum Architecture {
    x64 = 'x64',
    arm = 'arm',
    itanium = 'itanium',
    ia32 = 'ia32',
    unknown = 'unknown'
}
