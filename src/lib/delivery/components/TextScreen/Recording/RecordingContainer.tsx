import RecordingBloc, { RecordingBuilder, RecordingProvider } from "../../../../domain/state/RecordingBloc";
import { Recording } from "./Recording";

export function RecordingContainer() {
    return (
        <RecordingProvider create={() => new RecordingBloc()}>
            <RecordingBuilder builder={(snapshot) => snapshot === null ? <div></div> : <Recording state={snapshot} />} />
        </RecordingProvider>
    );
}