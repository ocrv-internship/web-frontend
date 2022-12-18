import { useEffect, useState } from "react";
import CloseButton from "../../../../../core/delivery/components/App/CloseButton/CloseButton";
import { RecInfo } from "../../../../texts/domain/state/TextsState";
import "./RecordingPopupButton.css";


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
        <div>
            <button className="simple" onClick={openVideo}>{buttonText}</button>
            {recURL != null ? 
                <RecordingPopup src={recURL} onClose={closeVideo} isVideo={rec.isVideo}/> 
            :   <div />}
        </div>
    );
}

function RecordingPopup({onClose, src, isVideo} : {onClose: () => void, src: string, isVideo: boolean}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const onLoaded = () => setIsLoaded(true);
    // TODO: add a spinner
    return (
        <div onClick={onClose} className="popupBackground">
            <section onClick={(e) => e.stopPropagation()} className="popup">
                <div className="popupHeader">
                    <h2>Запись</h2>
                    <CloseButton onClick={onClose} />
                </div>
                {isVideo ?
                    <video style={{visibility: isLoaded ? 'visible': 'hidden'}} onLoadedDataCapture={onLoaded} preload='auto' controls src={src} width={600}/>
                :   <audio style={{visibility: isLoaded ? 'visible': 'hidden'}} onLoadedDataCapture={onLoaded} preload='auto' controls src={src} />
                }
            </section>
        </div>
    );
}

export default VideoPopupButton;