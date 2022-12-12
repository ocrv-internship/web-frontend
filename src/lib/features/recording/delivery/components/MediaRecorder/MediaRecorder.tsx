import { useContext } from "react";
import { ErrorState, Initial, Recorded, Recording, RecordingContext, MediaRecordingState } from "../../../domain/state/MediaRecorderBloc";
import VideoPopupButton from "../RecordingPopupButton/RecordingPopupButton";
import "./MediaRecorder.css";
import Spinner from "../../../../../core/delivery/components/Spinner/Spinner";
import { LoadedState, Loading, TextsContext } from "../../../../texts/domain/state/TextsBloc";
import { Actions } from "./Actions/Actions";
import { DurationSec, formatDuration } from "../../../../../core/utils/utils";

export interface RecordingCallbacks {
    onRecorded: (retries: number, recording: Blob) => void,
    onSkipped: (retries: number) => void,
}

export interface MediaRecorderProps {
    state: MediaRecordingState,
}

export function MediaRecorder({state} : {state: MediaRecordingState}) {
    return (
        <section id="recording">
            {state instanceof Recording ? 
                <RecordingInfo dur={state.currDuration} /> 
            : <div></div>}
            <Actions state={state} />
        </section>
    )
}

function RecordingInfo({ dur: dur }: { dur: DurationSec }) {
    return (
        <div id="recordingInfo">
            <p id="isRecordingLabel">Запись идёт</p>
            <p>{formatDuration(dur)}</p>
        </div>
    );
}