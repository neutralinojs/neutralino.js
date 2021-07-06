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

export function createDirectory(options: CreateDirectoryOptions): Promise<any> {
    return request({
        url: 'filesystem.createDirectory',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};


export function removeDirectory(options: RemoveDirectoryOptions): Promise<any> {
    return request({
        url: 'filesystem.removeDirectory',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};

export function writeFile(options: WriteFileOptions): Promise<any> {
    return request({
        url: 'filesystem.writeFile',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};

export function readFile(options: ReadFileOptions): Promise<any> {
    return request({
        url: 'filesystem.readFile',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};

export function removeFile(options: RemoveFileOptions): Promise<any> {
    return request({
        url: 'filesystem.removeFile',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};

export function readDirectory(options: ReadDirectoryOptions): Promise<any> {
    return request({
        url: 'filesystem.readDirectory',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });
};
