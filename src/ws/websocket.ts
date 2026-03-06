import * as events from '../browser/events';
import { base64ToBytesArray } from '../helpers';

let ws;
const nativeCalls: Record<string, { resolve: any; reject: any; timer: ReturnType<typeof setTimeout> }> = {};
const offlineMessageQueue: Array<{ method: string; data: any; resolve: any; reject: any; timer: ReturnType<typeof setTimeout> }> = [];
const extensionMessageQueue: Record<string, any[]> = {};

const CALL_TIMEOUT_MS = 10_000;

export function init() {
    initAuth();
    const connectToken: string = getAuthToken().split('.')[1];
    const hostname: string = (window.NL_GINJECTED || window.NL_CINJECTED) ?
                            '127.0.0.1' : window.location.hostname;
    ws = new WebSocket(`ws://${hostname}:${window.NL_PORT}?connectToken=${connectToken}`);
    registerLibraryEvents();
    registerSocketEvents();
}

export function sendMessage(method: string, data?: any, timeout: number = CALL_TIMEOUT_MS): Promise<any> {
    return new Promise((resolve: any, reject: any) => {

        if(ws?.readyState != WebSocket.OPEN) {
            sendWhenReady({method, data, resolve, reject}, timeout);
            return;
        }

        const id: string = uuidv4();
        const accessToken: string = getAuthToken();

        const timer = setTimeout(() => {
            if(id in nativeCalls) {
                delete nativeCalls[id];
                reject({ code: 'NE_CL_CALLTM', message: `Native call timed out: ${method}` });
            }
        }, timeout);

        nativeCalls[id] = { resolve, reject, timer };

        try {
            ws.send(JSON.stringify({
                id,
                method,
                data,
                accessToken
            }));
        }
        catch(err) {
            clearTimeout(timer);
            delete nativeCalls[id];
            reject({ code: 'NE_CL_SENDERROR', message: `Failed to send native call: ${method}` });
        }

    });
}

export function sendWhenReady(message: any, timeout: number = CALL_TIMEOUT_MS) {
    const timer = setTimeout(() => {
        const idx = offlineMessageQueue.indexOf(entry);
        if(idx !== -1) {
            offlineMessageQueue.splice(idx, 1);
            message.reject({ code: 'NE_CL_CALLTM', message: `Native call timed out: ${message.method}` });
        }
    }, timeout);
    const entry = { ...message, timer };
    offlineMessageQueue.push(entry);
}

export function sendWhenExtReady(extensionId: string, message: any) {
    if(extensionId in extensionMessageQueue) {
        extensionMessageQueue[extensionId].push(message);
    }
    else {
        extensionMessageQueue[extensionId] = [message];
    }
}

function registerLibraryEvents() {
    events.on('ready', async () => {
        await processQueue(offlineMessageQueue);

        if(!window.NL_EXTENABLED) {
            return;
        }

        let stats = await sendMessage('extensions.getStats');
        for(let extension of stats.connected) {
            events.dispatch('extensionReady', extension);
        }
    });

    events.on('extClientConnect', (evt) => {
        events.dispatch('extensionReady', evt.detail);
    });

    if(!window.NL_EXTENABLED) {
        return;
    }

    events.on('extensionReady', async (evt) => {
        if(evt.detail in extensionMessageQueue) {
            await processQueue(extensionMessageQueue[evt.detail]);
            delete extensionMessageQueue[evt.detail];
        }
    });
}

function registerSocketEvents() {
    ws.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);

        if(message.id && message.id in nativeCalls) {
            // Native call response
            clearTimeout(nativeCalls[message.id].timer);
            if(message.data?.error) {
                nativeCalls[message.id].reject(message.data.error);
                if(message.data.error.code == 'NE_RT_INVTOKN') {
                    // Invalid native method token
                    handleNativeMethodTokenError();
                }
            }
            else if(message.data?.success) {
                nativeCalls[message.id]
                    .resolve(message.data.hasOwnProperty('returnValue') ? message.data.returnValue
                        : message.data);
            }
            delete nativeCalls[message.id];
        }
        else if(message.event) {
            // Event from process
            if(message.event == 'openedFile' && message?.data?.action == 'dataBinary') {
                message.data.data = base64ToBytesArray(message.data.data);
            }
            events.dispatch(message.event, message.data);
        }
    });

    ws.addEventListener('open', async (event) => {
        events.dispatch('ready');
    });

    ws.addEventListener('close', async (event) => {
        const error = {
            code: 'NE_CL_NSEROFF',
            message: 'Neutralino server is offline. Try restarting the application'
        };
        events.dispatch('serverOffline', error);
    });

    ws.addEventListener('error', async (event) => {
        handleConnectError();
    });
}

async function processQueue(messageQueue: any[]) {
    while(messageQueue.length > 0) {
        const message = messageQueue.shift();
        clearTimeout(message.timer);
        try {
            const response = await sendMessage(message.method, message.data);
            message.resolve(response);
        }
        catch(err: any) {
            message.reject(err);
        }
    }
}

function handleNativeMethodTokenError() {
    ws.close();
    document.body.innerText = '';
    document.write('<code>NE_RT_INVTOKN</code>: Neutralinojs application cannot' +
                                    ' execute native methods since <code>NL_TOKEN</code> is invalid.');
}

function handleConnectError() {
    document.body.innerText = '';
    document.write('<code>NE_CL_IVCTOKN</code>: Neutralinojs application cannot' +
                                    ' connect with the framework core using <code>NL_TOKEN</code>.');
}

function initAuth() {
    if (window.NL_TOKEN) {
        sessionStorage.setItem('NL_TOKEN', window.NL_TOKEN);
    }
}
function getAuthToken() {
    return window.NL_TOKEN || sessionStorage.getItem('NL_TOKEN') || '';
}

// From: https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
function uuidv4(): string {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: any) =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
