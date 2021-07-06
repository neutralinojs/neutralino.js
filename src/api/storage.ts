import { request, RequestType } from '../http/request';

export interface StorageWriterOptions {
  bucket: string;
  data: string;
}

export interface StorageReaderOptions {
  bucket: string;
}

export function putData(options: StorageWriterOptions): Promise<any> {
    return request({
        url: 'storage.putData',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });

};

export function getData(options: StorageReaderOptions): Promise<any> {
    return request({
        url: 'storage.getData',
        type: RequestType.POST,
        data: options,
        isNativeMethod: true
    });

};
