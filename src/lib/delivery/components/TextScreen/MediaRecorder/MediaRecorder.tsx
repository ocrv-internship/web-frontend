import { useContext } from "react";
import { Initial, Recorded, Recording, RecordingContext, RecordingState} from "../../../../domain/state/MediaRecorderBloc";
import { TextsContext } from "../../../../domain/state/TextsBloc";
import "./MediaRecorder.css";

export interface RecordingProps {
    state: RecordingState,
}

export function MediaRecorder({ state }: RecordingProps) {
    return (
        <div className="card" id="recording">
            {state instanceof Recording ? <RecordingInfo durationSec={state.durationSec} /> : <div></div>}
            <Actions state={state}/>
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

function AudioWave({ audioURL }: { audioURL?: string }) {
    return (
        <div id="audiowave" className="card">
            {audioURL != null ? <audio controls src={audioURL} itemType="audio/mp3"/> : <div></div>}
        </div>
    );
}

function Actions({ state }: { state: RecordingState }) {
    const textsBloc = useContext(TextsContext)!;
    const recordingBloc = useContext(RecordingContext)!;

    const buildInitial = (state: Initial) => (
        <div id="actions">
            <button onClick={recordingBloc.onStartPressed} className="button empathetic-button">Запись</button>
            <button onClick={textsBloc.skipPressed} className="button">Пропустить</button>
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
            <button onClick={() => textsBloc.sendPressed(state.blob)} className="button empathetic-button">Отправить</button>
            <button onClick={recordingBloc.onCancelPressed} className="button">Отменить</button>
        </div>
    );
    const buildError = (state: Error) => (
        <div id="actions">
            <p>{state.message}</p>
            <button onClick={recordingBloc.onCancelPressed} className="button">Отменить</button>
        </div>
    );

    if (state instanceof Initial) return buildInitial(state);
    else if (state instanceof Recording) return buildRecording(state);
    else if (state instanceof Recorded) return buildRecorded(state); 
    else return buildError(state);
}