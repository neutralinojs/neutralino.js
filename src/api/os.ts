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

export async function execCommand(options: ExecCommandOptions): Promise<any> {
    return await request({
        url: 'os.execCommand',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};

export async function getEnvar(options: GetEnvarOptions): Promise<any> {
    return await request({
        url: 'os.getEnvar',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};

export async function showDialogOpen(options: DialogOpenOptions): Promise<any> {
    return await request({
        url: 'os.dialogOpen',
        type: RequestType.POST,
        data : options,
        isNativeMethod: true
    });
};

export async function showDialogSave(options: DialogSaveOptions): Promise<any> {
    return await request({
        url: 'os.dialogSave',
        type: RequestType.POST,
        data : options,
        isNativeMethod: true
    });
};

export async function showNotification(options: NotificationOptions): Promise<any> {
    return await request({
        url: 'os.showNotification',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};

export async function showMessageBox(options: MessageBoxOptions): Promise<any> {
    return await request({
        url : 'os.showMessageBox',
        type : RequestType.POST,
        data : options,
        isNativeMethod: true
    });
};

export async function setTray(options: TrayOptions): Promise<any> {
    return await request({
        url : 'os.setTray',
        type : RequestType.POST,
        data : options,
        isNativeMethod: true
    });
};
