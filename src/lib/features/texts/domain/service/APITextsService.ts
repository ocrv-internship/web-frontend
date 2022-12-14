import { text } from "stream/consumers";
import { convertError, getNetworkFailure, withErrorHandling } from "../../../../core/errors/errorHandling";
import { Failure } from "../../../../core/errors/failures";
import preprocess from "../preprocessing/preprocessing";
import { mapText, TextJson } from "./mappers";
import { TextInfo, TextsService } from "./TextsService";

// const apiHost = "https://api.ocrv.skomarov.com/api/v1/";
const apiHost = "http://localhost:8000/api/v1/"; 

const textsEndpoint = apiHost+"texts/";
const speechesEndpoint = apiHost+"speeches/"; 
const skipsEndpoint = apiHost+"skips/";


export class APITextsService implements TextsService {
    getTexts(): Promise<Failure | TextInfo[]> {
        return withErrorHandling(async () => {
            const response = await fetch(textsEndpoint, {
                'headers': {
                    'Content-Type': 'application/json',
                },
            });
            const json = await response.json();
            if (!response.ok) {
                throw await getNetworkFailure(response);
            }
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
                method: "POST", 
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) throw await getNetworkFailure(response);
        })
    }
    sendSpeech(id: string, blob: Blob, retries: number): Promise<Failure | void> {
        return withErrorHandling(async () => {
            const formData = new FormData();
            formData.set("text_id", id)
            formData.set("retries", retries.toString());
            formData.set("speech", blob);
            const response = await fetch(speechesEndpoint, {
                method: "POST", 
                //mode: 'no-cors', // TODO: get rid of no-cors here
                body: formData,
            });
            if (!response.ok) throw await getNetworkFailure(response);
        });
    }
}