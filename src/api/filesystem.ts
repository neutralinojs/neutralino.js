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

export interface WriteBinaryFileOptions {
  fileName: string;
  data: ArrayBuffer;
}

export interface ReadFileOptions {
  fileName: string;
}

export interface ReadBinaryFileOptions {
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

export function writeBinaryFile(options: WriteBinaryFileOptions): Promise<any> {
    let bytes: Uint8Array = new Uint8Array(options.data);
    let asciiStr: string = '';
    for(let byte of bytes) {
        asciiStr += String.fromCharCode(byte);
    }
    
    return request({
        url: 'filesystem.writeBinaryFile',
        type: RequestType.POST,
        data: {
            fileName: options.fileName,
            data: window.btoa(asciiStr)
        },
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

export function readBinaryFile(options: ReadBinaryFileOptions): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        request({
            url: 'filesystem.readBinaryFile',
            type: RequestType.POST,
            data: options,
            isNativeMethod: true
        })
        .then((base64Data: string) => {
            let binaryData: string = window.atob(base64Data);
            let len: number = binaryData.length;
            let bytes: Uint8Array = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryData.charCodeAt(i);
            }
            resolve({data: bytes.buffer});     
        })
        .catch((error: any) => {
            reject(error);
        });
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

export function copyFile(source: string, destination: string): Promise<any> {
    return request({
        url: 'filesystem.copyFile',
        type: RequestType.POST,
        data: {
            source,
            destination
        },
        isNativeMethod: true
    });
};

export function moveFile(source: string, destination: string): Promise<any> {
    return request({
        url: 'filesystem.moveFile',
        type: RequestType.POST,
        data: {
            source,
            destination
        },
        isNativeMethod: true
    });
};

export function getStats(path: string): Promise<any> {
    return request({
        url: 'filesystem.getStats',
        type: RequestType.POST,
        data: {
            path
        },
        isNativeMethod: true
    });
};
