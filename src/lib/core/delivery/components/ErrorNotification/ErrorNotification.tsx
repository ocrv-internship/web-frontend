import CloseButton from "../App/CloseButton/CloseButton";
import "./ErrorNotification.css";
export function ErrorNotification({message} : {message: string}) {
    return (
        <section className="error">
            <h3>Error</h3>
            <p className="errorText">{message}</p>
        </section>
    );
}

export default ErrorNotification; 