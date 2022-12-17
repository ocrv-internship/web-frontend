import { map } from "rxjs";
import NetworkAuthDataSource from "../datasources/NetworkAuthDataSource";
import TokenDataSource from "../datasources/TokenDataSource";
import AuthService from "./AuthService";
import { withErrorHandling } from "../../../../core/errors/errorHandling";

class TokenAuthService implements AuthService {
    constructor(
        private readonly store: TokenDataSource,
        private readonly net: NetworkAuthDataSource,
    ) {}
    isAuthenticated = () => withErrorHandling(async () => 
        this.getToken() !== null
    );
    getToken = () => withErrorHandling(() => 
        this.store.retrieve()
    );
    logout = () => withErrorHandling(async () => {
        await this.store.delete();
        await this.net.logout();
    });
    isAuthenticatedStream = () => withErrorHandling(async () => 
        this.store.stream().pipe(map((t) => t !== null))
    )
    login = async (username: string, password: string) => {
        return withErrorHandling(async () => {
            const token = await this.net.login(username, password);
            await this.store.set(token); 
        })
    }
    register = async (username: string, password: string) => {
        return withErrorHandling(async () => {
            const token = await this.net.register(username, password);
            this.store.set(token);
        })
    }
}

export default TokenAuthService; 