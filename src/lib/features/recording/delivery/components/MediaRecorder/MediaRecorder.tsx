import { useContext } from "react";
import { ErrorState, Initial, Recorded, Recording, RecordingContext, RecordingState} from "../../../domain/state/MediaRecorderBloc";
import { TextsContext } from "../../../../texts/domain/state/TextsBloc";
import VideoPopupButton from "../VideoPopupButton/VideoPopupButton";
import "./MediaRecorder.css";

export interface RecordingCallbacks {
    onRecorded: (retries: number, recording: Blob) => void, 
    onSkipped: (retries: number) => void,
}

export interface RecordingProps {
    state: RecordingState,
    callbacks: RecordingCallbacks,
}

export function MediaRecorder(props: RecordingProps) {
    return (
        <div className="card" id="recording">
            {props.state instanceof Recording ? <RecordingInfo durationSec={props.state.durationSec} /> : <div></div>}
            <Actions {...props}/>
        </div>
    )
}

function RecordingInfo({ durationSec }: {durationSec: number}) {
    const min = Math.floor(durationSec / 60).toString(); 
    const sec = (durationSec % 60).toString().padStart(2, "0");
    return (
        <div id="recordingInfo">
            <p id="isRecordingLabel">Запись идёт</p>
            <p>{`${min}:${sec}`}</p>
        </div>
    );
}

function Actions({state, callbacks }: RecordingProps) {
    const recordingBloc = useContext(RecordingContext)!;

    const buildInitial = (state: Initial) => (
        <div id="actions">
            <button onClick={recordingBloc.onStartPressed} className="button empathetic-button">Запись</button>
            <button onClick={() => callbacks.onSkipped(recordingBloc.state.retries)} className="button">
                Пропустить
            </button>
        </div>
    );
    const buildRecording = (state: Recording) => (
        <div id="actions">
            <button onClick={recordingBloc.onStopPressed} className="button empathetic-button">Закончить</button>
            <button onClick={recordingBloc.onCancelPressed} className="button">Отменить</button>
        </div>
    );
    const buildRecorded = (state: Recorded) => (
        <div id="actions">
            <button onClick={() => callbacks.onRecorded(state.retries, state.blob)} className="button empathetic-button">
                Отправить
            </button>
            <VideoPopupButton video={state.blob}/>
            <button onClick={recordingBloc.onCancelPressed} className="button">Отменить</button>
        </div>
    );
    const buildError = (state: ErrorState) => (
        <div id="actions">
            <p>{state.err.message}</p>
            <button onClick={recordingBloc.onCancelPressed} className="button">Отменить</button>
        </div>
    );

    if (state instanceof Initial) return buildInitial(state);
    else if (state instanceof Recording) return buildRecording(state);
    else if (state instanceof Recorded) return buildRecorded(state); 
    else return buildError(state);
}