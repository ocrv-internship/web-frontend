import { Failure } from "../../../../core/errors/failures";
import { Bloc } from "../../../../core/utils/bloc/Bloc";
import BlocComponentsFactory from "../../../../core/utils/bloc/BlocComponentsFactory";
import { TextsService } from "../service/TextsService";
import { Loading, RecInfo, TextsState } from "./TextsState";

export class TextsBloc extends Bloc<TextsState> {
    constructor(private readonly service: TextsService) {
        super(null);
        this.load();
    }
    private load = async () => {
        const textsRes = await this.service.getTexts() 
        if (textsRes instanceof Failure) return this.emit(textsRes);
        this.emit({
            texts: textsRes, 
            currentInd: 0, 
            fullRecDurationSec: 0,
        })
    }

    sendPressed = async (retries: number, speech: RecInfo) => {
        this.sendSpeech(retries, speech);
    }
    skipPressed = async (retries: number) => {
        this.sendSpeech(retries, null);
    }

    // if speech is null, skips this text
    private sendSpeech = async (retries: number, speech: RecInfo | null) => {
        const current = this.state;
        if (current == null || current instanceof Failure) return; 
        this.emit({
            ...current, 
            err: undefined,
            loading: speech ? Loading.sending : Loading.skipping, 
        })

        const textId = current.texts[current.currentInd].id;
        const error = speech ? 
                await this.service.sendSpeech({
                    id: textId, 
                    blob: speech.blob, 
                    isVideo: speech.isVideo, 
                    retries: retries,
                })
            :   await this.service.skipText(textId, retries);
        if (error) return this.emitFailure(error);
        this.emit({
            texts: current.texts, 
            currentInd: current.currentInd === current.texts.length-1 ? -1 : current.currentInd + 1, 
            fullRecDurationSec: current.fullRecDurationSec + (speech?.duration ?? 0),
        })
    }

    private emitFailure = (e: Failure) => {
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