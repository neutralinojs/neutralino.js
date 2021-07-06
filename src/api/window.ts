import { request, RequestType } from '../http/request';

export async function setTitle(title: string): Promise<any> {
    return await request({
        url : 'window.setTitle',
        type : RequestType.POST,
        data : {
            title
        },
        isNativeMethod: true
    });
};

export async function maximize(): Promise<any> {
    return await request({
        url : 'window.maximize',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export async function unmaximize(): Promise<any> {
    return await request({
        url : 'window.unmaximize',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export async function isMaximized(): Promise<any> {
    return await request({
        url : 'window.isMaximized',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export async function minimize(): Promise<any> {
    let response = await request({
        url : 'window.minimize',
        type : RequestType.GET,
        isNativeMethod: true
    });
};
