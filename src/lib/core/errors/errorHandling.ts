import { Failure, NetworkFailure, UnknownFailure, UnknownNetworkFailure } from "./failures";


export function getNetworkFailure(response: Response) {
    return response.json()
        .then((json: {display_message: string}) => 
            new NetworkFailure(json.display_message)
        )
        .catch((e) => new UnknownNetworkFailure());
}

export function convertError(e: any, fallback?: Failure) {
    console.log(`converting an error: ${e}`);
    return e instanceof Failure ? e : fallback ?? new UnknownFailure();
}