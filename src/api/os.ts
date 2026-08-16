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
    LocaleInfo,
} from '../types/api/os';

export async function execCommand(command: string, options?: ExecCommandOptions): Promise<ExecCommandResult> {
    return await sendMessage('os.execCommand', { command, ...options });
}

export async function spawnProcess(command: string, options?: SpawnedProcessOptions): Promise<SpawnedProcess> {
    return await sendMessage('os.spawnProcess', { command, ...options });
}

export async function updateSpawnedProcess(id: number, event: string, data?: any): Promise<void> {
    return await sendMessage('os.updateSpawnedProcess', { id, event, data });
}

export async function getSpawnedProcesses(): Promise<SpawnedProcess[]> {
    return await sendMessage('os.getSpawnedProcesses');
}

export async function getEnv(key: string): Promise<string> {
    return await sendMessage('os.getEnv', { key });
}

export async function setEnv(key: string, value: string): Promise<string> {
    return await sendMessage('os.setEnv', { key, value });
}

export async function getEnvs(): Promise<Envs> {
    return await sendMessage('os.getEnvs');
}

export async function showOpenDialog(title?: string, options?: OpenDialogOptions): Promise<string[]> {
    return await sendMessage('os.showOpenDialog', { title, ...options });
}

export async function showFolderDialog(title?: string, options?: FolderDialogOptions): Promise<string> {
    return await sendMessage('os.showFolderDialog', { title, ...options });
}

export async function showSaveDialog(title?: string, options?: SaveDialogOptions): Promise<string> {
    return await sendMessage('os.showSaveDialog', { title, ...options });
}

export async function showNotification(title: string, content: string, icon?: Icon): Promise<void> {
    return await sendMessage('os.showNotification', { title, content, icon });
}

export async function showMessageBox(title: string, content: string,
                choice?: MessageBoxChoice, icon?: Icon): Promise<string> {
    return await sendMessage('os.showMessageBox', { title, content, choice, icon });
}

export async function setTray(options: TrayOptions): Promise<void> {
    return await sendMessage('os.setTray', options);
}

export async function open(url: string): Promise<void> {
    return await sendMessage('os.open', { url });
}

export async function getPath(name: KnownPath): Promise<string> {
    return await sendMessage('os.getPath', { name });
}

export async function trashItem(path: string): Promise<string> {
    return await sendMessage('os.trashItem', { path });
}

export async function getLocaleInfo(): Promise<LocaleInfo> {
    return await sendMessage('os.getLocaleInfo');
}
