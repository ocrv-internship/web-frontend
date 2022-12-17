import { Subscription } from "rxjs";
import { Bloc } from "../../../../core/utils/bloc/Bloc";
import BlocComponentsFactory from "../../../../core/utils/bloc/BlocComponentsFactory";
import AuthService from "../service/AuthService";
import { Failure } from "../../../../core/errors/failures";
import { EmitHint } from "typescript";

export enum AuthType {
    loading, 
    unauthenticated, 
    authenticated, 
};

export type AuthState = AuthType | Failure; 

class AuthBloc extends Bloc<AuthState> {
    private subscription?: Subscription;
    constructor(private readonly auth: AuthService) {
        super(AuthType.loading);
        this.load = this.load.bind(this);
        this.logout = this.logout.bind(this);
        this.load();
    }

    dispose() {
        super.dispose(); 
        this.subscription?.unsubscribe();
    }

    async logout() {
        await this.auth.logout();
    }

    async load() {
        const stream = await this.auth.isAuthenticatedStream();
        if (stream instanceof Failure) return this.emit(stream);
        this.subscription = stream
            .subscribe((isAuth) => {
                console.log(isAuth);
                this.emit(
                    isAuth ? AuthType.authenticated : AuthType.unauthenticated,
                );
            }); 
    }
}

export default AuthBloc;


export const {
    Provider: AuthProvider, 
    Builder: AuthBuilder,
    Context: AuthContext,
} = BlocComponentsFactory<AuthState, AuthBloc>();
