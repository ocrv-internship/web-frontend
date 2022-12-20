import { useEffect, useState } from "react";
import CloseButton from "../../../../../core/delivery/components/App/CloseButton/CloseButton";
import { RecInfo } from "../../../../texts/domain/state/TextsState";
import "./RecordingPopupButton.css";
import { Recording } from "../../../domain/state/MediaRecorderState";


export function VideoPopupButton({rec} : {rec: RecInfo}) {
    const [recURL, setRecURL] = useState<string | null>(null);
    const openVideo = () => setRecURL(window.URL.createObjectURL(rec.blob));
    const closeVideo = () => setRecURL(null);
    // useEffect is used here only for cleaning up the video copy
    useEffect(() => {
        if (recURL != null) return () => window.URL.revokeObjectURL(recURL);
    }, [recURL]);

    const buttonText = rec.isVideo ? "Просмотреть" : "Прослушать";
    return (
        <>
            <button className="simple" onClick={openVideo}>{buttonText}</button>
            {recURL != null ? 
                <RecordingPopup src={recURL} onClose={closeVideo} isVideo={rec.isVideo}/> 
            :   <></>}
        </>
    );
}

export interface RecordingPopupProps {
    onClose: () => void, 
    src: string, 
    isVideo: boolean, 
    resetCache?: boolean,
};

export function RecordingPopup({onClose, src, isVideo, resetCache} : RecordingPopupProps) {
    const nonCachingSrc = src + (resetCache ? `?${new Date().toISOString()}` : "");
    return (
        <div onClick={onClose} className="popupBackground">
            <section onClick={(e) => e.stopPropagation()} className="popup">
                <div className="popupHeader">
                    <h2>Запись</h2>
                    <CloseButton onClick={onClose} />
                </div>
                {isVideo ?
                    <video preload='auto' controls src={nonCachingSrc} width={600}/>
                :   <audio preload='auto' controls src={nonCachingSrc} />
                }
            </section>
        </div>
    );
}

export default VideoPopupButton;