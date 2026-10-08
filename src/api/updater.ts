import * as filesystem from './filesystem';
import { Manifest } from '../types/api/updater';

let manifest: Manifest | null = null;
export function checkForUpdates(url: string): Promise<Manifest> {
    function isValidManifest(manifest: Manifest): manifest is Manifest {
        if (
            manifest.applicationId &&
            manifest.applicationId == window.NL_APPID &&
            manifest.version &&
            manifest.resourcesURL
        ) {
            return true;
        }

        return false;
    }

    return (async () => {
        if (!url) {
            throw {
                code: 'NE_RT_NATRTER',
                message: 'Missing require parameter: url',
            };
        }

        let parsedManifest: Manifest;

        try {
            const response = await fetch(url);
            parsedManifest = JSON.parse(await response.text());
        } catch {
            throw {
                code: 'NE_UP_CUPDERR',
                message: 'Unable to fetch update manifest',
            };
        }

        if (isValidManifest(parsedManifest)) {
            manifest = parsedManifest;
            return parsedManifest;
        }

        throw {
            code: 'NE_UP_CUPDMER',
            message: 'Invalid update manifest or mismatching applicationId',
        };
    })();
}

export function install(): Promise<void> {
    return (async () => {
        if (!manifest) {
            throw {
                code: 'NE_UP_UPDNOUF',
                message:
                    'No update manifest loaded. Make sure that updater.checkForUpdates() is called before install().',
            };
        }

        try {
            const response = await fetch(manifest.resourcesURL);
            const resourcesBuffer = await response.arrayBuffer();

            await filesystem.writeBinaryFile(
                window.NL_PATH + '/resources.neu',
                resourcesBuffer,
            );

            return;
        } catch {
            throw {
                code: 'NE_UP_UPDINER',
                message: 'Update installation error',
            };
        }
    })();
}
