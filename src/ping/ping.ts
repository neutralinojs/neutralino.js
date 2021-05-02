import { keepAlive } from '../api/app';

const PING_INTERVAL_MS: number = 5000;

export let ping = {
    start: () => {
        setInterval(async () => {
            await keepAlive();
        }, PING_INTERVAL_MS);
    }
}
