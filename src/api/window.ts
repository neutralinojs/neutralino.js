import { request, RequestType } from '../http/request';

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
    return request({
        url : 'window.setTitle',
        type : RequestType.POST,
        data : {
            title
        },
        isNativeMethod: true
    });
};

export function maximize(): Promise<any> {
    return request({
        url : 'window.maximize',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function unmaximize(): Promise<any> {
    return request({
        url : 'window.unmaximize',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function isMaximized(): Promise<boolean> {
    return request({
        url : 'window.isMaximized',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function minimize(): Promise<any> {
    return request({
        url : 'window.minimize',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function setFullScreen(): Promise<any> {
    return request({
        url : 'window.setFullScreen',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function exitFullScreen(): Promise<any> {
    return request({
        url : 'window.exitFullScreen',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function isFullScreen(): Promise<boolean> {
    return request({
        url : 'window.isFullScreen',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function show(): Promise<any> {
    return request({
        url : 'window.show',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function hide(): Promise<any> {
    return request({
        url : 'window.hide',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function isVisible(): Promise<boolean> {
    return request({
        url : 'window.isVisible',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function focus(): Promise<any> {
    return request({
        url : 'window.focus',
        type : RequestType.GET,
        isNativeMethod: true
    });
};

export function setIcon(icon: string): Promise<any> {
    return request({
        url : 'window.setIcon',
        type : RequestType.POST,
        isNativeMethod: true,
        data: {
            icon
        }
    });
};

export function move(x: number, y: number): Promise<any> {
    return request({
        url : 'window.move',
        type : RequestType.POST,
        isNativeMethod: true,
        data: {
            x, y
        }
    });
};

export function setDraggableRegion(domId: string): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        let draggableRegion: HTMLElement = document.getElementById(domId);
        let initialClientX: number = 0;
        let initialClientY: number = 0;

        if(!draggableRegion)
            reject(`Unable to find dom element: #${domId}`);

        draggableRegion.addEventListener('mousedown', (evt: MouseEvent) => {
            initialClientX = evt.clientX;
            initialClientY = evt.clientY;
            draggableRegion.addEventListener('mousemove', onMouseMove);
        });

        draggableRegion.addEventListener('mouseup', () => {
            draggableRegion.removeEventListener('mousemove', onMouseMove);
        });
        
        async function onMouseMove(evt: MouseEvent) {
            await Neutralino.window
                .move(evt.screenX - initialClientX, evt.screenY - initialClientY);
        }
        
        resolve();
    });
};

export function setSize(options: WindowSizeOptions): Promise<any> {
    return request({
        url : 'window.setSize',
        type : RequestType.POST,
        isNativeMethod: true,
        data: options
    });
};

export function create(url: string, options: WindowOptions): Promise<any> {
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
            if(arg.includes("--path=") || arg.includes("--debug-mode") || index == 0) {
                acc += " " + normalize(arg);
            }
            return acc;
        }, "");

        command += " --url=" + normalize(url);
        
        for(let key in options) {
            let cliKey: string = key.replace(/[A-Z]|^[a-z]/g, (token: string) => (
               "-" + token.toLowerCase() 
            ));
            command += ` --window${cliKey}=${normalize(options[key])}`
        }
        
        Neutralino.os.execCommand({
            command,
            shouldRunInBackground: true
        })
            .then(() => {
                resolve();
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};
