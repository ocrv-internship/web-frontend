import { SpeechInfo, TextInfo } from "../domain/service/TextsService";


interface TextJson {
    id: string, 
    text: string, 
    note: string, 
    completed?: {
        url: string, 
        is_video: boolean,
    },
    min_duration?: number, 
    max_duration?: number,
}

export function mapTexts(json: any) {
    return (json["texts"] as TextJson[]).map(mapText);
}
export function mapSpeech(speech: SpeechInfo): FormData {
    const formData = new FormData();
    formData.set("text_id", speech.id)
    formData.set("retries", speech.retries.toString());
    formData.set("is_video", speech.isVideo.toString());
    formData.set("speech", speech.blob);
    return formData;
}

function mapText(json: TextJson): TextInfo {
    return {
        id: json.id, 
        text: json.text, 
        note: json.note, 
        completed: json.completed,
        minDuration: json.min_duration, 
        maxDuration: json.max_duration,
    }
}