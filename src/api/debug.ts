import { request, RequestType } from '../http/request';

export interface LoggerOptions {
  type: LoggerType;
  message: string;
}

export enum LoggerType {
  WARN = 'WARN',
  ERROR = 'ERROR',
  INFO = 'INFO'
};

export async function log(options: LoggerOptions): Promise<any> {
    return await request({
        url: 'debug.log',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });

};
