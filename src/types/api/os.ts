export interface ExecCommandOptions {
    stdIn?: string;
    background?: boolean;
    cwd?: string;
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
    icon: string;
    menuItems: TrayMenuItem[];
}

export interface TrayMenuItem {
    id?: string;
    text: string;
    isDisabled?: boolean;
    isChecked?: boolean;
}

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