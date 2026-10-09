export interface NetHeaders {
    [key: string]: string;
}

export interface NetParams {
    [key: string]: string;
}

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
    encodePath?: boolean,
    keepAlive?: boolean
}

export interface NetResponse {
    status: number,
    statusText: string,
    body: string,
    headers: NetHeaders[],
    cookies: string,
    contentType: string,
    location: string,
    version: string
}
