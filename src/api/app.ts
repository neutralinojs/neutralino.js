import { request, RequestType } from '../http/request';

export interface OpenActionOptions {
    url: string;
}

export async function exit(): Promise<any> {
    return await request({
        url: 'app.exit',
        type: RequestType.GET,
        isNativeMethod: true
    });
};

export async function keepAlive(): Promise<any> {
    return await request({
        url: 'app.keepAlive',
        type: RequestType.GET,
        isNativeMethod: true
    });
};

export async function getConfig(): Promise<any> {
    return await request({
        url: 'app.getConfig',
        type: RequestType.GET,
        isNativeMethod: true
    });
};

export async function open(options: OpenActionOptions): Promise<any> {
    return await request({
        url : 'app.open',
        type : RequestType.POST,
        data : options,
        isNativeMethod: true
    });
};
