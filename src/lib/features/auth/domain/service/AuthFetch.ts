import { NoTokenFailure } from "../../../../core/errors/failures";
import { FetcherExceptionMW, NetworkFetcher } from "../../../../core/fetcher/fetcher";
import AuthService from "./AuthService";

export function newFetcherAuthMW(auth: AuthService) {
    return (fetcher: NetworkFetcher) => {
        return async (input: RequestInfo | URL, init?: RequestInit) => {
            const token = await auth.getToken();
            if (token === null) throw new NoTokenFailure();
            return fetcher(input, {
                ...init,
                headers: {
                    ...init?.headers,
                    'Authorization': `Token ${token}`,
                }
            });
        }
    }
}


export default newFetcherAuthMW; 