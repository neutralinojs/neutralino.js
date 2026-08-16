export class NeutralinoApiError extends Error {
    public code;

    constructor(error: { message?: string; code?: string }) {
        super(error?.message || 'Unknown error occurred.');
        this.name = 'NeutralinoApiError';
        if (error.code) this.code = error?.code;
    }
}
