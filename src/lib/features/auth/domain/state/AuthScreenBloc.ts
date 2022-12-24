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
    isLoading: boolean,
    failures?: FormFailures<AuthFieldsFailures>,
};

type AuthMethod = (username: string, password: string) => Promise<void | Failure>;


class AuthScreenBloc extends Bloc<AuthScreenState> {
    constructor(private readonly auth: AuthService) {
        super({type: AuthType.login, isLoading: false});

    }

    toggleType = () => {
        this.emit({
            type: this.state.type === AuthType.login ? AuthType.registration : AuthType.login,
            isLoading: false, 
        });
    }

    clearFailures = () => {
        if (!this.state.failures) return;
        this.emit({type: this.state.type, isLoading: false});
    }

    onLogin = async (username: string, password: string) => {
        return this.onAuth(this.auth.login, username, password);
    }
    onRegister = async (username: string, password: string, passwordRepeat: string) => {
        if (password != passwordRepeat) {
            return this.emit({
                type: this.state.type,
                isLoading: false, 
                failures: new FormFailures(undefined, {
                    passwordRepeat: ["Пароли не совпадают."],
                })
            });
        }
        return this.onAuth(this.auth.register, username, password);
    }

    private onAuth = async (auth: AuthMethod, username: string, password: string) => {
        this.emit({...this.state, isLoading: true})
        const result = await auth(username, password);
        if (result instanceof Failure) {
            const failures = result instanceof FormFailures<AuthFieldsFailures> 
                ? result 
                : new FormFailures<AuthFieldsFailures>([result.msg]);
            this.emit({
                ...this.state, 
                isLoading: false, 
                failures: failures,
            });
        }
    }
}

export default AuthScreenBloc; 

export const {
    Provider: AuthScreenProvider, 
    Builder: AuthScreenBuilder,
    Context: AuthScreenContext,
} = BlocComponentsFactory<AuthScreenState, AuthScreenBloc>();