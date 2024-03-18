export interface MemoryInfo {
    physical: {
        total: number;
        available: number;
    },
    virtual: {
        total: number;
        available: number;
    }
}

export interface KernelInfo {
    variant: string;
    version: string;
}

export interface OSInfo {
    name: string;
    description: string;
    version: string;
}

export interface CPUInfo {
    vendor: string;
    model: string;
    frequency: number;
    architecture: string;
    logicalThreads: number;
    physicalCores: number;
    physicalUnits: number;
}

export interface Display {
    id: number;
    resolution: Resolution;
    dpi: number;
    bpp: number;
    refreshRate: number;
}

export interface Resolution {
    width: number;
    height: number;
}

export interface MousePosition {
    x: number;
    y: number;
}