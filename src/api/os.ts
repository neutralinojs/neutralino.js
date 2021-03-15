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

export interface ExecCommandOptions extends BaseOption {
    command: string;
}

export interface GetEnvarOptions extends BaseOption {
    key: string;
}

export interface DialogOpenOptions extends BaseOption {
    title: string;
    isDirectoryMode: boolean;
}

export interface DialogSaveOptions extends BaseOption {
    title: string;
}

export interface NotificationOptions extends BaseOption {
    body: string;
    summary: string;
}

export interface MessageBoxOptions extends BaseOption {
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

export function execCommand(options: ExecCommandOptions) {
    request({
        url: 'os.runCommand',
        type: RequestType.POST,
        data: {
          command: options.command
        },
        onSuccess: options.onSuccess,
        onError: options.onError,
        isNativeMethod: true
    });

};

export function getEnvar(options: GetEnvarOptions) {
    request({
        url: 'os.getEnvar',
        type: RequestType.POST,
        data: {
          key: options.key
        },
        onSuccess: options.onSuccess,
        onError: options.onError,
        isNativeMethod: true
    });

};


export function showDialogOpen(options: DialogOpenOptions) {
    request({
        url: 'os.dialogOpen',
        type: RequestType.POST,
        data: {
          title: options.title,
          isDirectoryMode: options.isDirectoryMode
        },
        onSuccess: options.onSuccess,
        onError: options.onError,
        isNativeMethod: true
    });

};

export function showDialogSave(options: DialogSaveOptions) {
    request({
        url: 'os.dialogSave',
        type: RequestType.POST,
        data: {
          title: options.title
        },
        onSuccess: options.onSuccess,
        onError: options.onError,
        isNativeMethod: true
    });

};

export function showNotification(options: NotificationOptions) {
    request({
        url: 'os.showNotification',
        type: RequestType.POST,
        data: options,
        onSuccess: options.onSuccess,
        onError: options.onError,
        isNativeMethod: true
    });

};

export function showMessageBox(options: MessageBoxOptions) {
    request({
        url : 'os.showMessageBox',
        type : RequestType.POST,
        data : options,
        onSuccess: options.onSuccess,
        onError: options.onError,
        isNativeMethod: true
    });
};
