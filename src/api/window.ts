import { sendMessage } from '../ws/websocket';
import * as os from './os';
import {
    WindowOptions,
    WindowPosOptions,
    WindowSizeOptions,
    WindowMenu,
} from '../types/api/window';

import { normalizeElements } from '../helpers';

const draggableRegions = new Set<HTMLElement>();
const draggableExclusions = new Map<HTMLElement, Set<HTMLElement>>();
const draggableListeners = new Map<HTMLElement, EventListener>();

export async function setTitle(title: string): Promise<void> {
    return await sendMessage('window.setTitle', { title });
}

export async function getTitle(): Promise<string> {
    return await sendMessage('window.getTitle');
}

export async function maximize(): Promise<void> {
    return await sendMessage('window.maximize');
}

export async function unmaximize(): Promise<void> {
    return await sendMessage('window.unmaximize');
}

export async function isMaximized(): Promise<boolean> {
    return await sendMessage('window.isMaximized');
}

export async function minimize(): Promise<void> {
    return await sendMessage('window.minimize');
}

export async function unminimize(): Promise<void> {
    return await sendMessage('window.unminimize');
}

export async function isMinimized(): Promise<boolean> {
    return await sendMessage('window.isMinimized');
}

export async function setFullScreen(): Promise<void> {
    return await sendMessage('window.setFullScreen');
}

export async function exitFullScreen(): Promise<void> {
    return await sendMessage('window.exitFullScreen');
}

export async function isFullScreen(): Promise<boolean> {
    return await sendMessage('window.isFullScreen');
}

export async function show(): Promise<void> {
    return await sendMessage('window.show');
}

export async function hide(): Promise<void> {
    return await sendMessage('window.hide');
}

export async function isVisible(): Promise<boolean> {
    return await sendMessage('window.isVisible');
}

export async function focus(): Promise<void> {
    return await sendMessage('window.focus');
}

export async function setIcon(icon: string): Promise<void> {
    return await sendMessage('window.setIcon', { icon });
}

export async function move(x: number, y: number): Promise<void> {
    return await sendMessage('window.move', { x, y });
}

export async function center(): Promise<void> {
    return await sendMessage('window.center');
}

export async function beginDrag(
    screenX: number = 0,
    screenY: number = 0,
): Promise<void> {
    return await sendMessage('window.beginDrag', { screenX, screenY });
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

export async function setDraggableRegion(
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

export async function unsetDraggableRegion(
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

export async function setSize(options: WindowSizeOptions): Promise<void> {
    const sizeOptions = await getSize();
    options = { ...sizeOptions, ...options }; // merge prioritizing options arg

    return await sendMessage('window.setSize', options);
}

export async function getSize(): Promise<WindowSizeOptions> {
    return await sendMessage('window.getSize');
}

export async function getPosition(): Promise<WindowPosOptions> {
    return await sendMessage('window.getPosition');
}

export async function setAlwaysOnTop(onTop: boolean): Promise<void> {
    return await sendMessage('window.setAlwaysOnTop', { onTop });
}

export async function setBorderless(borderless: boolean): Promise<void> {
    return await sendMessage('window.setBorderless', { borderless });
}

export async function create(url: string, options?: WindowOptions): Promise<void> {
    options = { ...options, useSavedState: false };
    // useSavedState: false -> Child windows won't save their states

    function normalize(arg: string) {
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

    for (const key in options) {
        if (key == 'processArgs') continue;

        const cliKey: string = '-' + key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        command += ` --window${cliKey}=${normalize(options[key])}`;
    }

    if (options && options.processArgs) command += ' ' + options.processArgs;

    await os.execCommand(command, { background: true });
}

export async function snapshot(path: string): Promise<void> {
    return await sendMessage('window.snapshot', { path });
}

export async function setMainMenu(options: WindowMenu): Promise<void> {
    return await sendMessage('window.setMainMenu', options);
}

export async function print(): Promise<void> {
    return await sendMessage('window.print');
}
