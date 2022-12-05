import { Loading } from "../../../../texts/domain/state/TextsBloc";
import MediaRecorderBloc, { RecordingBuilder, RecordingProvider } from "../../../domain/state/MediaRecorderBloc";
import { MediaRecorder, RecordingCallbacks } from "./MediaRecorder";

export interface MediaRecorderContainerProps {
    callbacks: RecordingCallbacks, 
    loadingState?: Loading, 
};

export function MediaRecorderContainer({}) {
    return (
        <RecordingProvider create={() => new MediaRecorderBloc()}>
            <RecordingBuilder builder={
                (snapshot) => snapshot === null ? 
                    <div></div>
                :   <MediaRecorder state={snapshot}/>
            } />
        </RecordingProvider>
    );
}