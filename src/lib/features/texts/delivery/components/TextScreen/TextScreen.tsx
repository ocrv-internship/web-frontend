import React, { useContext, useEffect, useState } from 'react';
import { TextInfo } from '../../../domain/service/TextsService';
import { LoadedState, Loading, TextsContext } from '../../../domain/state/TextsBloc';
import { MediaRecorderContainer } from '../../../../recording/delivery/components/MediaRecorder/MediaRecorderContainer';
import "./TextScreen.css";
import { RecordingCallbacks } from '../../../../recording/delivery/components/MediaRecorder/MediaRecorder';
import Spinner from '../../../../../core/delivery/components/Spinner/Spinner';


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
            <TextTitle text={text} />
            <TextInfoComponent text={text} /> 
        </div>
    );
}

export interface TextProps {
    text: TextInfo,
}


function TextTitle({text}: TextProps) {
    return <h1>Задача №{text.id}</h1>;
}

function TextInfoComponent({text}: {text: TextInfo}) {
    return (
        <div id="textInfo">
            <section id="text" className='card'>
                <h2>Текст для записи</h2>
                <p>{text.text}</p>
            </section>
            <div id="notesSection">
                <section id="notes" className='card'>
                    <h2>Заметки</h2>
                    <p>{text.note}</p>
                </section>
                <MediaRecorderContainer textId={text.id}/>
            </div>
        </div>
    );
}
