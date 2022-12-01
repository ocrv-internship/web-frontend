import { Bloc } from "../../bloc/Bloc";
import BlocComponentsFactory from "../../bloc/BlocComponentsFactory";
import { convertError } from "../../utils/utils";


export class Initial {

};

export class Recording {
    constructor(readonly durationSec: number) {}
}; 

export class Recorded {
    constructor(readonly url: string, readonly blob: Blob) {}
};

export type RecordingState = Initial | Recording | Recorded | Error;

class MediaRecorderBloc extends Bloc<RecordingState> {
    private recorder?: MediaRecorder; 
    private chunks: Blob[] = [];
    constructor() {
        super(new Initial());
        this.init = this.init.bind(this);
        this.onStartPressed = this.onStartPressed.bind(this);
        this.onStopPressed = this.onStopPressed.bind(this);
        this.onCancelPressed = this.onCancelPressed.bind(this);
    }

    dispose() {
        super.dispose();
        this.recorder?.stop();
        if (this.state instanceof Recorded) window.URL.revokeObjectURL(this.state.url);
    }

    // TODO: split this into helper functions 
    private async init() {
        if (navigator.mediaDevices) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({audio: true}); 
                this.recorder = new MediaRecorder(stream);
                this.recorder.onstart = ({}) => {
                    this.emit(new Recording(0));
                }
                this.recorder.ondataavailable = ({data}) => {
                    this.chunks.push(data);
                };
                this.recorder.onstop = ({}) => {
                    console.log("on stop");
                    const blob = new Blob(this.chunks, { 'type' : 'audio/mp3' });
                    const audioURL = window.URL.createObjectURL(blob); 
                    this.chunks = [];
                    this.emit(new Recorded(audioURL, blob));
                }
            } catch (e) {
                this.emit(convertError(e)); 
            }
        } else {
            this.emit(Error("Audio recording is not supported."));
        }
    }

    async onStartPressed() {
        console.log("log");
        await this.init();
        this.recorder?.start(); 
    }
    async onStopPressed() {
        this.recorder?.stop();
    }

    async onCancelPressed() {
        if (this.state instanceof Recorded) window.URL.revokeObjectURL(this.state.url);
        this.emit(new Initial());
    }
}

export default MediaRecorderBloc;

export const {
    Provider: RecordingProvider, 
    Builder: RecordingBuilder,
    Context: RecordingContext,
} = BlocComponentsFactory<RecordingState, MediaRecorderBloc>();