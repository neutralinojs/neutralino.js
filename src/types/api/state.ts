export interface StateOptions {
  persist?: boolean;
}

export interface StateSnapshot {
    [key: string]: any;
}

export type StateHandler<T = any> = (value: T | undefined, previousValue: T | undefined) => void;
