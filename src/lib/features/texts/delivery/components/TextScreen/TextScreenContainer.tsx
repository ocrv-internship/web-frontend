import { ErrorScreen } from "../../../../../core/delivery/components/ErrorScreen/ErrorScreen";
import Spinner from "../../../../../core/delivery/components/Spinner/Spinner";
import { Failure } from "../../../../../core/errors/failures";
import { uiDeps } from "../../../../../di";
import { TextsBuilder, TextsProvider } from "../../../domain/state/TextsBloc";
import { LoadedTextScreen } from "./TextScreen";
import "./TextScreen.css";

export function TextScreenContainer({ }) {
    return (
            <TextsProvider create={uiDeps.textsBloc}>
                <TextsBuilder builder={(snapshot) => {
                    if (snapshot == null) {
                        return <Spinner />;
                    }
                    else if (snapshot instanceof Failure) {
                        return <ErrorScreen err={snapshot} />;
                    }

                    return (
                        <div id="textScreen">
                            <LoadedTextScreen state={snapshot} />
                        </div>
                    );
                }} />
            </TextsProvider>
    );
}