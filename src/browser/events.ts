import type { Response } from '../types/events';

export function on(event: string, handler: (ev: CustomEvent) => void): Promise<Response> {
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
    const customEvent = new CustomEvent(event, {detail: data});
    window.dispatchEvent(customEvent);
    return Promise.resolve({
        success: true,
        message: 'Message dispatched'
    });
};
