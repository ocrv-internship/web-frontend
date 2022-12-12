import { convertError } from "../../../../core/errors/errorHandling";
import { Failure, RecordingStartFailure } from "../../../../core/errors/failures";
import { Bloc } from "../../../../core/utils/bloc/Bloc";
import BlocComponentsFactory from "../../../../core/utils/bloc/BlocComponentsFactory";
import { DurationSec } from "../../../../core/utils/utils";
import { RecInfo } from "../../../texts/domain/state/TextsBloc";
import { startRecording, SimpleRecorder } from "../service/SimpleRecorder";

export interface BaseRecording {
    retries: number
    minDuration?: DurationSec, 
    maxDuration?: DurationSec,
};

export interface BaseRecordingState {
    base: BaseRecording,
}

export class Initial implements BaseRecordingState {
    constructor(readonly base: BaseRecording, readonly video: boolean = false) { };
};

export class Recording implements BaseRecordingState {
    constructor(
        readonly currDuration: DurationSec, 
        readonly base: BaseRecording, 
        readonly video: boolean
    ) { };
};

export class Recorded implements BaseRecordingState {
    constructor(readonly rec: RecInfo, readonly base: BaseRecording) { };
};

export class ErrorState implements BaseRecordingState {
    constructor(readonly err: Failure, readonly base: BaseRecording) { };
}

export type MediaRecordingState = Initial | Recording | Recorded | ErrorState;

const minVideoDuration = 2; 

class MediaRecorderBloc extends Bloc<MediaRecordingState> {
    private recorder?: SimpleRecorder;
    private durationTimer?: NodeJS.Timer;
    constructor(minDuration?: DurationSec, maxDuration?: DurationSec) {
        super(new Initial({
            retries: 0,
            minDuration: minDuration, 
            maxDuration: maxDuration,
        }));
        console.log("media recorder bloc created");
        this.onStartPressed = this.onStartPressed.bind(this);
        this.onStopPressed = this.onStopPressed.bind(this);
        this.onCancelPressed = this.onCancelPressed.bind(this);
        this.disposeAll = this.disposeAll.bind(this);
        this.incrementDuration = this.incrementDuration.bind(this);
        this.onVideoTogglePressed = this.onVideoTogglePressed.bind(this);
    }

    dispose() {
        console.log("media recorder bloc disposed");
        super.dispose();
        this.disposeAll();
    }

    onStartPressed() {
        const current = this.state; 
        if (!(current instanceof Initial)) return; 
        this.disposeAll();
        return startRecording(current.video)
        .then((recorder) => {
            this.recorder = recorder; 
            this.emit(new Recording(0, this.state.base, current.video));
            this.durationTimer = setInterval(this.incrementDuration, 1000);
        })
        .catch((e) => 
            this.emit(new ErrorState(
                convertError(e, new RecordingStartFailure()), 
                this.state.base
            ),)
        );
    }
    private incrementDuration() {
        if (this.state instanceof Recording) {
            this.emit(new Recording(
                this.state.currDuration + 1, 
                this.state.base, 
                this.state.video
            ));
        }
    }

    async onStopPressed() {
        if (!this.recorder || !(this.state instanceof Recording)) return; 
        if (this.state.currDuration < minVideoDuration) return this.onCancelPressed();
        const recording = await this.recorder.finish();
        this.recorder = undefined; 
        this.emit(new Recorded({
            blob: recording, 
            duration: this.state.currDuration,
            isVideo: this.state.video,  
        }, this.state.base));
        this.disposeAll();
    }

    onVideoTogglePressed() {
        const current = this.state; 
        if (!(current instanceof Initial)) return; 
        this.emit(new Initial(current.base, !current.video));
    }

    onCancelPressed() {
        this.emit(new Initial({
            ...this.state.base,
            retries: this.state.base.retries + 1
        }));
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