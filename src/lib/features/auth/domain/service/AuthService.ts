import { Observable } from "rxjs";
import { Failure } from "../../../../core/errors/failures";

export type AuthToken = string;

export interface AuthFieldsFailures {
    username?: string[], 
    password?: string[],
}

abstract class AuthService {
    abstract isAuthenticated(): Promise<boolean | Failure>;
    abstract getToken(): Promise<AuthToken | null | Failure>;
    abstract isAuthenticatedStream(): Promise<Observable<boolean> | Failure>;
    abstract login(username: string, password: string): Promise<void | Failure>;
    abstract register(username: string, password: string): Promise<void | Failure>;
    abstract logout(): Promise<void | Failure>;
}

export default AuthService;