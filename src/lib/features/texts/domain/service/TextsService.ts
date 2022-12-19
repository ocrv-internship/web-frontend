import { Failure } from "../../../../core/errors/failures";
import { DurationSec } from "../../../../core/utils/utils";

export interface TextInfo {
    id: string, 
    text: string, 
    note: string, 
    completed: boolean,
    minDuration?: DurationSec, 
    maxDuration?: DurationSec,
}

export interface SpeechInfo {
    id: string, 
    blob: Blob, 
    isVideo: boolean, 
    retries: number,
};


export interface TextsService {
    getTexts() : Promise<Failure | TextInfo[]>;
    skipText(id: string, retries: number): Promise<Failure | void>;
    sendSpeech(speech: SpeechInfo): Promise<Failure | void>;
}
