import { SpeechInfo, TextInfo } from "../service/TextsService";

abstract class NetworkTextsDataSource {
    abstract getTexts(): Promise<TextInfo[]>; 
    abstract skipText(id: string, retries: number): Promise<void>; 
    abstract sendSpeech(speech: SpeechInfo): Promise<void>;
}

export default NetworkTextsDataSource;