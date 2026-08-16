import { sendMessage } from '../ws/websocket';
import * as os from './os';
import type { RestartOptions } from "../types/api/app"

export async function exit(code?: number): Promise<void> {
    return await sendMessage('app.exit', { code });
}

export async function killProcess(): Promise<void> {
    return await sendMessage('app.killProcess');
}

export async function restartProcess(options?: RestartOptions): Promise<void> {
    let command = window.NL_ARGS.reduce((acc: string, arg: string) => {
        if (arg.includes(' ')) {
            arg = `"${arg}"`;
        }
        acc += ' ' + arg;
        return acc;
    }, '');

    if (options?.args) {
        command += ' ' + options.args;
    }
    await os.execCommand(command, { background: true });
    await exit();
}

export async function getConfig(): Promise<unknown> {
    return await sendMessage('app.getConfig');
}

export async function broadcast(event: string, data?: never): Promise<void> {
    return await sendMessage('app.broadcast', {event, data});
}

export async function readProcessInput(readAll?: boolean): Promise<string> {
    return await sendMessage('app.readProcessInput', { readAll });
}

export async function writeProcessOutput(data: string): Promise<void> {
    return await sendMessage('app.writeProcessOutput', { data });
}

export async function writeProcessError(data: string): Promise<void> {
    return await sendMessage('app.writeProcessError', { data });
}

export async function getProcessId(): Promise<number> {
    return await sendMessage('app.getProcessId');
}
