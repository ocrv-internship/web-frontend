import { useEffect, useRef, useState } from "react";
import CloseButton from "../../../../../core/delivery/components/App/CloseButton/CloseButton";
import { RecInfo } from "../../../../texts/domain/state/TextsState";
import "./RecordingPopupButton.css";
import { Recording } from "../../../domain/state/MediaRecorderState";


export function RecordingPopupButton({rec} : {rec: RecInfo}) {
    const [recURL, setRecURL] = useState<string | null>(null);
    const openMedia = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.currentTarget.blur();
        setRecURL(window.URL.createObjectURL(rec.blob))
    };
    const closeMedia = () => setRecURL(null);
    // useEffect is used here only for cleaning up the video copy
    useEffect(() => {
        if (recURL != null) return () => window.URL.revokeObjectURL(recURL);
    }, [recURL]);

    const buttonText = rec.isVideo ? "Просмотреть" : "Прослушать";
    return (
        <>
            <button className="simple" onClick={openMedia}>{buttonText}</button>
            {recURL != null ? 
                <RecordingPopup src={recURL} onClose={closeMedia} isVideo={rec.isVideo}/> 
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
    // this hack is needed so that browsers do not cache the audio and video files
    const fixedSrc = src + (resetCache ? `?${new Date().toISOString()}` : "");

    // this hack is needed in some browsers to correctly display duration from the start
    const onLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
        const media = e.currentTarget; 
        media.currentTime = Number.MAX_SAFE_INTEGER;
        media.ontimeupdate = () => {
          media.ontimeupdate = function(){};
          media.currentTime = 0.1;
          media.currentTime = 0;
        }
    }
    const props = {
        onLoadedMetadata: onLoadedMetadata, 
        preload: 'auto', 
        controls: true, 
        src: fixedSrc,
    };
    
    return (
        <div onClick={onClose} className="popupBackground">
            <section onClick={(e) => e.stopPropagation()} className="popup">
                <div className="popupHeader">
                    <h2>Запись</h2>
                    <CloseButton onClick={onClose} />
                </div>
                {isVideo ? <video {...props} /> : <audio {...props} />} 
            </section>
        </div>
    );
}

export default RecordingPopupButton;