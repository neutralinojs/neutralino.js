import { request, RequestType } from '../http/request';

export function setTitle(title: string): Promise<any> {
    return request({
        url : 'window.setTitle',
        type : RequestType.POST,
        data : {
            title
        },
        isNativeMethod: true
    });
};

export function maximize(): Promise<any> {
    return request({
        url : 'window.maximize',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function unmaximize(): Promise<any> {
    return request({
        url : 'window.unmaximize',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function isMaximized(): Promise<any> {
    return request({
        url : 'window.isMaximized',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function minimize(): Promise<any> {
    return request({
        url : 'window.minimize',
        type : RequestType.GET,
        isNativeMethod: true
    });
};
