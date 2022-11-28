import { MockTextsService } from "./domain/service/Texts";
import { TextsBloc } from "./domain/state/TextsBloc";

interface UIDeps {
    textsBloc: () => TextsBloc;
}

export let uiDeps: UIDeps;


// TODO: use a dependency injection lib

const service = new MockTextsService();
uiDeps = {
    textsBloc: () => new TextsBloc(service),
};