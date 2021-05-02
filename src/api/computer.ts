import { request, RequestType } from '../http/request';

export async function getRamUsage(): Promise<any> {
    return await request({
        url: 'computer.getRamUsage',
        type: RequestType.GET,
        isNativeMethod: true
    });
};
