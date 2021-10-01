import * as events from '../api/events';

export interface RequestOptions {
    isNativeMethod?: boolean;
    data?: any;
    url: string;
    type: RequestType;
}

export enum RequestType {
    GET = 'GET',
    POST = 'POST'
};

export function request(options: RequestOptions): Promise<any> {
    return new Promise((resolve: any, reject: any) => {

        if(options.isNativeMethod)
            options.url = 'http://localhost:' + window.NL_PORT + '/__nativeMethod_' + options.url;

        if(options.data)
            options.data = JSON.stringify(options.data);
            
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Basic ' + window.NL_TOKEN);

        fetch(options.url, {
            method: options.type,
            headers,
            body: options.data
        })
            .then(async (resp: Response) => {
                let respData: string = await resp.text();
                let respObj: any = null;
                
                if(respData) {
                    respObj = JSON.parse(respData);
                }

                if(respObj && respObj.success) {
                    resolve(respObj.hasOwnProperty('returnValue') 
                        ? respObj.returnValue 
                        : respObj);
                }
                if(respObj && respObj.error)
                    reject(respObj.error);
            })
            .catch((e: any) => {
                let error = {
                    code: 'NE_CL_NSEROFF',
                    message: 'Neutralino server is offline. Try restarting the application'
                };
                events.dispatch('serverOffline', error);
                reject(error);
            });
    });
}
