import React from 'react';
import PropTypes from 'prop-types'; 
import { TextInfo } from '../../../domain/service/Texts';

export interface TextProps {
    text: TextInfo,
}
export function RecordingScreen({text} : TextProps) {
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

function TextTitle({text}: TextProps) {
    return <h1>Задача №{text.id}</h1>;
}
TextTitle.propTypes = {
    id: PropTypes.string, 
};

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
    return (
        <div style={{display: 'flex', alignContent: 'stretch', flexDirection: 'column'}}>
            <button>Запись</button>
            <button>Пропустить</button>
        </div>
    );
}