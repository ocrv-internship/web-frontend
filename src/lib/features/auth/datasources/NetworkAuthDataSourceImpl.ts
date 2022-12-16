import { FormFailures, UnknownNetworkFailure } from "../../../core/errors/failures";
import { NetworkFetcher } from "../../../core/fetcher/fetcher";
import { jsonHeaders } from "../../../core/utils/utils";
import NetworkAuthDataSource from "../domain/datasources/NetworkAuthDataSource";
import { AuthToken } from "../domain/service/AuthService";

export interface AuthEndpoints {
    login: string, 
    register: string, 
};

export interface AuthFieldsFailures {
    username?: string[], 
    password?: string[],
}

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

    private async authenticate(username: string, password: string, endpoint: string): Promise<AuthToken> {
        const body = {
            username: username, 
            password: password, 
        };
        try {
            const response = await this.fetcher(endpoint, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    ...jsonHeaders, 
                }
            })
            const json = await response.json();
            return json.token; 
        } catch (e) {
            if (e instanceof UnknownNetworkFailure) {
                throw this.convertFormFailures(e);
            }
            throw e;
        }
    }

    private async convertFormFailures(e: UnknownNetworkFailure) {
        try {
            const json = await e.response.json();
            const nonField = json.non_field_error as string; 
            const fields = json as AuthFieldsFailures;  
            return new FormFailures<AuthFieldsFailures>(fields, nonField);
        } catch { 
            return e; 
        }
    }
}

export default NetworkAuthDataSourceImpl;