import { request, RequestType } from '../http/request';

export function getRamUsage(): Promise<any> {
    return request({
        url: 'computer.getRamUsage',
        type: RequestType.GET,
        isNativeMethod: true
    });
};
