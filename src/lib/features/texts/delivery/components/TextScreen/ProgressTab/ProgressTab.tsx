import { useState } from "react";
import { formatDuration } from "../../../../../../core/utils/utils";
import "./ProgressTab.css";
import TextsView from "./TextsView/TextsView";

export interface ProgressTabProps {
    completedCount: number, 
    textsCount: number, 
    fullDurationSec: number,
}
export function ProgressTab(props : ProgressTabProps) {
    const duration = <h3>Общая длительность: {formatDuration(props.fullDurationSec)}</h3>;
    const [viewVisible, setViewVisible] = useState(false);
    return (
        <>
            <section id="progress">
                <button onClick={() => setViewVisible(true)} id="progressButton" className="simple">
                    <span>Прогресс</span>
                </button>
                <h3>Записано: {props.completedCount} из {props.textsCount}</h3>
                {props.fullDurationSec ? duration : <></>}
            </section>

            {viewVisible ? 
                <TextsView onClose={() => setViewVisible(false)}/> 
            : <></>
            }
        </>
    );
}