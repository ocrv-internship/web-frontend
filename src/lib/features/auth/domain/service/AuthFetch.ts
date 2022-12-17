import { NetworkFailure, NoTokenFailure, UnknownNetworkFailure } from "../../../../core/errors/failures";
import { FetcherExceptionMW, NetworkFetcher } from "../../../../core/fetcher/fetcher";
import AuthService from "./AuthService";

export function newFetcherAuthMW(auth: AuthService) {
    return (fetcher: NetworkFetcher) => {
        return async (input: RequestInfo | URL, init?: RequestInit) => {
            const token = await auth.getToken();
            if (token === null) throw new NoTokenFailure();
            try {
                return await fetcher(input, {
                    ...init,
                    headers: {
                        ...init?.headers,
                        'Authorization': `Token ${token}`,
                    }
                });
            } catch(e) {
                if (e instanceof NetworkFailure && [401, 403].includes(e.code)) {
                    auth.logout();
                }
                throw e;
            }
        }
    }
}


export default newFetcherAuthMW; 