import { request, RequestType } from '../http/request';

export function on(event: string, handler: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        window.addEventListener(event, handler);
        resolve();
    });
};

export function off(event: string, handler: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        window.removeEventListener(event, handler);
        resolve();
    });
};

export function dispatch(event: string, data: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        let customEvent = new CustomEvent(event, {detail: data});
        window.dispatchEvent(customEvent);
        resolve();
    });
};
