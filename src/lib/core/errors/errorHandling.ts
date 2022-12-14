import { Failure, NetworkFailure, UnknownFailure, UnknownNetworkFailure } from "./failures";


export function getNetworkFailure(response: Response): Promise<Failure> {
    console.log(response);
    return response.json()
        .then((json: {detail: string}) => 
            new NetworkFailure(json.detail)
        )
        .catch((e) => new UnknownNetworkFailure());
}

export function convertError(e: any, fallback?: Failure) {
    console.log(`converting an error: ${e}`);
    return e instanceof Failure ? e : fallback ?? new UnknownFailure();
}

export function withErrorHandling<T>(callback: () => Promise<T>): Promise<Failure | T> {
    return callback().then((res) => res).catch((e) => convertError(e));
}