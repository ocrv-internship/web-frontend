import { getNetworkFailure, withErrorHandling } from "../../../../core/errors/errorHandling";
import { Failure } from "../../../../core/errors/failures";
import preprocess from "../preprocessing/preprocessing";
import { mapText, TextJson } from "./mappers";
import { SpeechInfo, TextInfo, TextsService } from "./TextsService";

// const apiHost = "https://api.ocrv.skomarov.com/api/v1/";
const apiHost = "http://localhost:8000/api/v1/"; 

const textsEndpoint = apiHost+"texts/";
const speechesEndpoint = apiHost+"speeches/"; 
const skipsEndpoint = apiHost+"skips/";


const baseParams: RequestInit = {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
    },

}

export class APITextsService implements TextsService {
    getTexts(): Promise<Failure | TextInfo[]> {
        return withErrorHandling(async () => {
            const response = await fetch(textsEndpoint, baseParams);
            if (!response.ok) {
                throw await getNetworkFailure(response);
            }
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
            const response = await fetch(skipsEndpoint, {
                ...baseParams,
                method: "POST", 
                body: JSON.stringify(body),
            });
            if (!response.ok) throw await getNetworkFailure(response);
        })
    }
    sendSpeech(speech: SpeechInfo): Promise<Failure | void> {
        return withErrorHandling(async () => {
            const formData = new FormData();
            formData.set("text_id", speech.id)
            formData.set("retries", speech.retries.toString());
            formData.set("is_video", speech.isVideo.toString());
            formData.set("speech", speech.blob);
            const response = await fetch(speechesEndpoint, {
                ...baseParams,
                method: "POST", 
                body: formData,
            });
            if (!response.ok) throw await getNetworkFailure(response);
        });
    }
}