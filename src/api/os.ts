// MIT License

// Copyright (c) 2018 Neutralinojs

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
