import { sendMessage } from '../ws/websocket';
import * as os from './os';

export interface OpenActionOptions {
    url: string;
}

export interface RestartOptions {
    args: string;
}

export function exit(code?: number): Promise<void> {
    return sendMessage('app.exit', { code });
};

export function killProcess(): Promise<void> {
    return sendMessage('app.killProcess');
};

export function restartProcess(options?: RestartOptions): Promise<void> {
    return new Promise(async (resolve: () => void) => {
        let command = window.NL_ARGS.reduce((acc: string, arg: string) => {
            if(arg.includes(' ')) {
                arg = `"${arg}"`
            }
            acc += ' ' + arg;
            return acc;
        }, '');

        if(options?.args) {
            command += ' ' + options.args;
        }

        await os.execCommand(command, {background: true});
        exit();
        resolve();
    });
};

export function getConfig(): Promise<any> {
    return sendMessage('app.getConfig');
};

export function broadcast(event: string, data?: any): Promise<void> {
    return sendMessage('app.broadcast', {event, data});
};

export function readProcessInput(readAll?: boolean): Promise<string> {
    return sendMessage('app.readProcessInput', { readAll });
};

export function writeProcessOutput(data: string): Promise<void> {
    return sendMessage('app.writeProcessOutput', { data });
};

export function writeProcessError(data: string): Promise<void> {
    return sendMessage('app.writeProcessError', { data });
};
