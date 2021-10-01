import { keepAlive } from '../api/app';

const PING_INTERVAL_MS: number = 5000;

export let ping = {
    start: () => {
        setInterval(async () => {
            try {
                await keepAlive();
            }
            catch(e: any) {
                console.error('Unable to keep Neutralino server online. The server is not reachable.');
            }
        }, PING_INTERVAL_MS);
    }
}
