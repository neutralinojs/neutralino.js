import * as filesystem from './filesystem';
import { Error } from '../types/api/protocol';
import { Manifest } from '../types/api/updater';

let manifest: Manifest = null;

export function checkForUpdates(url: string): Promise<Manifest> {
    function isValidManifest(manifest: any): manifest is Manifest {
        if(manifest.applicationId && manifest.applicationId == window.NL_APPID
            && manifest.version && manifest.resourcesURL) {
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
            let response = await fetch(url);
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
                message: 'No update manifest loaded'
            });
        }
        try {
            let response = await fetch(manifest.resourcesURL);
            let resourcesBuffer = await response.arrayBuffer();
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
