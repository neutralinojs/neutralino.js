export interface NetHeaders {
    [key: string]: string;
}

export interface NetParams {
    [key: string]: string;
}

export type NetResponseFormat = 'text' | 'binary';

export interface NetRequestOptions {
    contentType?: string,
    timeout?: number,
    params?: NetParams,
    headers?: NetHeaders,
    auth?: {
        username: string,
        password: string
    },
    body?: string,
    allowRedirects?: boolean,
    encodePath?: boolean,   // enabled by default
    keepAlive?: boolean,    // disabled by default
    responseType?: NetResponseFormat
}

export interface NetResponse {
    status: number,
    statusText: string,
    body?: string,           // absent when responseType is 'binary'
    bodyBytes?: Uint8Array,  // present when responseType is 'binary'
    headers: NetHeaders,
    cookies: string,
    contentType: string,
    location: string,
    version: string
}

export type NetFetchResponseType =
    | 'basic'
    | 'cors'
    | 'default'
    | 'error'
    | 'opaque'
    | 'opaqueredirect';

/**
 * Snapshot of the platform `Response`; `url` is the requested URL, `type` is
 * always `basic`, and `redirected` is always `false`.
 */
export interface NetFetchResponse {
    readonly body: ReadableStream<Uint8Array> | null;
    readonly bodyUsed: boolean;
    readonly headers: Headers;
    readonly ok: boolean;
    readonly redirected: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly type: NetFetchResponseType;
    readonly url: string;
    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    bytes(): Promise<Uint8Array>;
    clone(): NetFetchResponse;
    formData(): Promise<FormData>;
    json(): Promise<any>;
    text(): Promise<string>;
}

export type NetFetchIgnoredOptions =
    | 'cache'
    | 'credentials'
    | 'integrity'
    | 'keepalive'
    | 'mode'
    | 'priority'
    | 'referrer'
    | 'referrerPolicy'
    | 'window';

/** `RequestInit` fields used by `net.fetch()` plus Neutralinojs-specific options. */
export interface NetFetchOptions extends Omit<RequestInit, NetFetchIgnoredOptions | 'body'> {
    body?: string | URLSearchParams | null;
    params?: NetParams;
    auth?: NetRequestOptions['auth'];
    timeout?: number;
    encodePath?: boolean;
    keepAlive?: boolean;
}
