
const LoggerTypes = ["WARNING", "ERROR", "INFO"] as const;
export type LoggerType = typeof LoggerTypes[number];


const Icons = ["WARNING", "ERROR", "INFO", "QUESTION"] as const;
export type Icon = typeof Icons[number];

const MessageBoxChoices = [
    "OK",
    "OK_CANCEL",
    "YES_NO",
    "YES_NO_CANCEL",
    "RETRY_CANCEL",
    "ABORT_RETRY_IGNORE"
] as const;
export type MessageBoxChoice = typeof MessageBoxChoices[number];


const ClipboardFormats = ["unknown", "text", "image"] as const;
export type ClipboardFormat = typeof ClipboardFormats[number];


const Modes = ["window", "browser", "cloud", "chrome"] as const;
export type Mode = typeof Modes[number];


const OperatingSystems = ["Linux", "Windows", "Darwin", "FreeBSD", "Unknown"] as const;
export type OperatingSystem = typeof OperatingSystems[number];


const Architectures = ["x64", "arm", "itanium", "ia32", "unknown"] as const;
export type Architecture = typeof Architectures[number];