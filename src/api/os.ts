import { request, RequestType } from '../http/request';

export interface ExecCommandOptions {
    command: string;
}

export interface GetEnvarOptions {
    key: string;
}

export interface DialogOpenOptions {
    title: string;
    isDirectoryMode: boolean;
    filter: string[];
}

export interface DialogSaveOptions {
    title: string;
}

export interface NotificationOptions {
    body: string;
    summary: string;
}

export interface MessageBoxOptions {
    title: string;
    content: string;
    type: MessageBoxType;
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

export function execCommand(options: ExecCommandOptions): Promise<any> {
    return request({
        url: 'os.execCommand',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};

export function getEnvar(options: GetEnvarOptions): Promise<any> {
    return request({
        url: 'os.getEnvar',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};

export function showDialogOpen(options: DialogOpenOptions): Promise<any> {
    return request({
        url: 'os.dialogOpen',
        type: RequestType.POST,
        data : options,
        isNativeMethod: true
    });
};

export function showDialogSave(options: DialogSaveOptions): Promise<any> {
    return request({
        url: 'os.dialogSave',
        type: RequestType.POST,
        data : options,
        isNativeMethod: true
    });
};

export function showNotification(options: NotificationOptions): Promise<any> {
    return request({
        url: 'os.showNotification',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};

export function showMessageBox(options: MessageBoxOptions): Promise<any> {
    return request({
        url : 'os.showMessageBox',
        type : RequestType.POST,
        data : options,
        isNativeMethod: true
    });
};

export function setTray(options: TrayOptions): Promise<any> {
    return request({
        url : 'os.setTray',
        type : RequestType.POST,
        data : options,
        isNativeMethod: true
    });
};
