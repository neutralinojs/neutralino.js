import { sendMessage } from '../ws/websocket';

export interface ExecCommandOptions {
    stdIn?: string;
    background?: boolean;
}

export interface ExecCommandResult {
    pid: number;
    stdOut: string;
    stdErr: string;
    exitCode: number;
}

export interface SpawnedProcess {
    id: number;
    pid: number;
}

export interface Envs {
    [key: string]: string;
}

export interface OpenDialogOptions {
    multiSelections?: boolean;
    filters?: Filter[];
    defaultPath?: string;
}

export interface FolderDialogOptions {
    defaultPath?: string;
}

export interface SaveDialogOptions {
    forceOverwrite?: boolean;
    filters?: Filter[];
    defaultPath?: string;
}

export interface Filter {
    name: string;
    extensions: string[];
}

export interface TrayOptions {
    icon?: string;
    menuItems?: TrayMenuItem[];
}

export interface TrayMenuItem {
    id?: string;
    text: string;
    isDisabled?: boolean;
    isChecked?: boolean;
}

export enum Icon {
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    INFO = 'INFO',
    QUESTION = 'QUESTION'
};

export enum MessageBoxChoice {
    OK = 'OK',
    OK_CANCEL = 'OK_CANCEL',
    YES_NO = 'YES_NO',
    YES_NO_CANCEL = 'YES_NO_CANCEL',
    RETRY_CANCEL = 'RETRY_CANCEL',
    ABORT_RETRY_IGNORE = 'ABORT_RETRY_IGNORE'
};

export type KnownPath =
    'config' |
    'data' |
    'cache' |
    'documents' |
    'pictures' |
    'music' |
    'video' |
    'downloads' |
    'savedGames1' |
    'savedGames2'

export function execCommand(command: string, options?: ExecCommandOptions): Promise<ExecCommandResult> {
    return sendMessage('os.execCommand', { command, ...options });
};

export function spawnProcess(command: string): Promise<SpawnedProcess> {
    return sendMessage('os.spawnProcess', { command });
};

export function updateSpawnedProcess(id: number, event: string, data?: any): Promise<void> {
    return sendMessage('os.updateSpawnedProcess', { id, event, data });
};

export function getSpawnedProcesses(): Promise<SpawnedProcess[]> {
    return sendMessage('os.getSpawnedProcesses');
};

export function getEnv(key: string): Promise<string> {
    return sendMessage('os.getEnv', { key });
};

export function getEnvs(): Promise<Envs> {
    return sendMessage('os.getEnvs');
};

export function showOpenDialog(title?: string, options?: OpenDialogOptions): Promise<string[]> {
    return sendMessage('os.showOpenDialog', { title, ...options });
};

export function showFolderDialog(title?: string, options?: FolderDialogOptions): Promise<string> {
    return sendMessage('os.showFolderDialog', { title, ...options });
};

export function showSaveDialog(title?: string, options?: SaveDialogOptions): Promise<string> {
    return sendMessage('os.showSaveDialog', { title, ...options });
};

export function showNotification(title: string, content: string, icon?: Icon): Promise<void> {
    return sendMessage('os.showNotification', { title, content, icon });
};

export function showMessageBox(title: string, content: string,
                choice?: MessageBoxChoice, icon?: Icon): Promise<string> {
    return sendMessage('os.showMessageBox', { title, content, choice, icon });
};

export function setTray(options: TrayOptions): Promise<void> {
    return sendMessage('os.setTray', options);
};

export function open(url: string): Promise<void> {
    return sendMessage('os.open', { url });
};

export function getPath(name: KnownPath): Promise<string> {
    return sendMessage('os.getPath', { name });
};
