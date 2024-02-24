export function base64ToBytesArray(data: string): ArrayBuffer {
  let binaryData: string = window.atob(data);
  let len: number = binaryData.length;
  let bytes: Uint8Array = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryData.charCodeAt(i);
  }

  return bytes.buffer;
}
