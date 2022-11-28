import { Bloc } from "../../bloc/Bloc";
import BlocComponentsFactory from "../../bloc/BlocComponentsFactory";
import { TextInfo, TextsService } from "../service/Texts";

export interface LoadedState {
    texts: TextInfo[], 
    currentInd: number, 
    retries: number, 
    loadingSmth: boolean, 
}

export type TextsState = null | LoadedState | Error; 


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

    async skipPressed() {
        const current = this.state;
        if (current == null || current instanceof Error) {
            return; 
        }
        console.log("skip pressed");
        this.emit({
            ...current, 
            loadingSmth: true, 
        })
        try {
            await this.service.skipText(current.texts[current.currentInd].id)
            this.emit({
                ...current, 
                currentInd: current.currentInd === current.texts.length-1 ? -1 : current.currentInd + 1, 
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