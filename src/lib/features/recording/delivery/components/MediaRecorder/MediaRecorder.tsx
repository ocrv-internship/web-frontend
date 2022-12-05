import { useContext } from "react";
import { ErrorState, Initial, Recorded, Recording, RecordingContext, RecordingState } from "../../../domain/state/MediaRecorderBloc";
import VideoPopupButton from "../VideoPopupButton/VideoPopupButton";
import "./MediaRecorder.css";
import Spinner from "../../../../../core/delivery/components/Spinner/Spinner";
import { LoadedState, Loading, TextsContext } from "../../../../texts/domain/state/TextsBloc";

export interface RecordingCallbacks {
    onRecorded: (retries: number, recording: Blob) => void,
    onSkipped: (retries: number) => void,
}

export interface MediaRecorderProps {
    state: RecordingState,
}

export function MediaRecorder(props: MediaRecorderProps) {
    return (
        <div className="card" id="recording">
            {props.state instanceof Recording ? <RecordingInfo durationSec={props.state.durationSec} /> : <div></div>}
            <Actions {...props} />
        </div>
    )
}

function RecordingInfo({ durationSec }: { durationSec: number }) {
    const min = Math.floor(durationSec / 60).toString();
    const sec = (durationSec % 60).toString().padStart(2, "0");
    return (
        <div id="recordingInfo">
            <p id="isRecordingLabel">Запись идёт</p>
            <p>{`${min}:${sec}`}</p>
        </div>
    );
}

function Actions({ state }: MediaRecorderProps) {
    const recordingBloc = useContext(RecordingContext)!;
    const textsBloc = useContext(TextsContext)!;
    const textsState = textsBloc.state as LoadedState;

    const buildInitial = (state: Initial) => (
        <div id="actions">
            <button onClick={recordingBloc.onStartPressed} className="button empathetic-button">Запись</button>
            <button onClick={() => textsBloc.skipPressed(recordingBloc.state.retries)} className="button">
                {textsState.loading === Loading.skip ?  < Spinner /> : <div />}
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
            <button onClick={() => textsBloc.sendPressed(state.retries, state.blob)} className="button empathetic-button">
                {textsState.loading === Loading.sending ?  < Spinner /> : <div />}
                Отправить
            </button>
            <VideoPopupButton video={state.blob} />
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