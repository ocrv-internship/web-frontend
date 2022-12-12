import { Failure } from "../../../../core/errors/failures";

export interface TextInfo {
    id: string, 
    text: string, 
    note: string, 
}


export interface TextsService {
    getTexts() : Promise<Failure | TextInfo[]>;
    skipText(id: string, retries: number): Promise<Failure | void>;
    sendSpeech(id: string, blob: Blob, retries: number): Promise<Failure | void>;
}
