import { sendMessage } from '../ws/websocket';

export function setData(key: string, data: string): Promise<void> {
    return sendMessage('storage.setData', { key, data });

};

export function getData(key: string): Promise<string> {
    return sendMessage('storage.getData', { key });
};
