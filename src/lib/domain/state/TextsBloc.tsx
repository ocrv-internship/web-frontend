import { Bloc } from "../../bloc/Bloc";
import BlocComponentsFactory from "../../bloc/BlocComponentsFactory";
import { TextInfo, TextsService } from "../service/Texts";

export interface LoadedState {
    texts: TextInfo[], 
    currentInd: number, 
    retries: number, 
}

export type TextsState = null | LoadedState | Error; 


export class TextsBloc extends Bloc<TextsState> {
    constructor(private readonly service: TextsService) {
        super(null);
        this.load();
    }
    private async load() {
        try {
            const texts = await this.service.getTexts() 
            this.emit({
                texts: texts, 
                currentInd: 0, 
                retries: 0,
            })
        } catch (e) {
            this.emit(e instanceof Error ? e : Error(`unknown: ${e}`));
        }
    }
}

export const {
    Provider: TextsProvider, 
    Builder: TextsBuilder,
    Context: TextsContext,
} = BlocComponentsFactory<TextsState, TextsBloc>();