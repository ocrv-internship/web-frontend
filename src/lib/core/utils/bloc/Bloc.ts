import { Observable, Subject } from "rxjs";

export class Bloc<S> {
    private readonly _subject: Subject<S>;
    private _state: S;

    constructor(initial: S) {
        this._subject = new Subject();
        this._subject.next(initial);
        this._state = initial;

        this.emit = this.emit.bind(this);
        this.dispose = this.dispose.bind(this);
    }

    dispose() {
        this._subject.complete();
    }

    protected emit(newState: S) {
        this._state = newState;
        this._subject.next(newState);
    }

    get state() {
        return this._state;
    }

    get stream(): Observable<S> {
        return this._subject;
    }
}