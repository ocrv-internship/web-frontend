import { formatDuration } from "../../../../../../core/utils/utils";
import "./ProgressTab.css";

export interface ProgressTabProps {
    completedCount: number, 
    textsCount: number, 
    fullDurationSec: number,
}
export function ProgressTab(props : ProgressTabProps) {
    const duration = <h3>Общая длительность: {formatDuration(props.fullDurationSec)}</h3>;
    return (
        <section id="progress">
            <h3>Записано: {props.completedCount} из {props.textsCount}</h3>
            {props.fullDurationSec ? duration : <></>}
        </section>
    );
}