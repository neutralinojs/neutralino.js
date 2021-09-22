import { request, RequestType } from '../http/request';

export enum LoggerType {
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  INFO = 'INFO'
};

export function log(message: string, type: LoggerType): Promise<any> {
    return request({
        url: 'debug.log',
        type: RequestType.POST,
        data: {
            message,
            type
        },
        isNativeMethod: true
    });

};
