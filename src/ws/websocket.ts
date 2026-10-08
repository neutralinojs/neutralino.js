import * as events from '../browser/events';
import { base64ToBytesArray } from '../helpers';
type QueueMessage<T = unknown> = {
    method: string;
    data?: unknown;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
};
type ExtensionStats = {
    connected: string[];
};
let ws;
const nativeCalls = {};
const offlineMessageQueue: QueueMessage[] = [];
const extensionMessageQueue = {};
export function init() {
    initAuth();
    const connectToken: string = getAuthToken().split('.')[1];
    const hostname: string =
        window.NL_GINJECTED || window.NL_CINJECTED
            ? '127.0.0.1'
            : window.location.hostname;
    ws = new WebSocket(
        `ws://${hostname}:${window.NL_PORT}?connectToken=${connectToken}`,
    );
    registerLibraryEvents();
    registerSocketEvents();
}

export function sendMessage<T = unknown>(
    method: string,
    data?: unknown,
): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        if (ws?.readyState != WebSocket.OPEN) {
            sendWhenReady({
                method,
                data,
                resolve: value => resolve(value as T),
                reject,
            });
            return;
        }

        const id: string = uuidv4();
        const accessToken: string = getAuthToken();

        nativeCalls[id] = { resolve, reject };

        ws.send(
            JSON.stringify({
                id,
                method,
                data,
                accessToken,
            }),
        );
    });
}

export function sendWhenReady(message: QueueMessage) {
    offlineMessageQueue.push(message);
}

export function sendWhenExtReady(extensionId: string, message: QueueMessage) {
    if (extensionId in extensionMessageQueue) {
        extensionMessageQueue[extensionId].push(message);
    } else {
        extensionMessageQueue[extensionId] = [message];
    }
}

function registerLibraryEvents() {
    events.on('ready', async () => {
        await processQueue(offlineMessageQueue);

        if (!window.NL_EXTENABLED) {
            return;
        }

        const stats = await sendMessage<ExtensionStats>('extensions.getStats');
        for (let extension of stats.connected) {
            events.dispatch('extensionReady', extension);
        }
    });

    events.on('extClientConnect', evt => {
        events.dispatch('extensionReady', evt.detail);
    });

    if (!window.NL_EXTENABLED) {
        return;
    }

    events.on('extensionReady', async evt => {
        if (evt.detail in extensionMessageQueue) {
            await processQueue(extensionMessageQueue[evt.detail]);
            delete extensionMessageQueue[evt.detail];
        }
    });
}

function registerSocketEvents() {
    ws.addEventListener('message', event => {
        const message = JSON.parse(event.data);

        if (message.id && message.id in nativeCalls) {
            // Native call response
            if (message.data?.error) {
                nativeCalls[message.id].reject(message.data.error);
                if (message.data.error.code == 'NE_RT_INVTOKN') {
                    // Invalid native method token
                    handleNativeMethodTokenError();
                }
            } else if (message.data?.success) {
                nativeCalls[message.id].resolve(
                    Object.prototype.hasOwnProperty.call(
                        message.data,
                        'returnValue',
                    )
                        ? message.data.returnValue
                        : message.data,
                );
            }
            delete nativeCalls[message.id];
        } else if (message.event) {
            // Event from process
            if (
                message.event == 'openedFile' &&
                message?.data?.action == 'dataBinary'
            ) {
                message.data.data = base64ToBytesArray(message.data.data);
            }
            events.dispatch(message.event, message.data);
        }
    });

    ws.addEventListener('open', () => {
        events.dispatch('ready');
    });

    ws.addEventListener('close', () => {
        const error = {
            code: 'NE_CL_NSEROFF',
            message:
                'Neutralino server is offline. Try restarting the application',
        };
        events.dispatch('serverOffline', error);
    });

    ws.addEventListener('error', () => {
        handleConnectError();
    });
}

async function processQueue(messageQueue: QueueMessage[]) {
    while (messageQueue.length > 0) {
        const message = messageQueue.shift();

        if (!message) {
            continue;
        }

        try {
            const response = await sendMessage(message.method, message.data);
            message.resolve(response);
        } catch (err) {
            message.reject(err);
        }
    }
}

function renderFatalError(code: string, message: string) {
    document.body.replaceChildren();
    const container = document.createElement('div');
    container.innerHTML = `<code>${code}</code>: ${message}`;
    document.body.appendChild(container);
}

function handleNativeMethodTokenError() {
    ws.close();
    renderFatalError(
        'NE_RT_INVTOKN',
        'Neutralinojs application cannot execute native methods since <code>NL_TOKEN</code> is invalid.',
    );
}

function handleConnectError() {
    renderFatalError(
        'NE_CL_IVCTOKN',
        'Neutralinojs application cannot connect with the framework core using <code>NL_TOKEN</code>.',
    );
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
    return '10000000-1000-4000-8000-100000000000'.replace(
        /[018]/g,
        (c: string) => {
            const value = Number(c);
            return (
                value ^
                (crypto.getRandomValues(new Uint8Array(1))[0] &
                    (15 >> (value / 4)))
            ).toString(16);
        },
    );
}
