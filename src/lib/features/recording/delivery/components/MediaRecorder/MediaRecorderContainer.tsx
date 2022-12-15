import { useMemo } from "react";
import { DurationSec } from "../../../../../core/utils/utils";
import { Loading } from "../../../../texts/domain/state/TextsState";
import MediaRecorderBloc, { RecordingBuilder, RecordingProvider } from "../../../domain/state/MediaRecorderBloc";
import { MediaRecorder, RecordingCallbacks } from "./MediaRecorder";

export interface MediaRecorderContainerProps {
    textId: string, 
    minDuration?: DurationSec, 
    maxDuration?: DurationSec,
};

export function MediaRecorderContainer(props: MediaRecorderContainerProps) {
    // Makes it so that the MediaRecorderBloc is only recreated when the user switches to another text
    const create = useMemo(() => 
        () => new MediaRecorderBloc(
            props.minDuration, 
            props.maxDuration
        ), [props.textId]
    ); 
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