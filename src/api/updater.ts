let manifest = null;

export function checkForUpdates(url: string): Promise<any> {
    function isValidManifest(manifest: any) {
        if(manifest.applicationId && manifest.applicationId == window.NL_APPID
            && manifest.version && manifest.resourcesURL) {
            return true;
        }
        return false;
    }

    return new Promise(async (resolve: any, reject: any) => {
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

export function install(url: string): Promise<any> {
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
            await Neutralino.filesystem.writeBinaryFile(window.NL_PATH + "/res.neu", resourcesBuffer);

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
