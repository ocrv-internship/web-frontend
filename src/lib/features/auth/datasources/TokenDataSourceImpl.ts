import { concat, concatMap, fromEvent, map, Observable, startWith } from "rxjs";
import TokenDataSource from "../domain/datasources/TokenDataSource";

const TOKEN_KEY = "AUTH_TOKEN";

class TokenDataSourceImpl implements TokenDataSource {
    constructor(private readonly s: Storage) {};
    async retrieve(): Promise<string | null> {
        return this.s.getItem(TOKEN_KEY);
    }
    async set(token: string): Promise<void> {
        this.s.setItem(TOKEN_KEY, token); 
        window.dispatchEvent(new Event("storage"));
    }
    async delete(): Promise<void> {
        this.s.removeItem(TOKEN_KEY);
        window.dispatchEvent(new Event("storage"));
    }
    stream(): Observable<string | null> {
        const current = this.retrieve();
        const storageEvents = fromEvent(window, 'storage')
            .pipe(
                concatMap((_) => this.retrieve()),
            );
        return concat(current, storageEvents);
    }
}

export default TokenDataSourceImpl;