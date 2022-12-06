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
            <TextInfoComponent text={text} index={state.currentInd+1} fullCount={state.texts.length}  /> 
        </div>
    );
}

export interface TextProps {
    text: TextInfo,
}


function TextTitle({text}: TextProps) {
    return <h1>Задача №{text.id}</h1>;
}

interface TextInfoComponentProps {
    text: TextInfo, 
    index: number, 
    fullCount: number,
}

function TextInfoComponent({text, index, fullCount}: TextInfoComponentProps) {
    return (
        <div id="textInfo">
            <TextComponent text={text.text} index={index} fullCount={fullCount} />
            <div id="notesSection">
                <section id="notes" className='card'>
                    <h2>Заметки</h2>
                    <p id="notesBody">{text.note}</p>
                </section>
                <MediaRecorderContainer textId={text.id}/>
            </div>
        </div>
    );
}

const defaultFontSize = 18; 

function TextComponent({text, index, fullCount}: {text: string, index: number, fullCount: number}) {
    const [fontSize, setFontSize] = useState(defaultFontSize);
    const decrement = fontSize > 12 ? () => setFontSize(fontSize-1) : () => {};
    const increment = () => setFontSize(fontSize+1);
    return (
        <section id="text" className='card'>
            <div id="textHeader">
                <h2>Текст для записи {index}/{fullCount}</h2>
                <div>
                    <h2>{`Шрифт: ${fontSize}`}</h2>
                    <button onClick={decrement} className="button">-</button>
                    <button onClick={increment} className="button">+</button>
                </div>
            </div>
            <p id="textBody" style={{fontSize: fontSize}}>{text}</p>
        </section>
    );
}
