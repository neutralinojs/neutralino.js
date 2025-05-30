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

    for (let byte of bytes) {
        asciiStr += String.fromCharCode(byte);
    }

    return window.btoa(asciiStr);
}

export function normalizeElements(
    inputs: Array<string | HTMLElement | Array<string | HTMLElement>>,
): HTMLElement[] {
    const result: HTMLElement[] = [];

    for (const input of inputs) {
        const items = Array.isArray(input) ? input : [input];
        for (const item of items) {
            const el =
                item instanceof HTMLElement
                    ? item
                    : document.getElementById(item);
            if (el) result.push(el);
        }
    }

    return result;
}
