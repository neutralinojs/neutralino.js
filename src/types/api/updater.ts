export interface Manifest {
    applicationId: string;
    version: string;
    resourcesURL: string;
}

export interface InstallResponse {
    success: boolean,
    message: string,
}