import { Failure, NetworkFailure, UnknownFailure, UnknownNetworkFailure } from "./failures";


export function getNetworkFailure(response: Response): Promise<Failure> {
    return response.json()
        .then((json: any) => {
            const detail = json.detail; 
            if (!detail) return new UnknownNetworkFailure(json);
            return new NetworkFailure(detail);
        })
        .catch((e) => new UnknownNetworkFailure());
}

export function convertError(e: any, fallback?: Failure) {
    console.log(`caught exception ${e}`)
    return e instanceof Failure ? e : fallback ?? new UnknownFailure();
}

export function withErrorHandling<T>(callback: () => Promise<T>): Promise<Failure | T> {
    return callback().then((res) => res).catch((e) => convertError(e));
}