import { NotFoundError } from "rxjs";
import { RecordingNotAllowed, RecordingNotSupported } from "../../../../core/errors/failures";

const minSampleRate = 22050; // Hz 

const videoBlobMeta = { type: 'video/mp4' };
const audioBlobMeta = { type: 'audio/mp3' };

function simpleRecorderFactory(enableVideo: boolean) {
    const options = {
        audio: {sampleRate: minSampleRate}, 
        video: enableVideo
    };
    return navigator.mediaDevices.getUserMedia(options)
    .catch((e) => {
        if (e instanceof OverconstrainedError || e.name === "NotFoundError") 
            throw new RecordingNotSupported(); 
        if (e.name === "NotAllowedError")
            throw new RecordingNotAllowed();
        throw e; 
    })
    .then((stream) => new SimpleRecorder(stream))
}

export class SimpleRecorder {
    chunks: Blob[] = [];
    rec: MediaRecorder;
    constructor(private readonly stream: MediaStream) {
        try {
            this.rec = new MediaRecorder(this.stream);
        } catch (e) {
            throw e;
        }
    };

    start = () => new Promise<void>((resolve) => {
        if (this.rec === undefined) return;
        this.rec.ondataavailable = ({data}) => {
            this.chunks.push(data); 
        };
        this.rec.onstart = () => resolve(); 
        this.rec.start();
    });
    stop = () => new Promise<Blob>((resolve) => {
        this.rec.requestData()
        this.rec.onstop = () => {
            resolve(new Blob(this.chunks));
        };
        this.dispose(); // calls .stop()
    })
    dispose = () => {
        this.rec.stop(); 
        this.stream.getTracks().forEach((track) => track.stop());
    }
}

export default simpleRecorderFactory; 