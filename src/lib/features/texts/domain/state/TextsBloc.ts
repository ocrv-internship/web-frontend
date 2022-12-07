import { Bloc } from "../../../../core/utils/bloc/Bloc";
import BlocComponentsFactory from "../../../../core/utils/bloc/BlocComponentsFactory";
import { TextInfo, TextsService } from "../service/TextsService";

export enum Loading {
    skipping, 
    sending,
}

export interface LoadedState {
    texts: TextInfo[], 
    currentInd: number, 
    fullRecDurationSec: number,
    loading?: Loading, 
    err?: Error;
}

export interface RecInfo {
    blob: Blob, 
    durationSec: number,
}

export type TextsState = null | LoadedState | Error; 


export class TextsBloc extends Bloc<TextsState> {
    constructor(private readonly service: TextsService) {
        super(null);
        this.load = this.load.bind(this);
        this.emitError = this.emitError.bind(this);
        this.skipPressed = this.skipPressed.bind(this);
        this.sendPressed = this.sendPressed.bind(this); 
        this.sendSpeech = this.sendSpeech.bind(this);

        this.load();
    }
    private async load() {
        const textsRes = await this.service.getTexts() 
        if (textsRes instanceof Error) return this.emit(textsRes);
        this.emit({
            texts: textsRes, 
            currentInd: 0, 
            fullRecDurationSec: 0,
        })
    }

    async sendPressed(retries: number, speech: RecInfo) {
        this.sendSpeech(retries, speech);
    }
    async skipPressed(retries: number) {
        this.sendSpeech(retries, null);
    }

    // if speech is null, skips this text
    private async sendSpeech(retries: number, speech: RecInfo | null) {
        const current = this.state;
        if (current == null || current instanceof Error) return; 
        this.emit({
            ...current, 
            loading: speech ? Loading.sending : Loading.skipping, 
        })

        const textId = current.texts[current.currentInd].id;
        const error = speech ? 
                await this.service.sendSpeech(textId, speech.blob, retries)
            :   await this.service.skipText(textId, retries);
        if (error != null) return this.emitError(error);
        this.emit({
            texts: current.texts, 
            currentInd: current.currentInd === current.texts.length-1 ? -1 : current.currentInd + 1, 
            fullRecDurationSec: current.fullRecDurationSec + (speech?.durationSec ?? 0),
        })
    }

    private emitError(e: Error) {
        const current = this.state; 
        if (current == null) return;
        else if (current instanceof Error) this.emit(e);
        else this.emit({...current, loading: undefined, err: e});
    }

}

export const {
    Provider: TextsProvider, 
    Builder: TextsBuilder,
    Context: TextsContext,
} = BlocComponentsFactory<TextsState, TextsBloc>();