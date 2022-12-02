import { withErrorHandling } from "../../../../core/utils/utils";

export interface SimpleRecorder {
    finish(): Promise<Blob>;
    dispose(): void;
};

const videoBlobMeta = { 'type': 'video/mp4' };

export async function startRecording(): Promise<SimpleRecorder>  {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
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
            recorder.onstop = () => {
                resolve(new Blob(chunks, videoBlobMeta));
            };
            dispose(); // calls recorder.stop()
        }),
    }
}
