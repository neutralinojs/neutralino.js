import { sendMessage } from '../ws/websocket';
import type { NetRequestOptions, NetResponse } from "../types/api/net";

export function request(url: string, method?: string, options?: NetRequestOptions): Promise<NetResponse> {
    method = (method || "GET").toUpperCase();
    return sendMessage('net.request', { url, method, ...options });
};

export function get(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return request(url, "GET", options);
};

export function post(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return request(url, "POST", options);
};

export function head(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return request(url, "HEAD", options);
};

export function put(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return request(url, "PUT", options);
};

export function del(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return request(url, "DELETE", options);
};

export function patch(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return request(url, "PATCH", options);
};

export function options(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return request(url, "OPTIONS", options);
};