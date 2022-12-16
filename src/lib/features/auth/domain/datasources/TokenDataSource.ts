import { Observable } from "rxjs";

abstract class TokenDataSource {
    abstract retrieve(): Promise<string | null>; 
    abstract set(token: string): Promise<void>; 
    abstract delete(): Promise<void>; 
    abstract stream(): Observable<string | null>;
}

export default TokenDataSource; 