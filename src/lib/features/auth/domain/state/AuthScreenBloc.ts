import { Failure, FormFailures } from "../../../../core/errors/failures";
import { Bloc } from "../../../../core/utils/bloc/Bloc";
import BlocComponentsFactory from "../../../../core/utils/bloc/BlocComponentsFactory";
import AuthService, { AuthFieldsFailures } from "../service/AuthService";

export enum AuthType {
    login, 
    registration, 
};

export interface AuthScreenState {
    type: AuthType, 
    failures?: FormFailures<AuthFieldsFailures>,
};

type AuthMethod = (username: string, password: string) => Promise<void | Failure>;


class AuthScreenBloc extends Bloc<AuthScreenState> {
    constructor(private readonly auth: AuthService) {
        super({type: AuthType.login});

    }

    toggleType = () => {
        this.emit({
            type: this.state.type === AuthType.login ? AuthType.registration : AuthType.login,
        });
    }

    clearFailures = () => {
        if (!this.state.failures) return;
        this.emit({type: this.state.type});
    }

    onLogin = async (username: string, password: string) => {
        return this.onAuth(this.auth.login, username, password);
    }
    onRegister = async (username: string, password: string, passwordRepeat: string) => {
        if (password != passwordRepeat) {
            return this.emit({
                type: this.state.type,
                failures: new FormFailures(undefined, {
                    passwordRepeat: ["Пароли не совпадают."],
                })
            });
        }
        return this.onAuth(this.auth.register, username, password);
    }

    private onAuth = async (auth: AuthMethod, username: string, password: string) => {
        const result = await auth(username, password);
        if (result instanceof Failure) {
            const formFailures = (
                result instanceof FormFailures ?
                    result 
                :   new FormFailures([result.msg])
            );
            this.emit({...this.state, failures: formFailures});
        }
    }
}

export default AuthScreenBloc; 

export const {
    Provider: AuthScreenProvider, 
    Builder: AuthScreenBuilder,
    Context: AuthScreenContext,
} = BlocComponentsFactory<AuthScreenState, AuthScreenBloc>();