import { sendMessage } from '../ws/websocket';
import type { NetRequestOptions, NetResponse } from "../types/api/net";

function request(url: string, method?: string, options?: NetRequestOptions): Promise<NetResponse> {
    method = (method || "GET").toUpperCase();
    return sendMessage('net.request', { url, method, ...options });
};

function get(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return request(url, "GET", options);
};

function post(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return request(url, "POST", options);
};

function head(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return request(url, "HEAD", options);
};

function put(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return request(url, "PUT", options);
};

function __delete(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return request(url, "DELETE", options);
};

function patch(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return request(url, "PATCH", options);
};

function options(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return request(url, "OPTIONS", options);
};

export const net = {
    request,
    get,
    post,
    head,
    put,
    patch,
    options,
    delete: __delete,
};
