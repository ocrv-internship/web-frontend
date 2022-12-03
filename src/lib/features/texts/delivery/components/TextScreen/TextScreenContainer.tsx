import Spinner from "../../../../../core/delivery/components/Spinner/Spinner";
import { uiDeps } from "../../../../../di";
import { TextsBuilder, TextsProvider } from "../../../domain/state/TextsBloc";
import { LoadedTextScreen } from "./TextScreen";

export function TextScreenContainer({ }) {
    return (
        <div id="textScreen">
            <TextsProvider create={uiDeps.textsBloc}>
                <TextsBuilder builder={(snapshot) => {
                    if (snapshot == null) {
                        return <Spinner />;
                    }
                    else if (snapshot instanceof Error) {
                        return <p>{snapshot.message}</p> // TODO: error handling
                    }
                    return <LoadedTextScreen state={snapshot} />
                }} />
            </TextsProvider>
        </div>
    );
}