import { Failure } from "../../../../core/errors/failures";
import { DurationSec } from "../../../../core/utils/utils";

export interface TextInfo {
    id: string, 
    text: string, 
    note: string, 
    minDuration?: DurationSec, 
    maxDuration?: DurationSec,
}


export interface TextsService {
    getTexts() : Promise<Failure | TextInfo[]>;
    skipText(id: string, retries: number): Promise<Failure | void>;
    sendSpeech(id: string, blob: Blob, retries: number): Promise<Failure | void>;
}
