import { sendMessage } from '../ws/websocket';
import { NeutralinoFetchResponse } from '../browser/response';
import type {
    NetFetchOptions,
    NetFetchResponse,
    NetHeaders,
    NetParams,
    NetRequestOptions,
    NetResponse
} from '../types/api/net';

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

function __delete(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return request(url, "DELETE", options);
};
export { __delete as delete } // 'delete' is a keyword, so direct export won't work

export function patch(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return request(url, "PATCH", options);
};

export function options(url: string, options?: NetRequestOptions): Promise<NetResponse> {
    return request(url, "OPTIONS", options);
};

// Fetch-like native request. Bodies are limited to strings and URLSearchParams;
// `redirect: 'manual'` returns the 3xx response and abort doesn't cancel the request.
export async function fetch(url: string, init: NetFetchOptions = {}): Promise<NetFetchResponse> {
    const { params, auth, timeout, encodePath, keepAlive, ...requestInit } = init;

    if(requestInit.signal?.aborted) {
        throw new DOMException('The operation was aborted.', 'AbortError');
    }

    const platformRequest = new Request(url, requestInit);

    const headers: NetHeaders = {};
    platformRequest.headers.forEach((value, key) => headers[key] = value);

    let body: string | undefined;
    if(platformRequest.body !== null) {
        if(typeof requestInit.body === 'string') {
            body = requestInit.body;
        }
        else if(requestInit.body instanceof URLSearchParams) {
            body = requestInit.body.toString();
        }
        else {
            throw new TypeError('net.fetch supports only string and URLSearchParams request bodies.');
        }
    }

    const response: NetResponse = await __withSignal(request(
        __withParams(platformRequest.url, params),
        platformRequest.method,
        {
            headers,
            body,
            responseType: 'binary',
            allowRedirects: requestInit.redirect !== 'manual' && requestInit.redirect !== 'error',
            encodePath: encodePath ?? false,
            auth,
            timeout,
            keepAlive
        }
    ), requestInit.signal);

    if(requestInit.redirect === 'error' && (response.status >= 300 && response.status <= 399)) {
        throw new TypeError('Redirect encountered while redirect mode is set to "error".');
    }

    return NeutralinoFetchResponse.create(
        response.bodyBytes ?? new TextEncoder().encode(response.body ?? ''),
        {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers ?? {},
            url: platformRequest.url
        }
    );
};

function __withParams(url: string, params?: NetParams): string {
    const parsed = new URL(url);
    parsed.hash = '';
    for(const [key, value] of Object.entries(params ?? {})) {
        parsed.searchParams.append(key, value);
    }
    return parsed.toString();
};

function __withSignal<T>(promise: Promise<T>, signal?: AbortSignal | null): Promise<T> {
    if(!signal) {
        return promise;
    }

    return new Promise<T>((resolve, reject) => {
        const onAbort = () => {
            signal.removeEventListener('abort', onAbort);
            reject(new DOMException('The operation was aborted.', 'AbortError'));
        };
        if(signal.aborted) {
            onAbort();
            return;
        }
        signal.addEventListener('abort', onAbort);
        promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', onAbort));
    });
};
