import { uiDeps } from "../../../di";
import { mockTexts } from "../../../domain/service/Texts";
import { TextsBuilder, TextsProvider } from "../../../domain/state/TextsBloc";
import { LoadedRecordingScreen } from "./RecordingScreen";

export function RecordingScreenContainer({ }) {
    return (
        <TextsProvider create={uiDeps.textsBloc}>
            <TextsBuilder builder={(snapshot) => {
                if (snapshot == null) {
                    return <p>Loading...</p>;
                }
                else if (snapshot instanceof Error) {
                    return <p>{snapshot.message}</p> // TODO: error handling
                }
                return <LoadedRecordingScreen state={snapshot} />
            }} />
        </TextsProvider>
    );
}