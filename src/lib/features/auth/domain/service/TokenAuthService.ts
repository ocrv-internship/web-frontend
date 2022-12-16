import { map, Observable } from "rxjs";
import { Failure } from "../../../../core/errors/failures";
import { jsonHeaders } from "../../../../core/utils/utils";
import TokenStore from "../../store/TokenStore";
import AuthService, { AuthToken } from "./AuthService";

export interface AuthEndpoints {
    login: string, 
    register: string, 
};

class TokenAuthService implements AuthService {
    constructor(private readonly s: TokenStore, private readonly ep: AuthEndpoints) {}
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
        // TODO: implement form error handling
        const response = await fetch(this.ep.login, {
            headers: {
                ...jsonHeaders, 
            }
        });
        const json = await response.json();
        const token = json.token; 
        this.s.set(token);
        return token;
    }
    async register(username: string, password: string) {
        // TODO: implement form error handling
        const response = await fetch(this.ep.login, {
            headers: {
                ...jsonHeaders, 
            }
        });
        const json = await response.json();
        const token = json.token; 
        this.s.set(token);
        return json.token;
    }
}

export default TokenAuthService; 