import * as filesystem from './filesystem';
import { Manifest } from '../types/api/updater';
import { NeutralinoApiError } from '../types/errors';

let manifest: Manifest = null;

async function extractManifest(response) {
    manifest = JSON.parse(await response.text());

    const isValid = manifest.applicationId
        && manifest.applicationId == window.NL_APPID
        && manifest.version
        && manifest.resourcesURL;

    if (isValid) {
        return manifest;
    }

    throw new NeutralinoApiError({
        code: 'NE_UP_CUPDMER',
        message: 'Invalid update manifest or mismatching applicationId',
    });
}

export async function checkForUpdates(url: string): Promise<Manifest> {
    if (!url) {
        throw new NeutralinoApiError({
            code: 'NE_RT_NATRTER',
            message: 'Missing require parameter: url',
        });
    }

    try {
        const response = await fetch(url);
        return await extractManifest(response);
    } catch {
        throw new NeutralinoApiError({
            code: 'NE_UP_CUPDERR',
            message: 'Unable to fetch update manifest',
        });
    }
}

export async function install(): Promise<object> {
    if (!manifest) {
        throw new NeutralinoApiError({
            code: 'NE_UP_UPDNOUF',
            message: 'No update manifest loaded. Make sure that '
                + 'updater.checkForUpdates() is called before install().',
        });
    }

    try {
        const response = await fetch(manifest.resourcesURL);
        const resourcesBuffer = await response.arrayBuffer();
        await filesystem.writeBinaryFile(
            window.NL_PATH + '/resources.neu',
            resourcesBuffer,
        );

        return {
            success: true,
            message: 'Update installed. Restart the process to see updates',
        };
    } catch {
        throw new NeutralinoApiError({
            code: 'NE_UP_UPDINER',
            message: 'Update installation error',
        });
    }
}
