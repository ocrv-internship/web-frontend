import { getNetworkFailure } from "../errors/errorHandling";
import { NetworkFailure } from "../errors/failures";

export type NetworkFetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>; 
export type FetcherMiddleware = (fetcher: NetworkFetcher) => NetworkFetcher;

export function FetcherExceptionMW(fetcher: NetworkFetcher): NetworkFetcher {
    return async (input: RequestInfo | URL, init?: RequestInit) => {
        const response = await fetcher(input, init);
        if (!response.ok) {
            throw getNetworkFailure(response);
        }
        return response;
    }; 
}