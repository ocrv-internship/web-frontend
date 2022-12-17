import { ConnectableObservable } from "rxjs";
import { FormFailures, UnknownNetworkFailure } from "../../../core/errors/failures";
import { NetworkFetcher } from "../../../core/fetcher/fetcher";
import { jsonHeaders } from "../../../core/utils/utils";
import NetworkAuthDataSource from "../domain/datasources/NetworkAuthDataSource";
import { AuthFieldsFailures, AuthToken } from "../domain/service/AuthService";

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
        const params = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: jsonHeaders,
        };
        return this.fetcher(endpoint, params)
            .then((r) => r.json())
            .then(({token}: {token: string}) => token)
            .catch((e) => {
                throw e instanceof UnknownNetworkFailure ? 
                    this.convertFormFailures(e)
                :   e;
            });
    }

    private convertFormFailures(e: UnknownNetworkFailure) {
        return new FormFailures<AuthFieldsFailures>(
            e.json.non_field_errors,
            e.json, 
        );
    }
}

export default NetworkAuthDataSourceImpl;