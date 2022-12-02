// import { APITextsService } from "./domain/service/APITextsService";
import { MockTextsService } from "./features/texts/domain/service/MockTextsService";
import { TextsBloc } from "./features/texts/domain/state/TextsBloc";

interface UIDeps {
    textsBloc: () => TextsBloc;
}

export let uiDeps: UIDeps;


// TODO: use a dependency injection lib

const service = new MockTextsService();
uiDeps = {
    textsBloc: () => new TextsBloc(service),
};