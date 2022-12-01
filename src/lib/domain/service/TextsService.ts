
export interface TextInfo {
    id: string, 
    text: string, 
    note: string, 
}


export interface TextsService {
    getTexts() : Promise<TextInfo[]>;
    skipText(id: string, retries: number): Promise<void>;
    sendSpeech(id: string, blob: Blob, retries: number): Promise<void>;
}
