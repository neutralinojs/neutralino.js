import * as events from '../api/events';

let nativeCalls = {};
let ws;

export function init() {
    ws = new WebSocket(`ws://${window.location.hostname}:${window.NL_PORT}`);
    ws.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);

        if(message.id && message.id in nativeCalls) {
            // Native call response
            if(message.data.error) {
                nativeCalls[message.id].reject(message.data.error);
            }
            else if(message.data.success) {
                nativeCalls[message.id]
                    .resolve(message.data.returnValue ? message.data.returnValue 
                        : message.data);
            }
            delete nativeCalls[message.id];
        }
        else if(message.event) {
            // Event from process
            events.dispatch(message.event, message.data);
        }
    });
    
    ws.addEventListener('open', (event) => {
        events.dispatch('ready');
    });
}

export function sendMessage(method: string, data?: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        
        if(ws.readyState != WebSocket.OPEN) {
            let error = {
                code: 'NE_CL_NSEROFF',
                message: 'Neutralino server is offline. Try restarting the application'
            };
            events.dispatch('serverOffline', error);
            return reject(error);
        }
    
        const id: string = uuidv4();
        const accessToken: string = window.NL_TOKEN;
        
        nativeCalls[id] = {resolve, reject};
        
        ws.send(JSON.stringify({
            id,
            method,
            data,
            accessToken
        }));

    });
}

// From: https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
function uuidv4(): string {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: any) =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
