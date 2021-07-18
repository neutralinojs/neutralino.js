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

export function isMaximized(): Promise<boolean> {
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

export function setFullScreen(): Promise<any> {
    return request({
        url : 'window.setFullScreen',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function exitFullScreen(): Promise<any> {
    return request({
        url : 'window.exitFullScreen',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function isFullScreen(): Promise<boolean> {
    return request({
        url : 'window.isFullScreen',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function show(): Promise<any> {
    return request({
        url : 'window.show',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function hide(): Promise<any> {
    return request({
        url : 'window.hide',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function isVisible(): Promise<boolean> {
    return request({
        url : 'window.isVisible',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function focus(): Promise<any> {
    return request({
        url : 'window.focus',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function setIcon(icon: string): Promise<any> {
    return request({
        url : 'window.setIcon',
        type : RequestType.POST,
        isNativeMethod: true,
        data: {
            icon
        }
    });
};

export function move(x: number, y: number): Promise<any> {
    return request({
        url : 'window.move',
        type : RequestType.POST,
        isNativeMethod: true,
        data: {
            x, y
        }
    });
};
