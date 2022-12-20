import React, { useContext, useEffect, useState } from 'react';
import { TextInfo } from '../../../domain/service/TextsService';
import { LoadedState} from '../../../domain/state/TextsState';
import { MediaRecorderContainer } from '../../../../recording/delivery/components/MediaRecorder/MediaRecorderContainer';
import { TextSection } from './TextSection/TextSection';
import { ProgressTab } from './ProgressTab/ProgressTab';
import { ErrorNotification } from '../../../../../core/delivery/components/ErrorNotification/ErrorNotification';
import ProfileTab from '../../../../auth/ProfileTab/ProfileTab';
import { TEXTS_END, TextsContext } from '../../../domain/state/TextsBloc';


export function LoadedTextScreen({state} : {state: LoadedState}) {
    const bloc = useContext(TextsContext)!;
    const completed = state.texts.reduce((prev, cur) => {
        return prev + (cur.completed ? 1 : 0)
    }, 0); 
    if (state.currentInd === TEXTS_END) {
        return (
            <TextsEndComponent 
                isFullyCompleted={completed===state.texts.length} 
                restart={bloc.restartPressed}
            />
        );
    }
    const text = state.texts[state.currentInd];

    return  (
        <>
            <h1>Задача №{text.id}</h1>
            {text.completed ? 
                <button id="recordedButton" className='simple'>
                    Записан
                </button>
            :   <></>}
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

function TextsEndComponent({isFullyCompleted, restart} : {isFullyCompleted: boolean, restart: () => void}) {
    const headerText = isFullyCompleted 
        ? "Тексты закончились. Спасибо!" 
        : "Спасибо за записи! Но некоторые из задач остались пропущенными.";
    const buttonText = isFullyCompleted 
        ? "Записать заново"
        : "Продолжить";

    const onClick = isFullyCompleted 
        ? restart
        : () => window.location.reload(); // a simple solution for now
        
    return (
        <div id="textsEnd">
            <h2>{headerText}</h2>
            <button className="simple" onClick={onClick}>
                {buttonText}
            </button>
        </div>
    );
}
