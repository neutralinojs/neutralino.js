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
