import { Subscription } from "rxjs";
import { Bloc } from "../../../../core/utils/bloc/Bloc";
import BlocComponentsFactory from "../../../../core/utils/bloc/BlocComponentsFactory";
import AuthService from "../service/AuthService";

export enum AuthState {
    loading, 
    unauthenticated, 
    authenticated, 
};

class AuthBloc extends Bloc<AuthState> {
    private subscription: Subscription;
    constructor(private readonly auth: AuthService) {
        super(AuthState.loading);
        this.subscription = auth
            .isAuthenticatedStream()
            .subscribe((isAuth) => this.emit(
                isAuth ? AuthState.authenticated : AuthState.unauthenticated,
            ));
    }

    dispose() {
        super.dispose(); 
        this.subscription.unsubscribe();
    }
}

export default AuthBloc;


export const {
    Provider: AuthProvider, 
    Builder: AuthBuilder,
    Context: AuthContext,
} = BlocComponentsFactory<AuthState, AuthBloc>();
