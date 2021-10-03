import { request, RequestType } from '../http/request';

export interface OpenActionOptions {
    url: string;
}

export interface RestartOptions {
    args: string;
}

export function exit(code?: number): Promise<any> {
    return request({
        url: 'app.exit',
        type: RequestType.POST,
        data: {
            code
        },
        isNativeMethod: true
    });
};

export function killProcess(): Promise<any> {
    return request({
        url: 'app.killProcess',
        type: RequestType.GET,
        isNativeMethod: true
    });
};

export function restartProcess(options: RestartOptions): Promise<any> {
    return new Promise(async (resolve: any, reject: any) => {
        let command = window.NL_ARGS.reduce((acc: string, arg: string, index: number) => {
            acc += ' ' + arg;
            return acc;
        }, '');
        
        if(options.args) {
            command += ' ' + options.args;
        }
        
        await Neutralino.os.execCommand(command, {shouldRunInBackground: true});
        Neutralino.app.exit();
        resolve();
    });
};

export function keepAlive(): Promise<any> {
    return request({
        url: 'app.keepAlive',
        type: RequestType.GET,
        isNativeMethod: true
    });
};

export function getConfig(): Promise<any> {
    return request({
        url: 'app.getConfig',
        type: RequestType.GET,
        isNativeMethod: true
    });
};
