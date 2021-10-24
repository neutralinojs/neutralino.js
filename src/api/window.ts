import { sendMessage } from '../ws/websocket';

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

export function setTitle(title: string): Promise<any> {
    return sendMessage('window.setTitle', { title });
};

export function maximize(): Promise<any> {
    return sendMessage('window.maximize');
};

export function unmaximize(): Promise<any> {
    return sendMessage('window.unmaximize');
};

export function isMaximized(): Promise<boolean> {
    return sendMessage('window.isMaximized');
};

export function minimize(): Promise<any> {
    return sendMessage('window.minimize');
};

export function setFullScreen(): Promise<any> {
    return sendMessage('window.setFullScreen');
};

export function exitFullScreen(): Promise<any> {
    return sendMessage('window.exitFullScreen');
};

export function isFullScreen(): Promise<boolean> {
    return sendMessage('window.isFullScreen');
};

export function show(): Promise<any> {
    return sendMessage('window.show');
};

export function hide(): Promise<any> {
    return sendMessage('window.hide');
};

export function isVisible(): Promise<boolean> {
    return sendMessage('window.isVisible');
};

export function focus(): Promise<any> {
    return sendMessage('window.focus');
};

export function setIcon(icon: string): Promise<any> {
    return sendMessage('window.setIcon', { icon });
};

export function move(x: number, y: number): Promise<any> {
    return sendMessage('window.move', { x, y });
};


const draggableRegions = new WeakMap();

export function setDraggableRegion(domElementOrId: string | HTMLElement): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        const draggableRegion: HTMLElement = domElementOrId instanceof Element ? domElementOrId : document.getElementById(domElementOrId);
        let initialClientX: number = 0;
        let initialClientY: number = 0;

        if(!draggableRegion)
            reject(`Unable to find dom element: #${domElementOrId}`);
        if (draggableRegions.has(draggableRegion))
            reject(`Dom element is alredy a draggable region`);

        function startPointerCapturing(evt: PointerEvent) {
            if (evt.button !== 0) return;
            initialClientX = evt.clientX;
            initialClientY = evt.clientY;
            draggableRegion.addEventListener('pointermove', onPointerMove);
            draggableRegion.setPointerCapture(evt.pointerId);
        }
        draggableRegion.addEventListener('pointerdown', startPointerCapturing);

        function endPointerCapturing(evt: PointerEvent) {
            draggableRegion.removeEventListener('pointermove', onPointerMove);
            draggableRegion.releasePointerCapture(evt.pointerId);
        }
        draggableRegion.addEventListener('pointerup', endPointerCapturing);

        draggableRegions.set(draggableRegion, { pointerdown: startPointerCapturing, pointerup: endPointerCapturing });

        async function onPointerMove(evt: PointerEvent) {
            await Neutralino.window.move(
                evt.screenX - initialClientX,
                evt.screenY - initialClientY
            );
        }

        resolve();
    });
};

export function unsetDraggableRegion(domElementOrId: string | HTMLElement): Promise<any> {
  return new Promise((resolve: any, reject: any) => {
      const draggableRegion: HTMLElement = domElementOrId instanceof Element ? domElementOrId : document.getElementById(domElementOrId);

      if (!draggableRegion)
          reject(`Unable to find dom element: #${domElementOrId}`);
      if (!draggableRegions.has(draggableRegion))
          reject(`Dom element is not a draggable region`);

      const { pointerdown, pointerup } = draggableRegions.get(draggableRegion);
      draggableRegion.removeEventListener('pointerdown', pointerdown);
      draggableRegion.removeEventListener('pointerup', pointerup);
      draggableRegions.delete(draggableRegion);

      resolve();
  });
}


export function setSize(options: WindowSizeOptions): Promise<any> {
    return sendMessage('window.setSize', options);
};

export function create(url: string, options?: WindowOptions): Promise<any> {
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
        
        Neutralino.os.execCommand(command, { shouldRunInBackground: true })
            .then(() => {
                resolve();
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};
