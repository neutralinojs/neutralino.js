import { request, RequestType } from '../http/request';

export interface OpenActionOptions {
    url: string;
}

export function exit(): Promise<any> {
    return request({
        url: 'app.exit',
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

export function open(options: OpenActionOptions): Promise<any> {
    return request({
        url : 'app.open',
        type : RequestType.POST,
        data : options,
        isNativeMethod: true
    });
};
