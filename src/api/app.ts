import { sendMessage } from '../ws/websocket';
import * as os from './os';
import type { RestartOptions } from "../types/api/app"

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

export function mount(mountPath: string, targetPath: string): Promise<void> {
    return sendMessage('app.mount', { mountPath, targetPath });
}

export function unmount(mountPath: string): Promise<void> {
    return sendMessage('app.unmount', { mountPath });
}

export function readProcessInput(readAll?: boolean): Promise<string> {
    return sendMessage('app.readProcessInput', { readAll });
};

export function writeProcessOutput(data: string): Promise<void> {
    return sendMessage('app.writeProcessOutput', { data });
};

export function writeProcessError(data: string): Promise<void> {
    return sendMessage('app.writeProcessError', { data });
};
