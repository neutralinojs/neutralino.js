import { sendMessage } from '../ws/websocket';
import * as os from './os';
import {
    WindowOptions,
    WindowPosOptions,
    WindowSizeOptions
} from '../types/api/window';

const draggableRegions: WeakMap<HTMLElement, {
    pointerdown: (e: PointerEvent) => void;
    pointerup: (e: PointerEvent) => void;
}> = new WeakMap();

export function setTitle(title: string): Promise<void> {
    return sendMessage('window.setTitle', { title });
};

export function getTitle(): Promise<string> {
    return sendMessage('window.getTitle');
};

export function maximize(): Promise<void> {
    return sendMessage('window.maximize');
};

export function unmaximize(): Promise<void> {
    return sendMessage('window.unmaximize');
};

export function isMaximized(): Promise<boolean> {
    return sendMessage('window.isMaximized');
};

export function minimize(): Promise<void> {
    return sendMessage('window.minimize');
};

export function unminimize(): Promise<void> {
    return sendMessage('window.unminimize');
};

export function isMinimized(): Promise<boolean> {
    return sendMessage('window.isMinimized');
};

export function setFullScreen(): Promise<void> {
    return sendMessage('window.setFullScreen');
};

export function exitFullScreen(): Promise<void> {
    return sendMessage('window.exitFullScreen');
};

export function isFullScreen(): Promise<boolean> {
    return sendMessage('window.isFullScreen');
};

export function show(): Promise<void> {
    return sendMessage('window.show');
};

export function hide(): Promise<void> {
    return sendMessage('window.hide');
};

export function isVisible(): Promise<boolean> {
    return sendMessage('window.isVisible');
};

export function focus(): Promise<void> {
    return sendMessage('window.focus');
};

export function setIcon(icon: string): Promise<void> {
    return sendMessage('window.setIcon', { icon });
};

export function move(x: number, y: number): Promise<void> {
    return sendMessage('window.move', { x, y });
};

export function center(): Promise<void> {
    return sendMessage('window.center');
};

export type DraggableRegionOptions = {
    /**
     * If set to `true`, the region will always capture the pointer,
     * ensuring dragging doesn't break on fast pointer movement.
     * Note that it prevents child elements from receiving any pointer events.
     * Defaults to `false`.
     */
    alwaysCapture?: boolean;
    /**
     * Minimum distance between cursor's starting and current position
     * after which dragging is started. This helps prevent accidental dragging
     * while interacting with child elements.
     * Defaults to `10`. (In pixels.)
     */
    dragMinDistance?: number;
}
export function setDraggableRegion(domElementOrId: string | HTMLElement, options: DraggableRegionOptions = {}): Promise<{
    success: true,
    message: string
}> {
    return new Promise<Awaited<ReturnType<typeof setDraggableRegion>>>((resolve, reject) => {
        const draggableRegion: HTMLElement = domElementOrId instanceof Element ?
                                                    domElementOrId : document.getElementById(domElementOrId);
        let initialClientX: number = 0;
        let initialClientY: number = 0;
        let absDragMovementDistance: number = 0;
        let shouldReposition = false;
        let lastMoveTimestamp = performance.now();
        let isPointerCaptured = options.alwaysCapture;

        if (!draggableRegion) {
            return reject({
                code: 'NE_WD_DOMNOTF',
                message: 'Unable to find DOM element'
            });
        }

        if (draggableRegions.has(draggableRegion)) {
            return reject({
                code: 'NE_WD_ALRDREL',
                message: 'This DOM element is already an active draggable region'
            });
        }

        draggableRegion.addEventListener('pointerdown', startPointerCapturing);
        draggableRegion.addEventListener('pointerup', endPointerCapturing);
        draggableRegion.addEventListener('pointercancel', endPointerCapturing);

        draggableRegions.set(draggableRegion, { pointerdown: startPointerCapturing, pointerup: endPointerCapturing });

        async function onPointerMove(evt: PointerEvent) {
            // Get absolute drag distance from the starting point
            const dx = evt.clientX - initialClientX,
                  dy = evt.clientY - initialClientY;
            absDragMovementDistance = Math.sqrt(dx * dx + dy * dy);
            // Only start pointer capturing when the user dragged more than a certain amount of distance
            // This ensures that the user can also click on the dragable area, e.g. if the area is menu / navbar
            if (absDragMovementDistance >= (options.dragMinDistance ?? 10)) {
                shouldReposition = true;
                if (!isPointerCaptured) {
                    draggableRegion.setPointerCapture(evt.pointerId);
                    isPointerCaptured = true;
                }
            }

            if (shouldReposition) {

                const currentMilliseconds = performance.now();
                if(typeof currentMilliseconds != "number" || typeof lastMoveTimestamp != "number")
                    return;
                const timeTillLastMove = currentMilliseconds - lastMoveTimestamp;
                // Limit move calls to 1 per every 5ms - TODO: introduce constant instead of magic number?
                if (timeTillLastMove < 5) {
                    // Do not execute move more often than 1x every 5ms or performance will drop
                    return;
                }

                // Store current time minus the offset
                lastMoveTimestamp = currentMilliseconds - (timeTillLastMove - 5);

                await move(
                    evt.screenX - initialClientX,
                    evt.screenY - initialClientY
                );

                return;
            }
        }

        function startPointerCapturing(evt: PointerEvent) {
            if (evt.button !== 0) return;
            initialClientX = evt.clientX;
            initialClientY = evt.clientY;
            draggableRegion.addEventListener('pointermove', onPointerMove);
            if (options.alwaysCapture) {
                draggableRegion.setPointerCapture(evt.pointerId);
            }
        }

        function endPointerCapturing(evt: PointerEvent) {
            draggableRegion.removeEventListener('pointermove', onPointerMove);
            draggableRegion.releasePointerCapture(evt.pointerId);
        }

        resolve({
            success: true,
            message: 'Draggable region was activated'
        });
    });
};

