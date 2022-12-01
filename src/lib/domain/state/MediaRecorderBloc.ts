import { isForInStatement } from "typescript";
import { Bloc } from "../../bloc/Bloc";
import BlocComponentsFactory from "../../bloc/BlocComponentsFactory";
import { convertError } from "../../utils/utils";


export class Initial {

};

export class Recording {
    constructor(readonly durationSec: number) {}
}; 

export class Recorded {
    constructor(readonly blob: Blob) {}
};

export type RecordingState = Initial | Recording | Recorded | Error;

class MediaRecorderBloc extends Bloc<RecordingState> {
    private recorder?: MediaRecorder; 
    private timer?: NodeJS.Timer;
    private chunks: Blob[] = [];
    constructor() {
        super(new Initial());
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
        this.emit(new Recording(0));
        this.timer = setInterval(this.incrementDuration, 1000);
    }
    private async incrementDuration() {
        if (this.state instanceof Recording) this.emit(new Recording(this.state.durationSec+1));
    }

    async onStopPressed() {
        this.recorder?.stop();
    }

    async onCancelPressed() {
        this.disposeAll();
        this.emit(new Initial());
    }

    private disposeAll() {
        clearInterval(this.timer);
        this.chunks = [];
        this.recorder?.stop();
    }

    private onRecorderStopped() {
        const blob = new Blob(this.chunks, { 'type' : 'video/mp4' });
        console.log(blob.size);
        console.log(window.URL.createObjectURL(blob));
        this.disposeAll();
        this.emit(new Recorded(blob));
    }


    private async initRecorder() {
        if (navigator.mediaDevices) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true}); 
                this.recorder = new MediaRecorder(stream);
                this.recorder.onstop = this.onRecorderStopped;
                this.recorder.ondataavailable = ({data}) => {
                    console.log(data);
                    this.chunks.push(data)
                };
            } catch (e) {
                this.emit(convertError(e)); 
            }
        } else {
            this.emit(Error("Video recording is not supported."));
        }
    }
}

export default MediaRecorderBloc;

export const {
    Provider: RecordingProvider, 
    Builder: RecordingBuilder,
    Context: RecordingContext,
} = BlocComponentsFactory<RecordingState, MediaRecorderBloc>();