export abstract class Failure {
    abstract get msg(): string;
};

export class UnknownNetworkFailure implements Failure {
    get msg() {
        return "An unknown network failure happened";
    } 
}

export class NetworkFailure implements Failure {
    constructor(readonly msg: string) {};
}

export class UnknownFailure implements Failure {
    constructor(readonly msg: string = "Unknown failure.") {};
}

class MinDurationFailure implements Failure {
    get msg() {
        return "...";
    } 
}

class MaxDurationFailure implements Failure {
    get msg() {
        return "...";
    } 
}

class RecordingNotAllowedFailure implements Failure {
    get msg() {
        return "...";
    }
}

export class RecordingStartFailure implements Failure {
    get msg() {
        return "...";
    }
}


