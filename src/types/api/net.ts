export interface NetHeaders {
    [key: string]: string;
}

export interface NetParams {
    [key: string]: string;
}

export interface NetRequestOptions {
    timeout?: boolean,
    params?: NetParams[],
    headers?: NetHeaders[],
    auth?: {
        username: string,
        password: string
    },
    encodePath: boolean,
    keepAlive: boolean
}

export interface NetResponse {
    statusCode: number,
    text: string,
    reason: string,
    headers: NetHeaders[],
    cookies: string,
    version: string
}