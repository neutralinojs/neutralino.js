import { request, RequestType } from '../http/request';

export function getMemoryInfo(): Promise<any> {
    return request({
        url: 'computer.getMemoryInfo',
        type: RequestType.GET,
        isNativeMethod: true
    });
};
