import { useContext } from "react";
import Spinner from "../../../../../../core/delivery/components/Spinner/Spinner";
import { TextsContext, LoadedState, Loading } from "../../../../../texts/domain/state/TextsBloc";
import { ErrorState, Initial, MediaRecordingState, Recorded, Recording, RecordingContext } from "../../../../domain/state/MediaRecorderBloc";
import VideoPopupButton from "../../VideoPopupButton/VideoPopupButton";


export function Actions({ state }: {state: MediaRecordingState}) {
    const recordingBloc = useContext(RecordingContext)!;
    const textsBloc = useContext(TextsContext)!;
    const textsState = textsBloc.state as LoadedState;

    const buildInitial = (state: Initial) => {
        const loading = textsState.loading === Loading.skipping;
        const videoLabel = state.video ? "Выключить видео" : "Включить видео";
        const onSkip = () => textsBloc.skipPressed(recordingBloc.state.retries);
        const skipClass = "simple" + (loading ? " button-loading" : "");
        return (
            <div id="actions">
                <button onClick={recordingBloc.onStartPressed} className="highlighted">Запись</button>
                <button onClick={recordingBloc.onVideoTogglePressed} className="simple">{videoLabel}</button>
                <button onClick={onSkip} className={skipClass}>
                    {loading ? < Spinner /> : <></>}
                    <p>Пропустить</p>
                </button>
            </div>
        );
    }
    const buildRecording = (state: Recording) => (
        <div id="actions">
            <button onClick={recordingBloc.onStopPressed} className="highlighted">Закончить</button>
            <button onClick={recordingBloc.onCancelPressed} className="simple">Отменить</button>
        </div>
    );
    const buildRecorded = (state: Recorded) => {
        const loading = textsState.loading === Loading.sending;
        const onSend = () => textsBloc.sendPressed(state.retries, state.rec);
        const sendClass = "highlighted" + (loading ? " button-loading" : "");
        return (
            <div id="actions">
                <button onClick={onSend} className={sendClass}>
                    {textsState.loading === Loading.sending ? < Spinner /> : <></>}
                    <p>Отправить</p>
                </button>
                <VideoPopupButton video={state.rec.blob} />
                <button onClick={recordingBloc.onCancelPressed} className="simple">Отменить</button>
            </div>
        );
    }
    const buildError = (state: ErrorState) => (
        <div id="actions">
            <p>{state.err.msg}</p>
            <button onClick={recordingBloc.onCancelPressed} className="simple">Отменить</button>
        </div>
    );

    if (state instanceof Initial) return buildInitial(state);
    else if (state instanceof Recording) return buildRecording(state);
    else if (state instanceof Recorded) return buildRecorded(state);
    else return buildError(state);
}