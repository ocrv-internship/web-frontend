import { Observable } from "rxjs";
import { Failure } from "../../../../core/errors/failures";

export type AuthToken = string;

abstract class AuthService {
    abstract isAuthenticated(): Promise<boolean>;
    abstract getToken(): Promise<AuthToken | null>;
    abstract isAuthenticatedStream(): Observable<boolean>;
    abstract login(username: string, password: string): Promise<void>;
    abstract register(username: string, password: string): Promise<void>;
    abstract logout(): Promise<void>;
}

export default AuthService;