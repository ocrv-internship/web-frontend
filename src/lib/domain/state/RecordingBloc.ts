import { Bloc } from "../../bloc/Bloc";

enum RecordingStateType {
    stopped, 
    recording, 
    recorded,
}

interface RecordingState {
    recordingURL?: string, 
    type: RecordingStateType,
    error?: Error,
}

class RecordingBloc extends Bloc<RecordingState> {
    private recorder?: MediaRecorder; 
    private chunks: Blob[] = [];
    constructor() {
        super({
            type: RecordingStateType.stopped,
        })
        this.init();
    }

    private async init() {
        if (navigator.mediaDevices) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({audio: true}); 
                this.recorder = new MediaRecorder(stream);
                this.recorder.ondataavailable = ({data}) => {
                    this.chunks.push(data);
                };
                this.recorder.onstop = ({}) => {
                    const blob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
                    const audioURL = window.URL.createObjectURL(blob);
                    this.chunks = [];
                    this.emit({recordingURL: audioURL, type: RecordingStateType.recorded});
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
}