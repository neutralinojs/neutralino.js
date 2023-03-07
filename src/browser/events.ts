export interface Response {
  success: boolean;
  message: string;
}

export type Builtin =
    'ready' |
    'trayMenuItemClicked' |
    'windowClose' |
    'serverOffline' |
    'clientConnect' |
    'clientDisconnect' |
    'appClientConnect' |
    'appClientDisconnect' |
    'extClientConnect' |
    'extClientDisconnect' |
    'extensionReady' |
    'neuDev_reloadApp'

export function on(event: Builtin, handler: (ev: CustomEvent) => void): Promise<Response> {
    window.addEventListener(event, handler);
    return Promise.resolve({
        success: true,
        message: 'Event listener added'
    });
};

export function off(event: string, handler: (ev: CustomEvent) => void): Promise<Response> {
    window.removeEventListener(event, handler);
    return Promise.resolve({
        success: true,
        message: 'Event listener removed'
    });
};

export function dispatch(event: string, data?: any): Promise<Response> {
    let customEvent = new CustomEvent(event, {detail: data});
    window.dispatchEvent(customEvent);
    return Promise.resolve({
        success: true,
        message: 'Message dispatched'
    });
};
