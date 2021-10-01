import { request, RequestType } from '../http/request';

export function createDirectory(path: string): Promise<any> {
    return request({
        url: 'filesystem.createDirectory',
        type: RequestType.POST,
        data: {
            path
        },
        isNativeMethod: true
    });
};

export function removeDirectory(path: string): Promise<any> {
    return request({
        url: 'filesystem.removeDirectory',
        type: RequestType.POST,
        data: {
            path
        },
        isNativeMethod: true
    });
};

export function writeFile(path: string, data: string): Promise<any> {
    return request({
        url: 'filesystem.writeFile',
        type: RequestType.POST,
        data: {
            path,
            data
        },
        isNativeMethod: true
    });
};

export function writeBinaryFile(path: string, data: ArrayBuffer): Promise<any> {
    let bytes: Uint8Array = new Uint8Array(data);
    let asciiStr: string = '';
    for(let byte of bytes) {
        asciiStr += String.fromCharCode(byte);
    }
    
    return request({
        url: 'filesystem.writeBinaryFile',
        type: RequestType.POST,
        data: {
            path,
            data: window.btoa(asciiStr)
        },
        isNativeMethod: true
    });
};

export function readFile(path: string): Promise<any> {
    return request({
        url: 'filesystem.readFile',
        type: RequestType.POST,
        data: {
            path
        },
        isNativeMethod: true
    });
};

export function readBinaryFile(path: string): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        request({
            url: 'filesystem.readBinaryFile',
            type: RequestType.POST,
            data: {
                path
            },
            isNativeMethod: true
        })
        .then((base64Data: string) => {
            let binaryData: string = window.atob(base64Data);
            let len: number = binaryData.length;
            let bytes: Uint8Array = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryData.charCodeAt(i);
            }
            resolve(bytes.buffer);     
        })
        .catch((error: any) => {
            reject(error);
        });
    });
};

export function removeFile(path: string): Promise<any> {
    return request({
        url: 'filesystem.removeFile',
        type: RequestType.POST,
        data: {
            path
        },
        isNativeMethod: true
    });
};

export function readDirectory(path: string): Promise<any> {
    return request({
        url: 'filesystem.readDirectory',
        type: RequestType.POST,
        data: {
            path
        },
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
