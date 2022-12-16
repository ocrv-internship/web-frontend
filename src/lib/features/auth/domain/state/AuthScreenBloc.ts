import { Bloc } from "../../../../core/utils/bloc/Bloc";
import BlocComponentsFactory from "../../../../core/utils/bloc/BlocComponentsFactory";
import AuthService from "../service/AuthService";

export enum AuthType {
    login, 
    registration, 
};

export interface AuthScreenState {
    type: AuthType, 
};


class AuthScreenBloc extends Bloc<AuthScreenState> {
    constructor(private readonly auth: AuthService) {
        super({type: AuthType.login});

        this.toggleType = this.toggleType.bind(this);
    }

    toggleType() {
        this.emit({
            type: this.state.type === AuthType.login ? AuthType.registration : AuthType.login,
        });
    }
}

export default AuthScreenBloc; 

export const {
    Provider: AuthScreenProvider, 
    Builder: AuthScreenBuilder,
    Context: AuthScreenContext,
} = BlocComponentsFactory<AuthScreenState, AuthScreenBloc>();