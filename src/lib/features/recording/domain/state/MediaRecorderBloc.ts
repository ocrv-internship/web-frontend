import { convertError } from "../../../../core/errors/errorHandling";
import { Failure, RecordingStartFailure } from "../../../../core/errors/failures";
import { Bloc } from "../../../../core/utils/bloc/Bloc";
import BlocComponentsFactory from "../../../../core/utils/bloc/BlocComponentsFactory";
import { RecInfo } from "../../../texts/domain/state/TextsBloc";
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
    constructor(readonly rec: RecInfo, readonly retries: number) { };
};

export class ErrorState implements RecordingStateRetries {
    constructor(readonly err: Failure, readonly retries: number) { };
}

export type MediaRecordingState = Initial | Recording | Recorded | ErrorState;

const minVideoDuration = 2; 

class MediaRecorderBloc extends Bloc<MediaRecordingState> {
    private recorder?: SimpleRecorder;
    private durationTimer?: NodeJS.Timer;
    constructor() {
        super(new Initial(0));
        console.log("media recorder bloc created");
        this.onStartPressed = this.onStartPressed.bind(this);
        this.onStopPressed = this.onStopPressed.bind(this);
        this.onCancelPressed = this.onCancelPressed.bind(this);
        this.disposeAll = this.disposeAll.bind(this);
        this.incrementDuration = this.incrementDuration.bind(this);
    }

    dispose() {
        console.log("media recorder bloc disposed");
        super.dispose();
        this.disposeAll();
    }

    async onStartPressed() {
        this.disposeAll();
        return startRecording()
        .then((recorder) => {
            this.recorder = recorder; 
            this.emit(new Recording(0, this.state.retries));
            this.durationTimer = setInterval(this.incrementDuration, 1000);
        })
        .catch((e) => 
            this.emit(new ErrorState(
                convertError(e, new RecordingStartFailure()), 
                this.state.retries
            ),)
        );
    }
    private async incrementDuration() {
        if (this.state instanceof Recording) this.emit(new Recording(this.state.durationSec + 1, this.state.retries));
    }

    async onStopPressed() {
        if (!this.recorder || !(this.state instanceof Recording)) return; 
        if (this.state.durationSec < minVideoDuration) return this.onCancelPressed();
        const recording = await this.recorder.finish();
        this.recorder = undefined; 
        this.emit(new Recorded({
            blob: recording, 
            durationSec: this.state.durationSec,
        }, this.state.retries));
        this.disposeAll();
    }

    async onCancelPressed() {
        this.emit(new Initial(this.state.retries + 1));
        this.disposeAll();
    }

    private disposeAll() {
        clearInterval(this.durationTimer);
        this.recorder?.dispose();
        this.recorder = undefined;
    }
}

export default MediaRecorderBloc;

export const {
    Provider: RecordingProvider,
    Builder: RecordingBuilder,
    Context: RecordingContext,
} = BlocComponentsFactory<MediaRecordingState, MediaRecorderBloc>();