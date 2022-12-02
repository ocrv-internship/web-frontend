import { Bloc } from "../../../../core/utils/bloc/Bloc";
import BlocComponentsFactory from "../../../../core/utils/bloc/BlocComponentsFactory";
import { startRecording, SimpleRecorder } from "../service/SimpleRecorder";

export interface RecordingStateRetries {
    retries: number
};

export class Initial implements RecordingStateRetries {
    constructor(readonly retries: number) { };
};

export class Recording implements RecordingStateRetries {
    constructor(readonly durationSec: number, readonly retries: number) { };
};

export class Recorded implements RecordingStateRetries {
    constructor(readonly blob: Blob, readonly retries: number) { };
};

export class ErrorState implements RecordingStateRetries {
    constructor(readonly err: Error, readonly retries: number) { };
}

export type RecordingState = Initial | Recording | Recorded | ErrorState;

class MediaRecorderBloc extends Bloc<RecordingState> {
    private recorder?: SimpleRecorder;
    private timer?: NodeJS.Timer;
    constructor() {
        super(new Initial(0));
        this.onStartPressed = this.onStartPressed.bind(this);
        this.onStopPressed = this.onStopPressed.bind(this);
        this.onCancelPressed = this.onCancelPressed.bind(this);
        this.disposeAll = this.disposeAll.bind(this);
        this.incrementDuration = this.incrementDuration.bind(this);
    }

    dispose() {
        super.dispose();
        this.disposeAll();
    }

    async onStartPressed() {
        this.disposeAll();
        return startRecording()
        .then((recorder) => {
            this.recorder = recorder; 
            this.emit(new Recording(0, this.state.retries));
            this.timer = setInterval(this.incrementDuration, 1000);
        })
        .catch((e) => this.emit(new ErrorState(e, this.state.retries)));
    }
    private async incrementDuration() {
        if (this.state instanceof Recording) this.emit(new Recording(this.state.durationSec + 1, this.state.retries));
    }

    async onStopPressed() {
        if (!this.recorder) return; 
        const recording = await this.recorder.finish();
        this.recorder = undefined; 
        this.emit(new Recorded(recording, this.state.retries));
        this.disposeAll();
    }

    async onCancelPressed() {
        this.emit(new Initial(this.state.retries + 1));
        this.disposeAll();
    }

    private disposeAll() {
        clearInterval(this.timer);
        this.recorder?.dispose();
        this.recorder = undefined;
    }
}

export default MediaRecorderBloc;

export const {
    Provider: RecordingProvider,
    Builder: RecordingBuilder,
    Context: RecordingContext,
} = BlocComponentsFactory<RecordingState, MediaRecorderBloc>();