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
            <RecordingInfo state={state} />
            <Actions state={state} />
        </section>
    )
}

function RecordingInfo({ state }: { state: MediaRecordingState }) {
    const fromDur = state.base.minDuration ? 
        <span>От <span className="recordingIndicator">{formatDuration(state.base.minDuration)}</span></span>
    :   <></>;
    const toDur = state.base.maxDuration ? 
        <span>До <span className="recordingIndicator">{formatDuration(state.base.maxDuration)}</span></span>
    :   "";

    return (
        <div id="recordingInfo">
            {state instanceof Recording ? 
                <p>
                    Запись идёт <span className="recordingIndicator">{formatDuration(state.currDuration)}</span>
                </p>
            :   <></>
            }
            {state.base.minDuration || state.base.maxDuration ?
                <span>
                    Длина записи: <br />
                    <span> </span>
                    {fromDur} 
                    <span> </span>
                    {toDur}
                </span>
            :   <></>
            }
        </div>
    );
}