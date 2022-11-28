import React, { useContext } from 'react';
import { TextInfo } from '../../../domain/service/Texts';
import { LoadedState, TextsContext, TextsState } from '../../../domain/state/TextsBloc';


export interface LoadedRecordingScreenProps {
    state: LoadedState,
}

export function LoadedRecordingScreen({state} : LoadedRecordingScreenProps) {
    const text = state.texts[state.currentInd];
    return (
        <div>
            <TextTitle text={text} />
            <TextInfoComponent text={text} /> 
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
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
    return <div>AudioWave</div>;
}

function TextInfoComponent({text}: TextProps) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <section className='textCard'>
                <h2>Текст для записи</h2>
                <p>{text.text}</p>
            </section>
            <section className='textCard'>
                <h2>Заметки</h2>
                <p>{text.notes}</p>
            </section>
        </div>
    );
}

function Actions() {
    const skip = useContext(TextsContext)!.skipPressed;
    return (
        <div style={{display: 'flex', alignContent: 'stretch', flexDirection: 'column'}}>
            <button>Запись</button>
            <button onClick={skip}>Пропустить</button>
        </div>
    );
}