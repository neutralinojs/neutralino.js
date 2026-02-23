export interface StateOptions {
    /** Persist value to storage so it survives app restarts */
    persist?: boolean;
}

export interface StateSnapshot {
    [key: string]: any;
}

export type StateHandler<T = any> = (value: T | undefined, previousValue: T | undefined) => void;
