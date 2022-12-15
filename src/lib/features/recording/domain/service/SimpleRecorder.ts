import { RecordingNotAllowed, RecordingNotSupported } from "../../../../core/errors/failures";

export interface SimpleRecorder {
    finish(): Promise<Blob>;
    dispose(): void;
};

const minSampleRate = 22050; // Hz 

const videoBlobMeta = { 'type': 'video/mp4' };
const audioBlobMeta = { 'type': 'audio/mp3' };

export async function startRecording(enableVideo: boolean): Promise<SimpleRecorder>  {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
            sampleRate: minSampleRate,
        }, 
        video: enableVideo
    })
        .then((res) => res)
        .catch((e) => {
            if (e instanceof OverconstrainedError) 
                throw new RecordingNotSupported(); 
            if (e.name === "NotAllowedError")
                throw new RecordingNotAllowed();
            throw e; 
        }); 
    const recorder = new MediaRecorder(mediaStream);
    const chunks: Blob[] = []; 
    recorder.ondataavailable = ({ data }) => chunks.push(data); 
    recorder.start();

    const dispose = () => {
        recorder.stop(); 
        mediaStream?.getTracks().forEach((track) => track.stop());
    };

    return {
        dispose: dispose, 
        finish: () => new Promise(resolve => {
            recorder.requestData()
            recorder.onstop = () => {
                resolve(new Blob(
                    chunks, 
                    enableVideo ? videoBlobMeta : audioBlobMeta
                ));
            };
            // calls recorder.stop(), so that the Promise is resolved
            dispose(); 
        }),
    }
}
