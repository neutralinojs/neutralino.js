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
