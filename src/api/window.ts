import { sendMessage } from '../ws/websocket';
import * as os from './os';
import {
    WindowOptions,
    WindowPosOptions,
    WindowSizeOptions,
    WindowMenu,
} from '../types/api/window';

const draggableRegions = new Set<HTMLElement>();
const draggableExclusions = new Map<HTMLElement, Set<HTMLElement>>();
const draggableListeners = new Map<HTMLElement, EventListener>();

export function setTitle(title: string): Promise<void> {
    return sendMessage('window.setTitle', { title });
}

export function getTitle(): Promise<string> {
    return sendMessage('window.getTitle');
}

export function maximize(): Promise<void> {
    return sendMessage('window.maximize');
}

export function unmaximize(): Promise<void> {
    return sendMessage('window.unmaximize');
}

export function isMaximized(): Promise<boolean> {
    return sendMessage('window.isMaximized');
}

export function minimize(): Promise<void> {
    return sendMessage('window.minimize');
}

export function unminimize(): Promise<void> {
    return sendMessage('window.unminimize');
}

export function isMinimized(): Promise<boolean> {
    return sendMessage('window.isMinimized');
}

export function setFullScreen(): Promise<void> {
    return sendMessage('window.setFullScreen');
}

export function exitFullScreen(): Promise<void> {
    return sendMessage('window.exitFullScreen');
}

export function isFullScreen(): Promise<boolean> {
    return sendMessage('window.isFullScreen');
}

export function show(): Promise<void> {
    return sendMessage('window.show');
}

export function hide(): Promise<void> {
    return sendMessage('window.hide');
}

export function isVisible(): Promise<boolean> {
    return sendMessage('window.isVisible');
}

export function focus(): Promise<void> {
    return sendMessage('window.focus');
}

export function setIcon(icon: string): Promise<void> {
    return sendMessage('window.setIcon', { icon });
}

export function move(x: number, y: number): Promise<void> {
    return sendMessage('window.move', { x, y });
}

export function center(): Promise<void> {
    return sendMessage('window.center');
}

export function beginDrag(
    screenX: number = 0,
    screenY: number = 0,
): Promise<void> {
    return sendMessage('window.beginDrag', { screenX, screenY });
}

function createDraggableListener(region: HTMLElement): EventListener {
    return async function draggableListener(ev: PointerEvent) {
        if (ev.button !== 0) return;

        const exclusions = draggableExclusions.get(region);
        if (exclusions) {
            for (const excludedEl of exclusions) {
                if (excludedEl.contains(ev.target as Node)) return;
            }
        }

        await beginDrag(ev.screenX, ev.screenY);
        ev.preventDefault();
    };
}

export function setDraggableRegion(
    DOMElementOrId: string | HTMLElement,
    options?: {
        exclude?: Array<string | HTMLElement>;
    },
): Promise<{
    success: true;
    message: string;
    exclusions: {
        add(elements: Array<string | HTMLElement>): void;
        remove(elements: Array<string | HTMLElement>): void;
        removeAll(): void;
    };
}> {
    return new Promise<Awaited<ReturnType<typeof setDraggableRegion>>>(
        (resolve, reject) => {
            const draggableRegion =
                DOMElementOrId instanceof HTMLElement
                    ? DOMElementOrId
                    : document.getElementById(DOMElementOrId);

            if (!draggableRegion) {
                return reject({
                    code: 'NE_WD_DOMNOTF',
                    message: 'Unable to find DOM element',
                });
            }

            if (draggableRegions.has(draggableRegion)) {
                return reject({
                    code: 'NE_WD_ALRDREL',
                    message:
                        'This DOM element is already an active draggable region',
                });
            }

            if (options?.exclude?.length) {
                const exclusions = new Set<HTMLElement>();
                for (const item of options.exclude) {
                    const el =
                        item instanceof HTMLElement
                            ? item
                            : document.getElementById(item);
                    if (el) exclusions.add(el);
                }
                if (exclusions.size) {
                    draggableExclusions.set(draggableRegion, exclusions);
                }
            }

            const listener = createDraggableListener(draggableRegion);
            draggableRegion.addEventListener('pointerdown', listener);

            draggableRegions.add(draggableRegion);
            draggableListeners.set(draggableRegion, listener);

            const exclusionControls = {
                add(
                    ...elements: Array<
                        string | HTMLElement | Array<string | HTMLElement>
                    >
                ) {
                    if (!draggableRegions.has(draggableRegion)) {
                        throw {
                            code: 'NE_WD_NOTDRRE',
                            message:
                                'DOM element is no longer an active draggable region. You likely called unsetDraggableRegion on this element too early!',
                        };
                    }

                    let set = draggableExclusions.get(draggableRegion);
                    if (!set) {
                        set = new Set<HTMLElement>();
                        draggableExclusions.set(draggableRegion, set);
                    }

                    const normalized = normalizeElements(elements);
                    for (const el of normalized) set.add(el);
                },

                remove(
                    ...elements: Array<
                        string | HTMLElement | Array<string | HTMLElement>
                    >
                ) {
                    if (!draggableRegions.has(draggableRegion)) {
                        throw {
                            code: 'NE_WD_NOTDRRE',
                            message:
                                'DOM element is no longer an active draggable region. You likely called unsetDraggableRegion on this element too early!',
                        };
                    }

                    const set = draggableExclusions.get(draggableRegion);
                    if (!set) return;

                    const normalized = normalizeElements(elements);
                    for (const el of normalized) set.delete(el);
                },

                removeAll() {
                    if (!draggableRegions.has(draggableRegion)) {
                        throw {
                            code: 'NE_WD_NOTDRRE',
                            message:
                                'DOM element is no longer an active draggable region. You likely called unsetDraggableRegion on this element too early!',
                        };
                    }

                    draggableExclusions.delete(draggableRegion);
                },
            };

            resolve({
                success: true,
                message: 'Draggable region was activated',
                exclusions: exclusionControls,
            });
        },
    );
}

