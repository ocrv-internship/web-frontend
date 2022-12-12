export abstract class Failure {
    abstract get msg(): string;
};

export class UnknownNetworkFailure extends Failure {
    get msg() {
        return "An unknown network failure happened";
    } 
}

export class NetworkFailure extends Failure {
    constructor(readonly msg: string) {super();};
}

export class UnknownFailure extends Failure {
    constructor(readonly msg: string = "Unknown failure.") {super();};
}

class MinDurationFailure extends Failure {
    get msg() {
        return "...";
    } 
}

class MaxDurationFailure extends Failure {
    get msg() {
        return "...";
    } 
}

class RecordingNotAllowedFailure extends Failure {
    get msg() {
        return "...";
    }
}

export class RecordingNotSupported extends Failure {
    get msg() {
        return "Recording not supported";
    }
}


export class RecordingStartFailure extends Failure {
    get msg() {
        return "Recording start failure";
    }
}


