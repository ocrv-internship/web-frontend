import React, { useContext, useEffect, useState } from 'react';
import { TextInfo } from '../../../domain/service/TextsService';
import { LoadedState} from '../../../domain/state/TextsBloc';
import { MediaRecorderContainer } from '../../../../recording/delivery/components/MediaRecorder/MediaRecorderContainer';
import "./TextScreen.css";
import { TextSection } from './TextSection/TextSection';
import { ProgressTab } from './ProgressTab/ProgressTab';


export interface LoadedTextScreenProps {
    state: LoadedState,
}

export function LoadedTextScreen({state} : LoadedTextScreenProps) {
    if (state.currentInd === -1) {
        return <TextsEndComponent />;
    }
    const text = state.texts[state.currentInd];
    const completed = state.currentInd; 
    return  (
        <>
            <h1>Задача №{text.id}</h1>
            <TextInfoComponent text={text} /> 
            <ProgressTab 
                completedCount={completed} 
                textsCount={state.texts.length} 
                fullDurationSec={state.fullRecDurationSec}
            />
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
                <MediaRecorderContainer textId={text.id}/>
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
