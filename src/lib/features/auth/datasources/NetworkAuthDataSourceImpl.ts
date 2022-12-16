import { NetworkFetcher } from "../../../core/fetcher/fetcher";
import { jsonHeaders } from "../../../core/utils/utils";
import NetworkAuthDataSource from "../domain/datasources/NetworkAuthDataSource";
import { AuthToken } from "../domain/service/AuthService";

export interface AuthEndpoints {
    login: string, 
    register: string, 
};

class NetworkAuthDataSourceImpl implements NetworkAuthDataSource {
    constructor(
        private readonly fetcher: NetworkFetcher,
        private readonly ep: AuthEndpoints
    ) {};


    login(username: string, password: string): Promise<AuthToken> {
        return this.authenticate(username, password, this.ep.login);
    }

    register(username: string, password: string): Promise<AuthToken> {
        return this.authenticate(username, password, this.ep.register);
    }

    private authenticate(username: string, password: string, endpoint: string): Promise<AuthToken> {
        const body = {
            username: username, 
            password: password, 
        };
        return fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                ...jsonHeaders, 
            }
        })
        .then((response) => response.json())
        .then((json) => json.token);
    }
}

export default NetworkAuthDataSourceImpl;