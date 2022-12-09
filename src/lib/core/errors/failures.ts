export abstract class Failure {
    abstract get message(): string;
};

export class UnknownNetworkFailure implements Failure {
    get message() {
        return "An unknown network failure happened";
    } 
}

export class NetworkFailure implements Failure {
    constructor(readonly message: string) {};
}

class MinDurationFailure implements Failure {
    get message() {
        return "...";
    } 
}

class MaxDurationFailure implements Failure {
    get message() {
        return "...";
    } 
}

class RecordingNotAllowedFailure implements Failure {
    get message() {
        return "...";
    }
}


