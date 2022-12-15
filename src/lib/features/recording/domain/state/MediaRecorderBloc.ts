import { convertError } from "../../../../core/errors/errorHandling";
import { Failure, RecordingStartFailure } from "../../../../core/errors/failures";
import { Bloc } from "../../../../core/utils/bloc/Bloc";
import BlocComponentsFactory from "../../../../core/utils/bloc/BlocComponentsFactory";
import { DurationSec } from "../../../../core/utils/utils";
import { startRecording, SimpleRecorder } from "../service/SimpleRecorder";
import { ErrorState, Initial, MediaRecordingState, Recorded, Recording } from "./MediaRecorderState";


class MediaRecorderBloc extends Bloc<MediaRecordingState> {
    private recorder?: SimpleRecorder;
    private durationTimer?: NodeJS.Timer;
    constructor(minDuration?: DurationSec, maxDuration?: DurationSec) {
        super(new Initial({
            retries: 0,
            minDuration: minDuration, 
            maxDuration: maxDuration,
        }));
        this.onStartPressed = this.onStartPressed.bind(this);
        this.onStopPressed = this.onStopPressed.bind(this);
        this.onCancelPressed = this.onCancelPressed.bind(this);
        this.disposeAll = this.disposeAll.bind(this);
        this.incrementDuration = this.incrementDuration.bind(this);
        this.onVideoTogglePressed = this.onVideoTogglePressed.bind(this);
    }

    dispose() {
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