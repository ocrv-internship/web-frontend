import { Failure } from "../../../../core/errors/failures";
import { jsonHeaders } from "../../../../core/utils/utils";
import AuthService, { AuthToken } from "./AuthService";

const TOKEN_KEY = "AUTH_TOKEN";

export interface AuthEndpoints {
    login: string, 
    register: string, 
};

class TokenAuthService implements AuthService {
    constructor(private readonly ep: AuthEndpoints) {}

    async isAuthenticated() {
        return this.getToken() !== null;
    }
    async getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }
    async logout() {
        localStorage.removeItem(TOKEN_KEY);
    }
    async login(username: string, password: string) {
        // TODO: implement form error handling
        const response = await fetch(this.ep.login, {
            headers: {
                ...jsonHeaders, 
            }
        });
        const json = await response.json();
        return json.token;
    }
    async register(username: string, password: string) {
        // TODO: implement form error handling
        const response = await fetch(this.ep.login, {
            headers: {
                ...jsonHeaders, 
            }
        });
        const json = await response.json();
        return json.token;
    }
}

export default TokenAuthService; 