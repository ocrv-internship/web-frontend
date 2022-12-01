import { TextInfo, TextsService } from "./TextsService";

const apiHost = "https://recording.skomarov.com/api/v1/";

const textsEndpoint = apiHost+"texts";
const speechesEndpoint = apiHost+"speeches"; 
const skipsEndpoint = apiHost+"skips";

class APITextsService implements TextsService {
    async getTexts(): Promise<TextInfo[]> {
        const response = await fetch(textsEndpoint);
        const json = await response.json();
        return json["texts"] as TextInfo[];
    }
    async skipText(id: string, retries: number): Promise<void> {
        const body = {
            text_id: id, 
            retries: retries,
        };
        await fetch(skipsEndpoint, {
            method: "POST", 
            body: JSON.stringify(body),
        });
    }
    async sendSpeech(id: string, blob: Blob, retries: number): Promise<void> {
        const formData = new FormData();
        formData.set("text_id", id)
        formData.set("retries", retries.toString());
        formData.set("speech", blob);
        await fetch(speechesEndpoint, {
            method: "POST", 
            body: formData,
        });
    }
}