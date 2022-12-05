import { useMemo } from "react";
import { Loading } from "../../../../texts/domain/state/TextsBloc";
import MediaRecorderBloc, { RecordingBuilder, RecordingProvider } from "../../../domain/state/MediaRecorderBloc";
import { MediaRecorder, RecordingCallbacks } from "./MediaRecorder";

export interface MediaRecorderContainerProps {
    callbacks: RecordingCallbacks, 
    loadingState?: Loading, 
};

export function MediaRecorderContainer({textId} : {textId: string}) {
    const create = useMemo(() => () => new MediaRecorderBloc(), [textId]);
    return (
        <RecordingProvider create={create}>
            <RecordingBuilder builder={
                (snapshot) => snapshot === null ? 
                    <div></div>
                :   <MediaRecorder state={snapshot}/>
            } />
        </RecordingProvider>
    );
}