export abstract class Failure {
    abstract get msg(): string;
};

export class UnknownNetworkFailure extends Failure {
    get msg() {
        return "При обработке запроса произошла неизвестная ошибка.";
    } 
}

export class NetworkFailure extends Failure {
    constructor(readonly msg: string) {super();};
}

export class UnknownFailure extends Failure {
    constructor(readonly msg: string = "Произошла неизвестная ошибка.") {super();};
}

class MinDurationFailure extends Failure {
    get msg() {
        return "Не соблюдено минимальное время начитки.";
    } 
}

class MaxDurationFailure extends Failure {
    get msg() {
        return "Не соблюдено максимальное время начитки.";
    } 
}

export class RecordingNotSupported extends Failure {
    get msg() {
        return "Запись с требуемыми параметрами недоступна на Вашем устройстве.";
    }
}


export class RecordingStartFailure extends Failure {
    get msg() {
        return "Прооизошла ошибка при попытке начать запись.";
    }
}


