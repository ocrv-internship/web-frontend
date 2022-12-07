import React, { useContext, useEffect, useState } from 'react';
import { TextInfo } from '../../../domain/service/TextsService';
import { LoadedState} from '../../../domain/state/TextsBloc';
import { MediaRecorderContainer } from '../../../../recording/delivery/components/MediaRecorder/MediaRecorderContainer';
import "./TextScreen.css";
import { TextSection } from './TextSection/TextSection';


export interface LoadedTextScreenProps {
    state: LoadedState,
}

export function LoadedTextScreen({state} : LoadedTextScreenProps) {
    if (state.currentInd === -1) {
        return <p>You have recorded all of the texts.</p>;
    }
    const text = state.texts[state.currentInd];
    return  (
        <div>
            <h1>Задача №{text.id}</h1>
            <TextInfoComponent text={text} index={state.currentInd+1} fullCount={state.texts.length}  /> 
        </div>
    );
}

interface TextInfoComponentProps {
    text: TextInfo, 
    index: number, 
    fullCount: number,
}

function TextInfoComponent({text, index, fullCount}: TextInfoComponentProps) {
    return (
        <div id="textInfo">
            <TextSection text={text.text} index={index} fullCount={fullCount} />
            <div id="notesSection">
                <section id="notes">
                    <h2>Заметки</h2>
                    <p id="notesBody">{text.note}</p>
                </section>
                <MediaRecorderContainer textId={text.id}/>
            </div>
        </div>
    );
}
