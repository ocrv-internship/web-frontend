import MediaRecorderBloc, { RecordingBuilder, RecordingProvider } from "../../../domain/state/MediaRecorderBloc";
import { MediaRecorder } from "./MediaRecorder";

export function MediaRecorderContainer() {
    return (
        <RecordingProvider create={() => new MediaRecorderBloc()}>
            <RecordingBuilder builder={(snapshot) => snapshot === null ? <div></div> : <MediaRecorder state={snapshot} />} />
        </RecordingProvider>
    );
}