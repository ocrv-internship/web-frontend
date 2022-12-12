import "./ErrorScreen.css";
import { Failure } from "../../../errors/failures";

export function ErrorScreen({err} : {err: Failure}) {
    return (
        <section id="errorScreen">
            <h2 className="errorMsg">{err.msg}</h2>
            <button onClick={() => window.location.reload()} className="simple">
                Попробовать снова
            </button>
        </section>
    );
}