import React, { useContext } from 'react';
import { TextInfo } from '../../../domain/service/Texts';
import { LoadedState, TextsContext, TextsState } from '../../../domain/state/TextsBloc';
import "./TextScreen.css";


export interface LoadedTextScreenProps {
    state: LoadedState,
}

export function LoadedTextScreen({state} : LoadedTextScreenProps) {
    if (state.currentInd === -1) {
        return <p>You have recorded all of the texts.</p>;
    }
    const text = state.texts[state.currentInd];
    return (
        <div>
            <TextTitle text={text} />
            <TextInfoComponent text={text} /> 
            <div id="recording">
                <AudioWave /> 
                <Actions />
            </div>
        </div>
    );
}

export interface TextProps {
    text: TextInfo,
}


function TextTitle({text}: TextProps) {
    return <h1>Задача №{text.id}</h1>;
}

function AudioWave() {
    return (
        <div id="audiowave" className="card">

        </div>
    );
}

function TextInfoComponent({text}: TextProps) {
    return (
        <div id="textInfo">
            <section id="text" className='card'>
                <h2>Текст для записи</h2>
                <p>{text.text}</p>
            </section>
            <section id="notes" className='card'>
                <h2>Заметки</h2>
                <p>{text.notes}</p>
            </section>
        </div>
    );
}

function Actions() {
    const skip = useContext(TextsContext)!.skipPressed;
    return (
        <div id="actions">
            <button className="button empathetic-button">Запись</button>
            <button className="button" onClick={skip}>Пропустить</button>
        </div>
    );
}