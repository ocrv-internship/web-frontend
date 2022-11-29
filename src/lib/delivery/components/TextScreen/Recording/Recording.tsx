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
            <Actions state={state.type}/>
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

function Actions({ state }: { state: RecordingStateType }) {
    const skip = useContext(TextsContext)!.skipPressed;
    const recordingBloc = useContext(RecordingContext)!;
    switch (state) {
        case RecordingStateType.initial:
            return (
                <div id="actions">
                    <button onClick={recordingBloc.onStartPressed} className="button empathetic-button">Запись</button>
                    <button className="button" onClick={skip}>Пропустить</button>
                </div>
            );
        case RecordingStateType.recording:
            return (
                <div id="actions">
                    <button onClick={recordingBloc.onStopPressed} className="button empathetic-button">Закончить</button>
                    <button className="button">Отменить</button>
                </div>
            );
        case RecordingStateType.recorded: 
            return (
                <div id="actions">
                    <button className="button empathetic-button">Отправить</button>
                    <button onClick={recordingBloc.onCancelPressed} className="button">Отменить</button>
                </div>
            );
    }
}