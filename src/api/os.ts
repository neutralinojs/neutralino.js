import { request, RequestType } from '../http/request';

export interface ExecCommandOptions {
    shouldRunInBackground: boolean;
}

export interface OpenDialogOptions {
    isDirectoryMode: boolean;
    filter: string[];
}

export interface TrayOptions {
    icon?: string;
    menu?: TrayMenuItem[]
}

interface TrayMenuItem {
    id?: string;
    text: string;
    isDisabled?: boolean;
    isChecked?: boolean;
}

export enum MessageBoxType {
    WARN = 'WARN',
    ERROR = 'ERROR',
    INFO = 'INFO',
    QUESTION = 'QUESTION'
};

export function execCommand(command: string, options: ExecCommandOptions): Promise<any> {
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

export function showOpenDialog(title: string, options: OpenDialogOptions): Promise<any> {
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

export function showSaveDialog(title: string): Promise<any> {
    return request({
        url: 'os.showSaveDialog',
        type: RequestType.POST,
        data: {
            title
        },
        isNativeMethod: true
    });
};

export function showNotification(title: string, content: string): Promise<any> {
    return request({
        url: 'os.showNotification',
        type: RequestType.POST,
        data: {
            title,
            content
        },
        isNativeMethod: true
    });
};

export function showMessageBox(title: string, content: string, type: MessageBoxType): Promise<any> {
    return request({
        url: 'os.showMessageBox',
        type: RequestType.POST,
        data: {
            title,
            content,
            type
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
