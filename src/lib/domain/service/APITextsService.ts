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
    skipText(id: string, retries: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    sendAudio(id: string, blob: Blob): Promise<void> {
        throw new Error("Method not implemented.");
    }
}