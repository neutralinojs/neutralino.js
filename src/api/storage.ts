import { request, RequestType } from '../http/request';

export function setData(key: string, data: string): Promise<any> {
    return request({
        url: 'storage.setData',
        type: RequestType.POST,
        data: {
            key,
            data
        },
        isNativeMethod: true
    });

};

export function getData(key: string): Promise<any> {
    return request({
        url: 'storage.getData',
        type: RequestType.POST,
        data: {
            key
        },
        isNativeMethod: true
    });

};
