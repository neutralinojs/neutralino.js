export function on(event: string, handler: any): Promise<any> {
    window.addEventListener(event, handler);
    return Promise.resolve();
};

export function off(event: string, handler: any): Promise<any> {
    window.removeEventListener(event, handler);
    return Promise.resolve();
};

export function dispatch(event: string, data?: any): Promise<any> {
    let customEvent = new CustomEvent(event, {detail: data});
    window.dispatchEvent(customEvent);
    return Promise.resolve();
};
