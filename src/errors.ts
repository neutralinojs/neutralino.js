export class NeutralinoError extends Error {
    code: string;
    message: string;

    constructor({
        code,
        message
    }: {
        code: string;
        message: string;
    }) {
        super();
        this.code = code;
        this.message = message;
    }
}

export function logError(e) {
    const error = JSON.stringify(e);
    const errorObj = JSON.parse(error);
    if (errorObj && typeof errorObj === 'object' && 'code' in errorObj && 'message' in errorObj) {
       throw new NeutralinoError({ code: errorObj.code, message: `${errorObj.message} - code : ${errorObj.code}`});
    } else {
        console.error('Invalid error object:', errorObj);
    }
}
