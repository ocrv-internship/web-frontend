import { useContext } from "react";
import { RecordingContext, RecordingState, RecordingStateType } from "../../../../domain/state/RecordingBloc";
import { TextsContext } from "../../../../domain/state/TextsBloc";
import "./Recording.css";

export interface RecordingProps {
    state: RecordingState,
}

export function Recording({ state }: RecordingProps) {
    return (
        <div id="recording">
            <AudioWave audioURL={state.recordingURL}/>
            <Actions state={state}/>
        </div>
    )
}

function AudioWave({ audioURL }: { audioURL?: string }) {
    return (
        <div id="audiowave" className="card">
            {audioURL != null ? <audio controls src={audioURL} itemType="audio/mp3"/> : <div></div>}
        </div>
    );
}

// TODO: refactor this
function Actions({ state }: { state: RecordingState }) {
    const textsBloc = useContext(TextsContext)!;
    const recordingBloc = useContext(RecordingContext)!;
    console.log("rebuilding actions");
    console.log(state);
    switch (state.type) {
        case RecordingStateType.initial:
            return (
                <div id="actions">
                    <button onClick={recordingBloc.onStartPressed} className="button empathetic-button">Запись</button>
                    <button onClick={textsBloc.skipPressed} className="button">Пропустить</button>
                </div>
            );
        case RecordingStateType.recording:
            return (
                <div id="actions">
                    <button onClick={recordingBloc.onStopPressed} className="button empathetic-button">Закончить</button>
                    <button onClick={recordingBloc.onCancelPressed} className="button">Отменить</button>
                </div>
            );
        case RecordingStateType.recorded: 
            const audio = state.recordingURL!;
            return (
                <div id="actions">
                    <button onClick={() => textsBloc.sendPressed(state.recordingBlob!)} className="button empathetic-button">Отправить</button>
                    <button onClick={recordingBloc.onCancelPressed} className="button">Отменить</button>
                </div>
            );
    }
}