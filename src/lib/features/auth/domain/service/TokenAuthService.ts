import { map, Observable } from "rxjs";
import { Failure } from "../../../../core/errors/failures";
import { jsonHeaders } from "../../../../core/utils/utils";
import NetworkAuthDataSource from "../datasources/NetworkAuthDataSource";
import TokenDataSource from "../datasources/TokenDataSource";
import AuthService, { AuthToken } from "./AuthService";

class TokenAuthService implements AuthService {
    constructor(
        private readonly s: TokenDataSource,
        private readonly net: NetworkAuthDataSource,
    ) {}
    async isAuthenticated() {
        return this.getToken() !== null;
    }
    getToken() {
        return this.s.retrieve();
    }
    logout() {
        return this.s.delete();
    }
    isAuthenticatedStream(): Observable<boolean> {
        return this.s.stream().pipe(map((t) => t !== null));
    }

    async login(username: string, password: string) {
        const token = await this.net.login(username, password);
        this.s.set(token); 
    }
    async register(username: string, password: string) {
        const token = await this.net.register(username, password);
        this.s.set(token);
    }
}

export default TokenAuthService; 