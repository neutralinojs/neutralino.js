import { sendMessage } from '../ws/websocket';

export function setData(key: string, data: string): Promise<any> {
    return sendMessage('storage.setData', { key, data });

};

export function getData(key: string): Promise<any> {
    return sendMessage('storage.getData', { key });
};
