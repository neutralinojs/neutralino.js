export interface OpenActionOptions {
    url: string;
}

export interface RestartOptions {
    args: string;
}

export interface AutoStartOptions {
    enabled: boolean;
    path?: string;
    args?: string[];
    name?: string;
}
