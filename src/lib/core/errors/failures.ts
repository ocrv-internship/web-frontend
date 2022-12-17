export abstract class Failure {
    abstract get msg(): string;
};


export class NetworkFailure extends Failure {
    constructor(readonly msg: string, readonly code: number) {super();};
}

const unknownNetworkFailureMsg =  "При обработке запроса произошла неизвестная ошибка.";
export class UnknownNetworkFailure extends NetworkFailure {
    constructor(readonly code: number, readonly json?: any) {
        super(unknownNetworkFailureMsg, code);
    };
}

export class UnknownFailure extends Failure {
    constructor(readonly msg: string = "Произошла неизвестная ошибка.") {super();};
}

export class RecordingNotSupported extends Failure {
    get msg() {
        return "Запись с требуемыми параметрами недоступна на Вашем устройстве.";
    }
}

export class RecordingNotAllowed extends Failure {
    get msg() {
        return (
`Запись запрещена вашим Браузером.
Чтобы начать запись, нужно разрешить доступ после перезагрузки страницы.`);
    }
}


export class RecordingStartFailure extends Failure {
    get msg() {
        return "Прооизошла ошибка при попытке начать запись.";
    }
}

export class NoTokenFailure extends Failure {
    get msg() {
        return "Для выполнения данного запроса нужно авторизоваться."; 
    }
}


export class FormFailures<FieldsFailures> extends Failure {
    constructor(
        readonly nonField?: string[], 
        readonly fields?: FieldsFailures,
    ) {super();};
    get msg() {
        return "Произошли ошибки при валидации формы."; 
    }
}
