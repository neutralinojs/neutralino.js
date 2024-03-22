import { sendMessage } from '../ws/websocket';
import { base64ToBytesArray, arrayBufferToBase64 } from '../helpers';
import type { ClipboardImage } from '../types/api/clipboard';
import type { ClipboardFormat } from '../types/enums';

export function getFormat(): Promise<ClipboardFormat> {
    return sendMessage('clipboard.getFormat');
};

export function readText(): Promise<string> {
    return sendMessage('clipboard.readText');
};

export function readImage(): Promise<ClipboardImage | null> {
    return new Promise((resolve: any, reject: any) => {
        sendMessage('clipboard.readImage')
        .then((image: any) => {
            if(image) {
                image.data = base64ToBytesArray(image.data);
            }
            resolve(image);
        })
        .catch((error: any) => {
            reject(error);
        });
    });
};

export function writeText(data: string): Promise<void> {
    return sendMessage('clipboard.writeText', { data });
};

export function writeImage(image: ClipboardImage): Promise<void> {
    const props: any = {...image};
    if(image?.data) {
        props.data = arrayBufferToBase64(image.data);
    }
    return sendMessage('clipboard.writeImage', props);
};

export function clear(): Promise<void> {
    return sendMessage('clipboard.clear');
};
