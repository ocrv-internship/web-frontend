import { map, Observable } from "rxjs";
import { Failure } from "../../../../core/errors/failures";
import { jsonHeaders } from "../../../../core/utils/utils";
import NetworkAuthDataSource from "../datasources/NetworkAuthDataSource";
import TokenDataSource from "../datasources/TokenDataSource";
import AuthService, { AuthToken } from "./AuthService";
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
    logout = () => withErrorHandling(() => 
        this.store.delete()
    );
    isAuthenticatedStream = () => withErrorHandling(async () => 
        this.store.stream().pipe(map((t) => t !== null))
    )
    login = async (username: string, password: string) => {
        return withErrorHandling(async () => {
            console.log("asdf");
            const token = await this.net.login(username, password);
            console.log(token);
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