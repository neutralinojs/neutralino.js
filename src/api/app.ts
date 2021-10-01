import { request, RequestType } from '../http/request';

export interface OpenActionOptions {
    url: string;
}

export function exit(code?: number): Promise<any> {
    return request({
        url: 'app.exit',
        type: RequestType.POST,
        data: {
            code
        },
        isNativeMethod: true
    });
};

export function killProcess(): Promise<any> {
    return request({
        url: 'app.killProcess',
        type: RequestType.GET,
        isNativeMethod: true
    });
};

export function keepAlive(): Promise<any> {
    return request({
        url: 'app.keepAlive',
        type: RequestType.GET,
        isNativeMethod: true
    });
};

export function getConfig(): Promise<any> {
    return request({
        url: 'app.getConfig',
        type: RequestType.GET,
        isNativeMethod: true
    });
};
