import { FormFailures } from "../../../../core/errors/failures";
import { Bloc } from "../../../../core/utils/bloc/Bloc";
import BlocComponentsFactory from "../../../../core/utils/bloc/BlocComponentsFactory";
import { AuthFieldsFailures } from "../../datasources/NetworkAuthDataSourceImpl";
import AuthService from "../service/AuthService";

export enum AuthType {
    login, 
    registration, 
};

export interface AuthScreenState {
    type: AuthType, 
};

type AuthMethod = (username: string, password: string) => Promise<void>;


class AuthScreenBloc extends Bloc<AuthScreenState> {
    constructor(private readonly auth: AuthService) {
        super({type: AuthType.login});
        console.log('created');

        this.toggleType = this.toggleType.bind(this);
        this.onLogin = this.onLogin.bind(this); 
        this.onRegister = this.onRegister.bind(this);
    }
    dispose() {
        console.log('disposed');
        super.dispose();
    }

    toggleType() {
        this.emit({
            type: this.state.type === AuthType.login ? AuthType.registration : AuthType.login,
        });
    }

    async onLogin(username: string, password: string) {
        this.onAuth(this.auth.login, username, password);
    }
    async onRegister(username: string, password: string, passwordRepeat: string) {
        this.onAuth(this.auth.register, username, password);
    }

    private async onAuth(auth: AuthMethod, username: string, password: string) {
        try {
            await auth(username, password);
        } catch (e) {
            if (e instanceof FormFailures<AuthFieldsFailures>) {
                console.log(e.nonField);
                console.log(e.fields); 
            }
        }
    }
}

export default AuthScreenBloc; 

export const {
    Provider: AuthScreenProvider, 
    Builder: AuthScreenBuilder,
    Context: AuthScreenContext,
} = BlocComponentsFactory<AuthScreenState, AuthScreenBloc>();