import { sendMessage } from '../ws/websocket';
import type { NetRequestOptions, NetResponse } from "../types/api/net";

export async function request(url: string, method?: string, options?: NetRequestOptions): Promise<NetResponse> {
    method = (method || "GET").toUpperCase();
    return await sendMessage('net.request', { url, method, ...options });
}

export async function get(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return await request(url, 'GET', options);
}

export async function post(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return await request(url, 'POST', options);
}

export async function head(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return await request(url, 'HEAD', options);
}

export async function put(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return await request(url, 'PUT', options);
}

export async function del(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return await request(url, "DELETE", options);
}

export async function patch(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return await request(url, 'PATCH', options);
}

export async function options(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return await request(url, 'OPTIONS', options);
}
