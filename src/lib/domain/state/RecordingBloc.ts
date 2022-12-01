import { timeStamp } from "console";
import { Bloc } from "../../bloc/Bloc";
import BlocComponentsFactory from "../../bloc/BlocComponentsFactory";

export enum RecordingStateType {
    initial,
    recording, 
    recorded,
}

// TODO: maybe make RecordingBloc a field in the TextsBloc's state

export interface RecordingState {
    recordingURL?: string, 
    recordingBlob?: Blob,
    type: RecordingStateType,
    error?: Error,
}

class RecordingBloc extends Bloc<RecordingState> {
    private recorder?: MediaRecorder; 
    private chunks: Blob[] = [];
    constructor() {
        super({
            type: RecordingStateType.initial,
        })
        this.init = this.init.bind(this);
        this.onStartPressed = this.onStartPressed.bind(this);
        this.onStopPressed = this.onStopPressed.bind(this);
        this.onCancelPressed = this.onCancelPressed.bind(this);
        this.init();
    }

    dispose() {
        super.dispose();
        this.recorder?.stop();
        if (this.state.recordingURL != null) window.URL.revokeObjectURL(this.state.recordingURL);
    }

    // TODO: split this into helper functions 
    private async init() {
        if (navigator.mediaDevices) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({audio: true}); 
                this.recorder = new MediaRecorder(stream);
                this.recorder.onstart = ({}) => {
                    this.emit({type: RecordingStateType.recording});
                }
                this.recorder.ondataavailable = ({data}) => {
                    this.chunks.push(data);
                };
                this.recorder.onstop = ({}) => {
                    const blob = new Blob(this.chunks, { 'type' : 'audio/mp3' });
                    const audioURL = window.URL.createObjectURL(blob); 
                    this.chunks = [];
                    this.emit({recordingURL: audioURL, recordingBlob: blob, type: RecordingStateType.recorded});
                }
            } catch (e) {
                this.emit({...this.state, error: e as Error}); // TODO: fix error handling
            }
        } else {
            this.emit({...this.state, error: Error("Audio recording is not supported.")});
        }
    }

    async onStartPressed() {
        this.recorder?.start(); 
    }
    async onStopPressed() {
        this.recorder?.stop();
    }

    async onCancelPressed() {
        if (this.state.recordingURL != null) window.URL.revokeObjectURL(this.state.recordingURL);
        this.emit({type: RecordingStateType.initial});
    }
}

export default RecordingBloc;

export const {
    Provider: RecordingProvider, 
    Builder: RecordingBuilder,
    Context: RecordingContext,
} = BlocComponentsFactory<RecordingState, RecordingBloc>();