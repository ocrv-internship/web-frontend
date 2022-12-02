import MediaRecorderBloc, { RecordingBuilder, RecordingProvider } from "../../../domain/state/MediaRecorderBloc";
import { MediaRecorder, RecordingCallbacks } from "./MediaRecorder";

export function MediaRecorderContainer({callbacks}: {callbacks: RecordingCallbacks}) {
    return (
        <RecordingProvider create={() => new MediaRecorderBloc()}>
            <RecordingBuilder builder={
                (snapshot) => snapshot === null ? 
                    <div></div>
                :   <MediaRecorder callbacks={callbacks} state={snapshot} />
            } />
        </RecordingProvider>
    );
}