export function unsetDraggableRegion(domElementOrId: string | HTMLElement): Promise<{
    success: true,
    message: string
}> {
  return new Promise<Awaited<ReturnType<typeof unsetDraggableRegion>>>((resolve, reject) => {
        const draggableRegion: HTMLElement = domElementOrId instanceof Element ?
                                                domElementOrId : document.getElementById(domElementOrId);

        if (!draggableRegion) {
            return reject({
                code: 'NE_WD_DOMNOTF',
                message: 'Unable to find DOM element'
            });
        }
        if (!draggableRegions.has(draggableRegion)) {
            return reject({
                code: 'NE_WD_NOTDRRE',
                message: 'DOM element is not an active draggable region'
            });
        }

        const { pointerdown, pointerup } = draggableRegions.get(draggableRegion);
        draggableRegion.removeEventListener('pointerdown', pointerdown);
        draggableRegion.removeEventListener('pointerup', pointerup);
        draggableRegion.removeEventListener('pointercancel', pointerup);
        draggableRegions.delete(draggableRegion);

        resolve({
            success: true,
            message: 'Draggable region was deactivated'
        });
  });
}

export function setSize(options: WindowSizeOptions): Promise<void> {
    return new Promise(async (resolve: any, reject: any) => {
        let sizeOptions = await getSize();

        options = {...sizeOptions, ...options}; // merge prioritizing options arg

        sendMessage('window.setSize', options)
            .then((response: any) => {
                resolve(response);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};

export function getSize(): Promise<WindowSizeOptions> {
    return sendMessage('window.getSize');
};

export function getPosition(): Promise<WindowPosOptions> {
    return sendMessage('window.getPosition');
};

export function setAlwaysOnTop(onTop: boolean): Promise<void> {
    return sendMessage('window.setAlwaysOnTop', { onTop });
};

export function create(url: string, options?: WindowOptions): Promise<void> {
    return new Promise((resolve: any, reject: any) => {

        options = { ...options, useSavedState: false };
        // useSavedState: false -> Child windows won't save their states

        function normalize(arg: any) {
            if(typeof arg != "string")
                return arg;
            arg = arg.trim();
            if(arg.includes(" ")) {
                arg = `"${arg}"`;
            }
            return arg;
        }

        let command = window.NL_ARGS.reduce((acc: string, arg: string, index: number) => {
            if(arg.includes("--path=") || arg.includes("--debug-mode") ||
                arg.includes("--load-dir-res") || index == 0) {
                acc += " " + normalize(arg);
            }
            return acc;
        }, "");

        command += " --url=" + normalize(url);

        for(let key in options) {
            if(key == "processArgs")
                continue;

            let cliKey: string = '-' + key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            command += ` --window${cliKey}=${normalize(options[key])}`
        }

        if(options && options.processArgs)
            command += " " + options.processArgs;

        os.execCommand(command, { background: true })
            .then((processInfo: any) => {
                resolve(processInfo);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};
