import { map, Observable } from "rxjs";
import { Failure } from "../../../../core/errors/failures";
import { jsonHeaders } from "../../../../core/utils/utils";
import NetworkAuthDataSource from "../datasources/NetworkAuthDataSource";
import TokenDataSource from "../datasources/TokenDataSource";
import AuthService, { AuthToken } from "./AuthService";
import { withErrorHandling } from "../../../../core/errors/errorHandling";

class TokenAuthService implements AuthService {
    constructor(
        private readonly s: TokenDataSource,
        private readonly net: NetworkAuthDataSource,
    ) {}
    async isAuthenticated() {
        return withErrorHandling(async () => {
            return this.getToken() !== null;
        });
    }
    getToken() {
        return withErrorHandling(async () => {
            return this.s.retrieve();
        });
    }
    logout() {
        return withErrorHandling(async () => {
            return this.s.delete();
        });
    }
    isAuthenticatedStream() {
        return withErrorHandling(async () => {
            return this.s.stream().pipe(map((t) => t !== null));
        });
    }

    async login(username: string, password: string) {
        return withErrorHandling(async () => {
            const token = await this.net.login(username, password);
            await this.s.set(token); 
        })
    }
    async register(username: string, password: string) {
        return withErrorHandling(async () => {
            const token = await this.net.register(username, password);
            this.s.set(token);
        })
    }
}

export default TokenAuthService; 