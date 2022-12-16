import { Failure } from "../../../../core/errors/failures";
import { jsonHeaders } from "../../../../core/utils/utils";
import AuthService, { AuthToken } from "./AuthService";

const TOKEN_KEY = "AUTH_TOKEN";

class TokenAuthService implements AuthService {
    constructor(private readonly loginEndpoint: string, private readonly registerEndpoint: string) {}

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
        const response = await fetch(this.loginEndpoint, {
            headers: {
                ...jsonHeaders, 
            }
        });
        const json = await response.json();
        return json.token;
    }
    async register(username: string, password: string) {
        // TODO: implement form error handling
        const response = await fetch(this.loginEndpoint, {
            headers: {
                ...jsonHeaders, 
            }
        });
        const json = await response.json();
        return json.token;
    }
}

export default TokenAuthService; 