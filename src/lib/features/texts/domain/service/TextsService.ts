
export interface TextInfo {
    id: string, 
    text: string, 
    note: string, 
}


export interface TextsService {
    getTexts() : Promise<Error | TextInfo[]>;
    skipText(id: string, retries: number): Promise<Error | null>;
    sendSpeech(id: string, blob: Blob, retries: number): Promise<Error | null>;
}
