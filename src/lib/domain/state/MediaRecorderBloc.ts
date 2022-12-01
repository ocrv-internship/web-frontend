import { isForInStatement } from "typescript";
import { Bloc } from "../../bloc/Bloc";
import BlocComponentsFactory from "../../bloc/BlocComponentsFactory";
import { convertError } from "../../utils/utils";

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
    private mediaStream?: MediaStream;
    private recorder?: MediaRecorder;
    private timer?: NodeJS.Timer;
    private chunks: Blob[] = [];
    constructor() {
        super(new Initial(0));
        this.initRecorder = this.initRecorder.bind(this);
        this.onRecorderStopped = this.onRecorderStopped.bind(this);
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
        await this.initRecorder();
        this.recorder?.start();
        this.emit(new Recording(0, this.state.retries));
        this.timer = setInterval(this.incrementDuration, 1000);
    }
    private async incrementDuration() {
        if (this.state instanceof Recording) this.emit(new Recording(this.state.durationSec + 1, this.state.retries));
    }

    async onStopPressed() {
        this.recorder?.stop();
    }

    async onCancelPressed() {
        this.emit(new Initial(this.state.retries + 1));
        this.disposeAll();
    }

    private disposeAll() {
        clearInterval(this.timer);
        this.chunks = [];
        this.recorder?.stop();
        this.mediaStream?.getTracks().forEach((track) => track.stop());
    }

    private onRecorderStopped() {
        if (!(this.state instanceof Recording )) return;
        const blob = new Blob(this.chunks, { 'type': 'video/mp4' });
        console.log(blob.size);
        console.log(window.URL.createObjectURL(blob));
        this.disposeAll();
        this.emit(new Recorded(blob, this.state.retries));
    }


    private async initRecorder() {
        if (navigator.mediaDevices) {
            try {
                this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                this.recorder = new MediaRecorder(this.mediaStream);
                this.recorder.onstop = this.onRecorderStopped;
                this.recorder.ondataavailable = ({ data }) => {
                    console.log(data);
                    this.chunks.push(data)
                };
            } catch (e) {
                this.emit(new ErrorState(convertError(e), this.state.retries));
            }
        } else {
            this.emit(new ErrorState(Error("Video recording is not supported."), this.state.retries));
        }
    }
}

export default MediaRecorderBloc;

export const {
    Provider: RecordingProvider,
    Builder: RecordingBuilder,
    Context: RecordingContext,
} = BlocComponentsFactory<RecordingState, MediaRecorderBloc>();