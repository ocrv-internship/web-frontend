import { getNetworkFailure, withErrorHandling } from "../../../../core/errors/errorHandling";
import { Failure } from "../../../../core/errors/failures";
import { NetworkFetcher } from "../../../../core/fetcher/fetcher";
import { jsonHeaders } from "../../../../core/utils/utils";
import AuthFetcher from "../../../auth/domain/service/AuthFetch";
import preprocess from "../preprocessing/preprocessing";
import { mapText, TextJson } from "./mappers";
import { SpeechInfo, TextInfo, TextsService } from "./TextsService";



const baseParams: RequestInit = {
    headers: {
        ...jsonHeaders,
    },
}

export interface TextsEndpoints {
    texts: string, 
    speeches: string, 
    skips: string,  
}

export class APITextsService implements TextsService {
    constructor(private readonly fetcher: NetworkFetcher, private readonly ep: TextsEndpoints) {};

    getTexts(): Promise<Failure | TextInfo[]> {
        return withErrorHandling(async () => {
            const response = await this.fetcher(this.ep.texts, baseParams);
            const json = await response.json();
            const texts = (json["texts"] as TextJson[]).map(mapText); 
            return texts.map((text) => {
                return {
                    ...text,     
                    text: preprocess(text.text),
                }
            });
        });
    }
    skipText(id: string, retries: number): Promise<Failure | void> {
        return withErrorHandling(async () => {
            const body = {
                text_id: id, 
                retries: retries,
            };
            const response = await this.fetcher(this.ep.skips, {
                ...baseParams,
                method: "POST", 
                body: JSON.stringify(body),
            });
        })
    }
    sendSpeech(speech: SpeechInfo): Promise<Failure | void> {
        return withErrorHandling(async () => {
            const formData = mapSpeech(speech);
            const response = await this.fetcher(this.ep.speeches, {
                ...baseParams,
                method: "POST", 
                body: formData,
            });
        });
    }
}


function mapSpeech(speech: SpeechInfo): FormData {
    const formData = new FormData();
    formData.set("text_id", speech.id)
    formData.set("retries", speech.retries.toString());
    formData.set("is_video", speech.isVideo.toString());
    formData.set("speech", speech.blob);
    return formData;
}