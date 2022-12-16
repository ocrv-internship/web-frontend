import { concatMap, fromEvent, map, Observable } from "rxjs";
import TokenStore from "./TokenStore";

const TOKEN_KEY = "AUTH_TOKEN";

class TokenStoreImpl implements TokenStore {
    constructor(private readonly s: Storage) {};
    async retrieve(): Promise<string | null> {
        return this.s.getItem(TOKEN_KEY);
    }
    async set(token: string): Promise<void> {
        return this.s.setItem(TOKEN_KEY, token);
    }
    async delete(): Promise<void> {
        return this.s.removeItem(TOKEN_KEY);
    }
    stream(): Observable<string | null> {
        return fromEvent(document, 'storage')
            .pipe(concatMap((_) => this.retrieve()));
    }
}

export default TokenStoreImpl;