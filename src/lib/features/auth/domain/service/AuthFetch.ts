import { NoTokenFailure } from "../../../../core/errors/failures";
import AuthService from "./AuthService";

class AuthFetcher {
    constructor(private readonly auth: AuthService) { };
    async fetch(input: RequestInfo | URL, init?: RequestInit) {
        const token = await this.auth.getToken();
        if (token === null) throw new NoTokenFailure();
        return fetch(input, {
            ...init,
            headers: {
                ...init?.headers,
                'Authentication': `Token ${token}`,
            }
        });
    }
}


export default AuthFetcher; 