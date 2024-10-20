import { sendMessage } from '../ws/websocket';
import { arrayBufferToBase64 } from '../helpers';
import type { ClipboardImage } from '../types/api/clipboard';
import type { ClipboardFormat } from '../types/enums';

export function getFormat(): Promise<ClipboardFormat> {
    return sendMessage('clipboard.getFormat');
};

export function readText(): Promise<string> {
    return sendMessage('clipboard.readText');
};

export function readImage(format: string = ''): Promise < ClipboardImage | null > {
	return new Promise((resolve: any, reject: any) => {
		sendMessage('clipboard.readImage')
			.then((image: any) => {
				if (image) {
					const binaryData = window.atob(image.data);
					let numOfBytes: number = image.bpp == 32 ? 4 : 3;
					let len: number, pattern: number[], bytes: Uint8Array;

					switch (format.toLowerCase()) {
						case 'rgb':
							len = image.width * image.height * 3;
							pattern = [0, 1, 2];
							break;

						case 'rgba':
							len = image.width * image.height * 4;
							pattern = [0, 1, 2, 3];
							break;

						case 'argb':
							len = image.width * image.height * 4;
							pattern = [3, 0, 1, 2];
							break;

						case 'bgra':
							len = image.width * image.height * 4;
							pattern = [2, 1, 0, 3];
							break;

						default:
							len = binaryData.length;
							bytes = new Uint8Array(len);
							for (let i = 0; i < len; i++) {
								bytes[i] = binaryData.charCodeAt(i);
							}
							image.data = bytes;
							resolve(image);
					}
					bytes = new Uint8Array(len);
					let isLittleEndian: boolean = new Uint8Array(new Uint32Array([0x000000ff]).buffer)[0] == 0xff;
					let byteA: number, byteB: number, byteC: number, byteD: number, uint32: number;
					let rgba: number[] = [];
					let outIndex: number = 0;
					for (let i = 0; i < binaryData.length; i += numOfBytes) {
						byteA = binaryData.charCodeAt(i);
						byteB = binaryData.charCodeAt(i + 1);
						byteC = binaryData.charCodeAt(i + 2);
						byteD = numOfBytes == 4 ? binaryData.charCodeAt(i + 3) : 0xff;
						if (isLittleEndian) {
							uint32 = ((byteD << 24) | (byteC << 16) | (byteB << 8) | byteA) >>> 0;
						} else {
							uint32 = ((byteA << 24) | (byteB << 16) | (byteC << 8) | byteD) >>> 0;
						}

						rgba = [(uint32 >> image.redShift) & 0xff, (uint32 >> image.greenShift) & 0xff, (uint32 >> image.blueShift) & 0xff, (uint32 >> image.alphaShift) & 0xff]
						pattern.forEach((el, index) => {
							bytes[index + outIndex] = rgba[el];
						});
						outIndex += pattern.length;
					}
					image.data = bytes;
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
