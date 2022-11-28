import { type } from "@testing-library/user-event/dist/type";
import { Bloc } from "../../bloc/Bloc";
import { TextInfo, TextsService } from "../service/Texts";

export interface LoadedState {
    texts: TextInfo[], 
    currentText: TextInfo, 
    retries: number, 
}

type TextsState = null | LoadedState | Error; 

class TextsBloc extends Bloc<TextsState> {
    constructor(private readonly service: TextsService) {
        super(null);
    }
    // load() {
    //     this.service.getTexts().then((res) => {
    //         if (res instanceof Error) {
    //             this.emit(res);
    //         } else if (res instanceof TextInfo) {

    //         }
    //     });
    // }
}