export function unsetDraggableRegion(
    DOMElementOrId: string | HTMLElement,
): Promise<{
    success: true;
    message: string;
}> {
    return new Promise((resolve, reject) => {
        const draggableRegion =
            DOMElementOrId instanceof HTMLElement
                ? DOMElementOrId
                : document.getElementById(DOMElementOrId);

        if (!draggableRegion) {
            return reject({
                code: 'NE_WD_DOMNOTF',
                message: 'Unable to find DOM element',
            });
        }

        if (!draggableRegions.has(draggableRegion)) {
            return reject({
                code: 'NE_WD_NOTDRRE',
                message: 'DOM element is not an active draggable region',
            });
        }

        const listener = draggableListeners.get(draggableRegion);

        if (listener) {
            draggableRegion.removeEventListener('pointerdown', listener);
            draggableListeners.delete(draggableRegion);
        }

        draggableRegions.delete(draggableRegion);
        draggableExclusions.delete(draggableRegion);

        resolve({
            success: true,
            message: 'Draggable region was deactivated',
        });
    });
}

export function setSize(options: WindowSizeOptions): Promise<void> {
    return new Promise(async (resolve: any, reject: any) => {
        let sizeOptions = await getSize();

        options = { ...sizeOptions, ...options }; // merge prioritizing options arg

        sendMessage('window.setSize', options)
            .then((response: any) => {
                resolve(response);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
}

export function getSize(): Promise<WindowSizeOptions> {
    return sendMessage('window.getSize');
}

export function getPosition(): Promise<WindowPosOptions> {
    return sendMessage('window.getPosition');
}

export function setAlwaysOnTop(onTop: boolean): Promise<void> {
    return sendMessage('window.setAlwaysOnTop', { onTop });
}

export function create(url: string, options?: WindowOptions): Promise<void> {
    return new Promise((resolve: any, reject: any) => {
        options = { ...options, useSavedState: false };
        // useSavedState: false -> Child windows won't save their states

        function normalize(arg: any) {
            if (typeof arg != 'string') return arg;
            arg = arg.trim();
            if (arg.includes(' ')) {
                arg = `"${arg}"`;
            }
            return arg;
        }

        let command = window.NL_ARGS.reduce(
            (acc: string, arg: string, index: number) => {
                if (
                    arg.includes('--path=') ||
                    arg.includes('--debug-mode') ||
                    arg.includes('--load-dir-res') ||
                    index == 0
                ) {
                    acc += ' ' + normalize(arg);
                }
                return acc;
            },
            '',
        );

        command += ' --url=' + normalize(url);

        for (let key in options) {
            if (key == 'processArgs') continue;

            let cliKey: string =
                '-' + key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            command += ` --window${cliKey}=${normalize(options[key])}`;
        }

        if (options && options.processArgs)
            command += ' ' + options.processArgs;

        os.execCommand(command, { background: true })
            .then((processInfo: any) => {
                resolve(processInfo);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
}

export function snapshot(path: string): Promise<void> {
    return sendMessage('window.snapshot', { path });
}

export function setMainMenu(options: WindowMenu): Promise<void> {
    return sendMessage('window.setMainMenu', options);
};

export function print(): Promise<void> {
    return sendMessage('window.print');
};
