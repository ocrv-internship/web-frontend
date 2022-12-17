import { useState } from "react";
import CloseButton from "../App/CloseButton/CloseButton";
import "./ErrorNotification.css";
export function ErrorNotification({message} : {message: string}) {
    const [isClosed, setIsClosed] = useState(false);
    if (isClosed) return <></>;
    return (
        <section className="error">
            <div className="errorHeader">
                <h3>Ошибка</h3>
                <CloseButton onClick={() => setIsClosed(true)} />
            </div>
            <p className="errorText">{message}</p>
        </section>
    );
}

export default ErrorNotification; 