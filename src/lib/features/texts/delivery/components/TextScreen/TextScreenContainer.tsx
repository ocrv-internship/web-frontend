import Spinner from "../../../../../core/delivery/components/Spinner/Spinner";
import { Failure } from "../../../../../core/errors/failures";
import { uiDeps } from "../../../../../di";
import { TextsBuilder, TextsProvider } from "../../../domain/state/TextsBloc";
import { LoadedTextScreen } from "./TextScreen";
import "./TextScreen.css";

export function TextScreenContainer({ }) {
    return (
        <div id="textScreen">
            <TextsProvider create={uiDeps.textsBloc}>
                <TextsBuilder builder={(snapshot) => {
                    if (snapshot == null) {
                        return <Spinner />;
                    }
                    else if (snapshot instanceof Failure) {
                        return <p className="error">{snapshot.msg}</p> // TODO: error handling
                    }
                    return <LoadedTextScreen state={snapshot} />
                }} />
            </TextsProvider>
        </div>
    );
}