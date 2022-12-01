import { Bloc } from "../../bloc/Bloc";
import BlocComponentsFactory from "../../bloc/BlocComponentsFactory";
import { TextInfo, TextsService } from "../service/TextsService";

export interface LoadedState {
    texts: TextInfo[], 
    currentInd: number, 
    retries: number, 
    loadingSmth: boolean, 
}

export type TextsState = null | LoadedState | Error; 

// TODO: implement incrementing the retries count

// TODO: refactor the TextsBloc
export class TextsBloc extends Bloc<TextsState> {
    constructor(private readonly service: TextsService) {
        super(null);
        this.load = this.load.bind(this);
        this.skipPressed = this.skipPressed.bind(this);
        this.load();
    }
    private async load() {
        try {
            const texts = await this.service.getTexts() 
            this.emit({
                loadingSmth: false, 
                texts: texts, 
                currentInd: 0, 
                retries: 0,
            })
        } catch (e) {
            this.emit(e instanceof Error ? e : Error(`unknown: ${e}`));
        }
    }

    // TODO: refactor code duplication with skipPressed
    async sendPressed(speech: Blob, retries: number) {
        console.log("send pressed");
        const current = this.state;
        if (current == null || current instanceof Error) return; 
        try {
            await this.service.sendSpeech(current.texts[current.currentInd].id, speech, retries);
            this.emit({
                texts: current.texts, 
                currentInd: current.currentInd === current.texts.length-1 ? -1 : current.currentInd + 1, 
                retries: 0, 
                loadingSmth: false,
            })
        } catch (e) {
            this.emit(e instanceof Error ? e : Error(`unknown error: ${e}`));
        }
    }

    async skipPressed() {
        const current = this.state;
        if (current == null || current instanceof Error) {
            return; 
        }
        this.emit({
            ...current, 
            loadingSmth: true, 
        })
        try {
            await this.service.skipText(current.texts[current.currentInd].id, current.retries)
            this.emit({
                texts: current.texts, 
                currentInd: current.currentInd === current.texts.length-1 ? -1 : current.currentInd + 1, 
                retries: 0, 
                loadingSmth: false,
            })
        } catch (e) {
            this.emit(e instanceof Error ? e : Error(`unknown error: ${e}`));
        }
    }
}

export const {
    Provider: TextsProvider, 
    Builder: TextsBuilder,
    Context: TextsContext,
} = BlocComponentsFactory<TextsState, TextsBloc>();