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

export interface CreateDirectoryOptions {
  path: string;
}

export interface RemoveDirectoryOptions {
  path: string;
}

export interface WriteFileOptions {
  fileName: string;
  data: string;
}

export interface ReadFileOptions {
  fileName: string;
}

export interface RemoveFileOptions {
  fileName: string;
}

export interface ReadDirectoryOptions {
  path: string;
}

export async function createDirectory(options: CreateDirectoryOptions): Promise<any> {
    return await request({
        url: 'filesystem.createDirectory',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};


export async function removeDirectory(options: RemoveDirectoryOptions): Promise<any> {
    return await request({
        url: 'filesystem.removeDirectory',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};

export async function writeFile(options: WriteFileOptions): Promise<any> {
    return await request({
        url: 'filesystem.writeFile',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};

export async function readFile(options: ReadFileOptions): Promise<any> {
    return await request({
        url: 'filesystem.readFile',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};

export async function removeFile(options: RemoveFileOptions): Promise<any> {
    return await request({
        url: 'filesystem.removeFile',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};

export async function readDirectory(options: ReadDirectoryOptions): Promise<any> {
    return await request({
        url: 'filesystem.readDirectory',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};
