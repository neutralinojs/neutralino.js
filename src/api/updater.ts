import * as filesystem from './filesystem';
import { Error } from '../types/api/protocol';
import { Manifest } from '../types/api/updater';

export async function computeSHA256(buffer: ArrayBuffer): Promise<string> {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = new Uint8Array(hashBuffer);
    return Array.from(hashArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export function verifyChecksum(actual: string, expected: string): boolean {
    if (actual.length !== expected.length) return false;
    // Constant-time comparison to prevent timing attacks
    let result = 0;
    for (let i = 0; i < actual.length; i++) {
        result |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    return result === 0;
}

let manifest: Manifest = null;

export function checkForUpdates(url: string): Promise<Manifest> {
    function isValidManifest(manifest: Manifest): manifest is Manifest {
        if(manifest.applicationId && manifest.applicationId == window.NL_APPID
            && manifest.version && manifest.resourcesURL && manifest.checksum) {
            return true;
        }
        return false;
    }

    return new Promise(async (resolve: (m: Manifest) => void, reject: (e: Error) => void) => {
        if(!url) {
            return reject({
                code: 'NE_RT_NATRTER',
                message: 'Missing require parameter: url'
            });
        }
        try {
            const response = await fetch(url);
            manifest = JSON.parse(await response.text());

            if(isValidManifest(manifest)) {
                resolve(manifest);
            }
            else {
                reject({
                    code: 'NE_UP_CUPDMER',
                    message: 'Invalid update manifest or mismatching applicationId'
                });
            }
        }
        catch(err) {
            reject({
                code: 'NE_UP_CUPDERR',
                message: 'Unable to fetch update manifest'
            });
        }

    });
};

export function install(): Promise<void> {
    return new Promise(async (resolve: any, reject: any) => {
        if(!manifest) {
            return reject({
                code: 'NE_UP_UPDNOUF',
                message: 'No update manifest loaded. Make sure that updater.checkForUpdates() is called before install().'
            });
        }

        try {
            const response = await fetch(manifest.resourcesURL);
            const resourcesBuffer = await response.arrayBuffer();

            const computedChecksum = await computeSHA256(resourcesBuffer);
            if (!verifyChecksum(computedChecksum, manifest.checksum.toLowerCase())) {
                return reject({
                    code: 'NE_UP_UPDCSER',
                    message: 'Resource checksum mismatch: the downloaded update binary integrity check failed'
                });
            }

            await filesystem.writeBinaryFile(window.NL_PATH + "/resources.neu", resourcesBuffer);

            resolve({
                success: true,
                message: 'Update installed. Restart the process to see updates'
            });
        }
        catch(err) {
            reject({
                code: 'NE_UP_UPDINER',
                message: 'Update installation error'
            });
        }
    });
};
