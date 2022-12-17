import { withErrorHandling } from "../../../../core/errors/errorHandling";
import { Failure } from "../../../../core/errors/failures";
import { SpeechInfo, TextInfo, TextsService } from "./TextsService";




export class APITextsService implements TextsService {
    constructor() {};

    getTexts(): Promise<Failure | TextInfo[]> {
        return withErrorHandling(async () => {
            throw Error("unimplemented");
        });
    }
    skipText(id: string, retries: number): Promise<Failure | void> {
        return withErrorHandling(async () => {
            throw Error("unimplemented");
        })
    }
    sendSpeech(speech: SpeechInfo): Promise<Failure | void> {
        return withErrorHandling(async () => {
            throw Error("unimplemented");
        });
    }
}

