import { request, RequestType } from '../http/request';

export interface ExecCommandOptions {
    shouldRunInBackground: boolean;
}

export interface OpenDialogOptions {
    multiSelections?: boolean;
    filters?: Filter[];
}

export interface SaveDialogOptions {
    forceOverwrite?: boolean;
    filters?: Filter[];
}

export interface Filter {
    name: string;
    extensions: string[];
}

export interface TrayOptions {
    icon?: string;
    menu?: TrayMenuItem[];
}

interface TrayMenuItem {
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

export function execCommand(command: string, options?: ExecCommandOptions): Promise<any> {
    return request({
        url: 'os.execCommand',
        type: RequestType.POST,
        data: {
            command,
            ...options
        },
        isNativeMethod: true
    });
};

export function getEnv(key: string): Promise<any> {
    return request({
        url: 'os.getEnv',
        type: RequestType.POST,
        data: {
            key
        },
        isNativeMethod: true
    });
};

export function showOpenDialog(title?: string, options?: OpenDialogOptions): Promise<any> {
    return request({
        url: 'os.showOpenDialog',
        type: RequestType.POST,
        data: {
            title,
            ...options
        },
        isNativeMethod: true
    });
};

export function showFolderDialog(title?: string): Promise<any> {
    return request({
        url: 'os.showFolderDialog',
        type: RequestType.POST,
        data: {
            title
        },
        isNativeMethod: true
    });
};

export function showSaveDialog(title?: string, options?: SaveDialogOptions): Promise<any> {
    return request({
        url: 'os.showSaveDialog',
        type: RequestType.POST,
        data: {
            title,
            ...options
        },
        isNativeMethod: true
    });
};

export function showNotification(title: string, content: string, icon?: Icon): Promise<any> {
    return request({
        url: 'os.showNotification',
        type: RequestType.POST,
        data: {
            title,
            content,
            icon
        },
        isNativeMethod: true
    });
};

export function showMessageBox(title: string, content: string, 
                choice?: MessageBoxChoice, icon?: Icon): Promise<any> {
    return request({
        url: 'os.showMessageBox',
        type: RequestType.POST,
        data: {
            title,
            content,
            choice,
            icon
        },
        isNativeMethod: true
    });
};

export function setTray(options: TrayOptions): Promise<any> {
    return request({
        url: 'os.setTray',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};

export function open(url: string): Promise<any> {
    return request({
        url: 'os.open',
        type: RequestType.POST,
        data: {
            url
        },
        isNativeMethod: true
    });
};

export function getPath(name: string): Promise<any> {
    return request({
        url: 'os.getPath',
        type: RequestType.POST,
        data: {
            name
        },
        isNativeMethod: true
    });
};
