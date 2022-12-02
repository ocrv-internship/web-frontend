import { Bloc } from "../../../../core/utils/bloc/Bloc";
import BlocComponentsFactory from "../../../../core/utils/bloc/BlocComponentsFactory";
import { convertError } from "../../../../core/utils/utils";
import { TextInfo, TextsService } from "../service/TextsService";

export interface LoadedState {
    texts: TextInfo[], 
    currentInd: number, 
    loadingSmth?: boolean, 
    err?: Error;
}

export type TextsState = null | LoadedState | Error; 


export class TextsBloc extends Bloc<TextsState> {
    constructor(private readonly service: TextsService) {
        super(null);
        this.load = this.load.bind(this);
        this.emitError = this.emitError.bind(this);
        this.emitNextInd = this.emitNextInd.bind(this);
        this.skipPressed = this.skipPressed.bind(this);

        this.load();
    }
    private async load() {
        const textsRes = await this.service.getTexts() 
        if (textsRes instanceof Error) return this.emit(textsRes);
        this.emit({
            texts: textsRes, 
            currentInd: 0, 
        })
    }
    // TODO: remove code duplication with skipPressed
    async sendPressed(speech: Blob, retries: number) {
        const current = this.state;
        if (current == null || current instanceof Error) return; 
        this.emit({
            ...current, 
            loadingSmth: true, 
        })
        const error = await this.service.sendSpeech(current.texts[current.currentInd].id, speech, retries);
        if (error != null) return this.emitError(error);
        this.emitNextInd(current);
    }

    async skipPressed(retries: number) {
        const current = this.state;
        if (current == null || current instanceof Error) {
            return; 
        }
        this.emit({
            ...current, 
            loadingSmth: true, 
        })
        const error = await this.service.skipText(current.texts[current.currentInd].id, retries)
        if (error != null) return this.emit(convertError(error));
        this.emitNextInd(current);
    }

    private emitError(e: Error) {
        const current = this.state; 
        if (current == null) return;
        else if (current instanceof Error) this.emit(e);
        else this.emit({...current, loadingSmth: false, err: e});
    }

    private emitNextInd(current: LoadedState) {
        this.emit({
            texts: current.texts, 
            currentInd: current.currentInd === current.texts.length-1 ? -1 : current.currentInd + 1, 
        })
    }

}

export const {
    Provider: TextsProvider, 
    Builder: TextsBuilder,
    Context: TextsContext,
} = BlocComponentsFactory<TextsState, TextsBloc>();