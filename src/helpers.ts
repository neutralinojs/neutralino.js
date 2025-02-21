export function base64ToBytesArray(data: string): ArrayBuffer {
    const binaryData: string = window.atob(data);
    const len: number = binaryData.length;
    const bytes: Uint8Array = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryData.charCodeAt(i);
    }

    return bytes.buffer;
}

export function arrayBufferToBase64(data: ArrayBuffer): string {
    let bytes: Uint8Array = new Uint8Array(data);
    let asciiStr: string = '';

    for(let byte of bytes) {
        asciiStr += String.fromCharCode(byte);
    }

    return window.btoa(asciiStr);
};
