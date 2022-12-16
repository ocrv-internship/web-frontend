import { Bloc } from "../../../../core/utils/bloc/Bloc";
import AuthService from "../service/AuthService";

enum AuthState {
    loading, 
    unauthenticated, 
    authenticated, 
};

class AuthBloc extends Bloc<AuthState> {
    constructor(private readonly auth: AuthService) {
        super(AuthState.loading);
    }
}