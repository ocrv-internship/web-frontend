import { Failure } from "../../../../core/errors/failures";

export interface AuthToken {
    token: string,
};

abstract class AuthService {
    abstract isAuthenticated(): Promise<boolean | Failure>;
    abstract getToken(): Promise<AuthToken | null | Failure>;
    abstract login(username: string, password: string): Promise<Failure | null>;
    abstract register(username: string, password: string): Promise<Failure | null>;
    abstract logout(): Promise<null>;
}

export default AuthService;