import { useEffect, useState } from "react";
import "./VideoPopupButton.css";

export function VideoPopupButton({video} : {video: Blob}) {
    const [videoURL, setVideoURL] = useState<string | null>(null);
    // console.log(videoURL);
    const openVideo = () => setVideoURL(window.URL.createObjectURL(video));
    const closeVideo = () => setVideoURL(null);
    // useEffect is used here only for cleaning up the video copy
    useEffect(() => {
        if (videoURL != null) return () => window.URL.revokeObjectURL(videoURL);
    }, [videoURL]);
    return (
        <div>
            <button className="button" onClick={openVideo}>Просмотреть</button>
            {videoURL != null ? <VideoPopup src={videoURL} onClose={closeVideo} /> : <div />}
        </div>
    );
}

function VideoPopup({onClose, src} : {onClose: () => void, src: string}) {
    return (
        <div onClick={onClose} id="popupBackground">
            <div className="card" onClick={(e) => e.stopPropagation()} id="popup">
                {/* <video controls src={src} width={600}/> */}
                <audio controls src={src} />
            </div>
        </div>
    );
}

export default VideoPopupButton;