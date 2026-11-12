import type { NetFetchResponse, NetFetchResponseType } from '../types/api/net';

// Statuses that must not carry a body (see the Fetch standard)
const NULL_BODY_STATUSES: number[] = [204, 205, 304];

export interface NeutralinoFetchResponseInit {
    status: number;
    statusText: string;
    headers: HeadersInit;
    url: string;
    type?: NetFetchResponseType;
    redirected?: boolean;
}

/** Delegates body handling to a platform `Response`; `url` is the requested URL. */
export class NeutralinoFetchResponse implements NetFetchResponse {
    readonly #response: Response;
    readonly url: string;
    readonly type: NetFetchResponseType;
    readonly redirected: boolean;

    private constructor(
        response: Response,
        url: string,
        type: NetFetchResponseType,
        redirected: boolean,
    ) {
        this.#response = response;
        this.url = url;
        this.type = type;
        this.redirected = redirected;
    }

    static create(body: Uint8Array, init: NeutralinoFetchResponseInit): NeutralinoFetchResponse {
        if (init.status < 200 || init.status > 599) {
            throw new RangeError(`Invalid response status code: ${init.status}`);
        }

        const hasBody = body.length > 0 && !NULL_BODY_STATUSES.includes(init.status);
        const response = new Response(hasBody ? (body as BodyInit) : null, {
            status: init.status,
            statusText: init.statusText,
            headers: init.headers,
        });

        return new NeutralinoFetchResponse(
            response,
            init.url,
            init.type ?? 'basic',
            init.redirected ?? false,
        );
    }

    get body(): ReadableStream<Uint8Array> | null {
        return this.#response.body;
    }

    get bodyUsed(): boolean {
        return this.#response.bodyUsed;
    }

    get headers(): Headers {
        return this.#response.headers;
    }

    get ok(): boolean {
        return this.#response.ok;
    }

    get status(): number {
        return this.#response.status;
    }

    get statusText(): string {
        return this.#response.statusText;
    }

    arrayBuffer(): Promise<ArrayBuffer> {
        return this.#response.arrayBuffer();
    }

    blob(): Promise<Blob> {
        return this.#response.blob();
    }

    async bytes(): Promise<Uint8Array> {
        return new Uint8Array(await this.#response.arrayBuffer());
    }

    formData(): Promise<FormData> {
        return this.#response.formData();
    }

    json(): Promise<any> {
        return this.#response.json();
    }

    text(): Promise<string> {
        return this.#response.text();
    }

    clone(): NetFetchResponse {
        return new NeutralinoFetchResponse(
            this.#response.clone(),
            this.url,
            this.type,
            this.redirected,
        );
    }
}
