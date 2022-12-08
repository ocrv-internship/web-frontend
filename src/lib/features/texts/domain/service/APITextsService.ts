import { text } from "stream/consumers";
import { withErrorHandling } from "../../../../core/utils/utils";
import preprocess from "../preprocessing/preprocessing";
import { TextInfo, TextsService } from "./TextsService";

const apiHost = "https://api.ocrv.skomarov.com/api/v1/";
// const apiHost = "http://localhost:8000/api/v1/"; 

const textsEndpoint = apiHost+"texts/";
const speechesEndpoint = apiHost+"speeches/"; 
const skipsEndpoint = apiHost+"skips/";


export class APITextsService implements TextsService {
    getTexts(): Promise<Error | TextInfo[]> {
        return withErrorHandling(async () => {
            const response = await fetch(textsEndpoint, {
                'headers': {
                    'Content-Type': 'application/json',
                },
            });
            const json = await response.json();
            if (!response.ok) {
                console.log(json);
                throw Error(json['display_message']);
            }
            const texts = json["texts"] as TextInfo[]; 
            return texts.map((text) => {
                return {
                    ...text,     
                    text: preprocess(text.text),
                }
            });
        });
    }
    skipText(id: string, retries: number): Promise<Error | void> {
        return withErrorHandling(async () => {
            const body = {
                text_id: id, 
                retries: retries,
            };
            await fetch(skipsEndpoint, {
                method: "POST", 
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        })
    }
    sendSpeech(id: string, blob: Blob, retries: number): Promise<Error | void> {
        return withErrorHandling(async () => {
            const formData = new FormData();
            formData.set("text_id", id)
            formData.set("retries", retries.toString());
            formData.set("speech", blob);
            await fetch(speechesEndpoint, {
                method: "POST", 
                body: formData,
            });
        });
    }
}