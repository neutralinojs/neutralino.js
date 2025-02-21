export interface ClipboardImage {
    width: number;
    height: number;
    bpp: number;
    bpr: number;
    redMask: number;
    greenMask: number;
    blueMask: number;
    redShift: number;
    greenShift: number;
    blueShift: number;
    data: ArrayBuffer;
}
