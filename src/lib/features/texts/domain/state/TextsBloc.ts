import { Failure } from "../../../../core/errors/failures";
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
    err?: Failure;
}

export interface RecInfo {
    blob: Blob, 
    isVideo: boolean,
    durationSec: number,
}

export type TextsState = null | LoadedState | Failure; 


export class TextsBloc extends Bloc<TextsState> {
    constructor(private readonly service: TextsService) {
        super(null);
        this.load = this.load.bind(this);
        this.emitFailure = this.emitFailure.bind(this);
        this.skipPressed = this.skipPressed.bind(this);
        this.sendPressed = this.sendPressed.bind(this); 
        this.sendSpeech = this.sendSpeech.bind(this);

        this.load();
    }
    private async load() {
        const textsRes = await this.service.getTexts() 
        console.log(textsRes);
        if (textsRes instanceof Failure) return this.emit(textsRes);
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
        if (current == null || current instanceof Failure) return; 
        this.emit({
            ...current, 
            err: undefined,
            loading: speech ? Loading.sending : Loading.skipping, 
        })

        const textId = current.texts[current.currentInd].id;
        const error = speech ? 
                await this.service.sendSpeech(textId, speech.blob, retries)
            :   await this.service.skipText(textId, retries);
        if (error) return this.emitFailure(error);
        this.emit({
            texts: current.texts, 
            currentInd: current.currentInd === current.texts.length-1 ? -1 : current.currentInd + 1, 
            fullRecDurationSec: current.fullRecDurationSec + (speech?.durationSec ?? 0),
        })
    }

    private emitFailure(e: Failure) {
        const current = this.state; 
        if (current == null) return;
        else if (current instanceof Failure) this.emit(e);
        else this.emit({...current, loading: undefined, err: e});
    }

}

export const {
    Provider: TextsProvider, 
    Builder: TextsBuilder,
    Context: TextsContext,
} = BlocComponentsFactory<TextsState, TextsBloc>();