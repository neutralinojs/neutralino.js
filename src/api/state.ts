import * as storage from './storage';
import * as app from './app';
import * as events from '../browser/events';
import type { StateOptions, StateSnapshot, StateHandler } from '../types/api/state';

const PERSIST_META_KEY = '__nl_state_keys__';
const PERSIST_KEY_PREFIX = '__nl_state_';

const store = new Map<string, any>();
const subscribers = new Map<string, Set<StateHandler>>();
const persistKeys = new Set<string>();

// Listen for state changes broadcast from other windows
events.on('stateChange', (evt: CustomEvent) => {
    const { key, value } = evt.detail ?? {};
    if(typeof key !== 'string') return;

    const current = store.get(key);
    // Skip own echo: value already matches what we set locally
    if(JSON.stringify(current) === JSON.stringify(value)) return;

    const previous = current;
    if(value === undefined) {
        store.delete(key);
    }
    else {
        store.set(key, value);
    }
    notifySubscribers(key, value, previous);
});

export async function set<T = any>(key: string, value: T, options: StateOptions = {}): Promise<void> {
    const previous = store.get(key);
    store.set(key, value);
    notifySubscribers(key, value, previous);

    if(options.persist || persistKeys.has(key)) {
        persistKeys.add(key);
        await storage.setData(PERSIST_KEY_PREFIX + key, JSON.stringify(value));
        await syncPersistKeysList();
    }

    await app.broadcast('stateChange', { key, value });
}

export function get<T = any>(key: string): T | undefined {
    return store.get(key) as T | undefined;
}

export function subscribe<T = any>(key: string, handler: StateHandler<T>): () => void {
    if(!subscribers.has(key)) {
        subscribers.set(key, new Set());
    }
    subscribers.get(key)!.add(handler as StateHandler);
    return () => unsubscribe(key, handler as StateHandler);
}

export function unsubscribe(key: string, handler: StateHandler): void {
    subscribers.get(key)?.delete(handler);
}

export async function restore(key?: string): Promise<void> {
    if(key) {
        await restoreKey(key);
    }
    else {
        try {
            const raw = await storage.getData(PERSIST_META_KEY);
            const keys: string[] = JSON.parse(raw);
            for(const k of keys) {
                await restoreKey(k);
            }
        }
        catch(e) {
            // No persisted state exists yet
        }
    }
}

export function snapshot(): StateSnapshot {
    const result: StateSnapshot = {};
    for(const [key, value] of store.entries()) {
        result[key] = value;
    }
    return result;
}

export async function clear(key?: string): Promise<void> {
    if(key) {
        const previous = store.get(key);
        store.delete(key);
        if(persistKeys.has(key)) {
            persistKeys.delete(key);
            await storage.removeData(PERSIST_KEY_PREFIX + key);
            await syncPersistKeysList();
        }
        notifySubscribers(key, undefined, previous);
        await app.broadcast('stateChange', { key, value: undefined });
    }
    else {
        const keys = [...store.keys()];
        store.clear();
        for(const k of [...persistKeys]) {
            await storage.removeData(PERSIST_KEY_PREFIX + k);
        }
        persistKeys.clear();
        await storage.removeData(PERSIST_META_KEY);
        for(const k of keys) {
            notifySubscribers(k, undefined, undefined);
            await app.broadcast('stateChange', { key: k, value: undefined });
        }
    }
}

function notifySubscribers<T>(key: string, value: T | undefined, previous: T | undefined): void {
    subscribers.get(key)?.forEach(handler => handler(value, previous));
}

async function restoreKey(key: string): Promise<void> {
    try {
        const raw = await storage.getData(PERSIST_KEY_PREFIX + key);
        const value = JSON.parse(raw);
        const previous = store.get(key);
        store.set(key, value);
        persistKeys.add(key);
        notifySubscribers(key, value, previous);
    }
    catch(e) {
        // Key doesn't exist in storage yet, skip silently
    }
}

async function syncPersistKeysList(): Promise<void> {
    await storage.setData(PERSIST_META_KEY, JSON.stringify([...persistKeys]));
}
