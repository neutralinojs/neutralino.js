import { sendMessage } from '../ws/websocket';
import type { MessageBoxChoice, Icon } from '../types/enums';
import type {
    Envs,
    ExecCommandOptions,
    ExecCommandResult,
    FolderDialogOptions,
    KnownPath,
    OpenDialogOptions,
    SaveDialogOptions,
    SpawnedProcess,
    TrayOptions,
    SpawnedProcessOptions,
} from '../types/api/os';

export function execCommand(command: string, options?: ExecCommandOptions): Promise<ExecCommandResult> {
    return sendMessage('os.execCommand', { command, ...options });
};

export function spawnProcess(command: string, options?: SpawnedProcessOptions): Promise<SpawnedProcess> {
    return sendMessage('os.spawnProcess', { command, ...options });
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
export function updateTrayMenuItem( menuItem: Partial<TrayOptions['menuItems'][number]> & { id: string }, tray: TrayOptions): Promise<void> {
    if (!tray || !tray.menuItems) {
        return Promise.reject(new Error('Neutralino.os.updateTrayMenuItem: Invalid tray object.'));
    }

    const index = tray.menuItems.findIndex((item) => item.id === menuItem.id);

    if (index !== -1) {
        tray.menuItems[index] = { ...tray.menuItems[index], ...menuItem };
        return setTray(tray);
    } else {
        return Promise.reject(new Error(`Neutralino.os.updateTrayMenuItem: Item with id "${menuItem.id}" not found.`));
    }
};

export function open(url: string): Promise<void> {
    return sendMessage('os.open', { url });
};

export function getPath(name: KnownPath): Promise<string> {
    return sendMessage('os.getPath', { name });
};
