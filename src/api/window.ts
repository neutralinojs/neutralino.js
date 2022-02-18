import { sendMessage } from '../ws/websocket';

const draggableRegions: WeakMap<HTMLElement, any> = new WeakMap();

export interface WindowOptions extends WindowSizeOptions {
  title?: string;
  icon?: string;
  fullScreen?: boolean;
  alwaysOnTop?: boolean;
  enableInspector?: boolean;
  borderless?: boolean;
  maximize?: boolean;
  hidden?: boolean;
  maximizable?: boolean;
  processArgs?: string;
}

export interface WindowSizeOptions {
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  resizable?: boolean;
}

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

export function setDraggableRegion(domElementOrId: string | HTMLElement): Promise<void> {
    return new Promise((resolve: any, reject: any) => {
        const draggableRegion: HTMLElement = domElementOrId instanceof Element ?
                                                    domElementOrId : document.getElementById(domElementOrId);
        let initialClientX: number = 0;
        let initialClientY: number = 0;

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

        draggableRegions.set(draggableRegion, { pointerdown: startPointerCapturing, pointerup: endPointerCapturing });

        async function onPointerMove(evt: PointerEvent) {
            await Neutralino.window.move(
                evt.screenX - initialClientX,
                evt.screenY - initialClientY
            );
        }

        function startPointerCapturing(evt: PointerEvent) {
            if (evt.button !== 0) return;
            initialClientX = evt.clientX;
            initialClientY = evt.clientY;
            draggableRegion.addEventListener('pointermove', onPointerMove);
            draggableRegion.setPointerCapture(evt.pointerId);
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

export function unsetDraggableRegion(domElementOrId: string | HTMLElement): Promise<void> {
  return new Promise((resolve: any, reject: any) => {
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
        draggableRegions.delete(draggableRegion);

        resolve({
            success: true,
            message: 'Draggable region was deactivated'
        });
  });
}

export function setSize(options: WindowSizeOptions): Promise<void> {
    return new Promise(async (resolve: any, reject: any) => {
        let sizeOptions = await Neutralino.window.getSize();

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

export function setAlwaysOnTop(onTop: boolean): Promise<void> {
    return sendMessage('window.setAlwaysOnTop', { onTop });
};

export function create(url: string, options?: WindowOptions): Promise<void> {
    return new Promise((resolve: any, reject: any) => {

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

            let cliKey: string = key.replace(/[A-Z]|^[a-z]/g, (token: string) => (
               "-" + token.toLowerCase()
            ));
            command += ` --window${cliKey}=${normalize(options[key])}`
        }
        if(options && options.processArgs)
            command += " " + options.processArgs;

        Neutralino.os.execCommand(command, { background: true })
            .then((processInfo: any) => {
                resolve(processInfo);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};
