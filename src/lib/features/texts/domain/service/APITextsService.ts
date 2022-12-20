import { withErrorHandling } from "../../../../core/errors/errorHandling";
import { Failure } from "../../../../core/errors/failures";
import NetworkTextsDataSource from "../datasources/NetworkTextsDataSource";
import { CompletedInfo, SpeechInfo, TextInfo, TextsService } from "./TextsService";
import preprocess from "../preprocessing/preprocessing";

export class APITextsService implements TextsService {
    constructor(private readonly ds: NetworkTextsDataSource) {};

    getTexts(): Promise<Failure | TextInfo[]> {
        return withErrorHandling(async () => {
            const texts = await this.ds.getTexts()
            return texts.map((txt) => {
                return {
                    ...txt,
                    text: preprocess(txt.text),
                };
            });
        });
    }
    skipText(id: string, retries: number): Promise<Failure | void> {
        return withErrorHandling(async () => {
            return this.ds.skipText(id, retries);
        });
    }
    sendSpeech(speech: SpeechInfo): Promise<Failure | CompletedInfo> {
        return withErrorHandling(async () => {
            return this.ds.sendSpeech(speech);
        });
    }
}

