import { keepAlive } from '../api/app';

export function startAsync() {
    setInterval(async () => {
        try {
            await keepAlive();
        }
        catch(e: any) {
            console.error('Unable to keep Neutralino server online. The server is not reachable.');
        }
    }, 5000);
}
