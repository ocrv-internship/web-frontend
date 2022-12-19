import React, { useContext, useEffect, useState } from 'react';
import { TextInfo } from '../../../domain/service/TextsService';
import { LoadedState} from '../../../domain/state/TextsState';
import { MediaRecorderContainer } from '../../../../recording/delivery/components/MediaRecorder/MediaRecorderContainer';
import { TextSection } from './TextSection/TextSection';
import { ProgressTab } from './ProgressTab/ProgressTab';
import { ErrorNotification } from '../../../../../core/delivery/components/ErrorNotification/ErrorNotification';
import ProfileTab from '../../../../auth/ProfileTab/ProfileTab';


export interface LoadedTextScreenProps {
    state: LoadedState,
}

export function LoadedTextScreen({state} : LoadedTextScreenProps) {
    if (state.currentInd === -1) {
        return <TextsEndComponent />;
    }
    const text = state.texts[state.currentInd];
    const completed = state.texts.reduce<number>((prev, cur) => {
        return prev + (cur.completed ? 1 : 0)
    }, 0); 
    return  (
        <>
            <h1>Задача №{text.id}</h1>
            <TextInfoComponent text={text} /> 
            <ProgressTab 
                completedCount={completed} 
                textsCount={state.texts.length} 
                fullDurationSec={state.fullRecDurationSec}
            />
            <ProfileTab />
            {state.err != null ? 
                <ErrorNotification message={state.err.msg} />
            : <></>
            }
        </>
    );
}

interface TextInfoComponentProps {
    text: TextInfo, 
}

function TextInfoComponent({text}: TextInfoComponentProps) {
    return (
        <div id="textInfo">
            <TextSection text={text.text} />
            <div id="notesSection">
                <section id="notes">
                    <h2>Инструкция</h2>
                    <p id="notesBody">{text.note}</p>
                </section>
                <MediaRecorderContainer 
                    textId={text.id}
                    minDuration={text.minDuration}
                    maxDuration={text.maxDuration}
                />
            </div>
        </div>
    );
}

function TextsEndComponent({}) {
    return (
        <div id="textsEnd">
            <h2>Тексты закончились. Спасибо!</h2>
            <button className="simple" onClick={() => window.location.reload()}>Записать заново</button>
        </div>
    );
}
