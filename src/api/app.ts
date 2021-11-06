import { sendMessage } from '../ws/websocket';

export interface OpenActionOptions {
    url: string;
}

export interface RestartOptions {
    args: string;
}

export function exit(code?: number): Promise<any> {
    return sendMessage('app.exit', { code });
};

export function killProcess(): Promise<any> {
    return sendMessage('app.killProcess');
};

export function restartProcess(options?: RestartOptions): Promise<any> {
    return new Promise(async (resolve: any, reject: any) => {
        let command = window.NL_ARGS.reduce((acc: string, arg: string, index: number) => {
            acc += ' ' + arg;
            return acc;
        }, '');

        if(options?.args) {
            command += ' ' + options.args;
        }

        await Neutralino.os.execCommand(command, {shouldRunInBackground: true});
        Neutralino.app.exit();
        resolve();
    });
};

export function keepAlive(): Promise<any> {
    return sendMessage('app.keepAlive');
};

export function getConfig(): Promise<any> {
    return sendMessage('app.getConfig');
};

export function broadcast(event: string, data?: any): Promise<any> {
    return sendMessage('app.broadcast', {event, data});
};
