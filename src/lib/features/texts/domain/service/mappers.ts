import { TextInfo } from "./TextsService";


export interface TextJson {
    id: string, 
    text: string, 
    note: string, 
    min_duration?: number, 
    max_duration?: number,
}

export function mapText(json: TextJson): TextInfo {
    return {
        id: json.id, 
        text: json.text, 
        note: json.note, 
        minDuration: json.min_duration, 
        maxDuration: json.max_duration,
    }
}