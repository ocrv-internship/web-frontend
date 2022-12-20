import { NetworkFetcher } from "../../../core/fetcher/fetcher";
import { baseParams } from "../../../core/utils/utils";
import NetworkTextsDataSource from "../domain/datasources/NetworkTextsDataSource";
import { TextInfo, SpeechInfo, CompletedInfo } from "../domain/service/TextsService";
import { mapSpeech, mapTexts } from "./mappers";

export interface TextsEndpoints {
    texts: string, 
    speeches: string, 
    skips: string,  
}

class NetworkTextsDataSourceImpl implements NetworkTextsDataSource {
    // fetcher should include error handling and Authorization header setter
    constructor(private readonly fetcher: NetworkFetcher, private readonly ep: TextsEndpoints) {};
    getTexts(): Promise<TextInfo[]> {
        return this.fetcher(this.ep.texts, baseParams)
            .then((response) => response.json())
            .then((json) => mapTexts(json));
    }
    async skipText(id: string, retries: number): Promise<void> {
        const body = {
            text_id: id, 
            retries: retries,
        };
        await this.fetcher(this.ep.skips, {
            ...baseParams,
            method: "POST", 
            body: JSON.stringify(body),
        });
    }
    async sendSpeech(speech: SpeechInfo): Promise<CompletedInfo> {
        const formData = mapSpeech(speech);
        const response = await this.fetcher(this.ep.speeches, {
            ...baseParams,
            method: "POST", 
            body: formData,
            headers: {}, 
        });
        return response.json();
    }
}

export default NetworkTextsDataSourceImpl;