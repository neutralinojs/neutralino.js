export function base64ToBytesArray(data: string): ArrayBuffer {
    const binaryData: string = window.atob(data);
    const len: number = binaryData.length;
    const bytes: Uint8Array = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryData.charCodeAt(i);
    }

    return bytes.buffer;
}
