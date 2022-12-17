import { useState } from "react";
import "./TextSection.css";

const defaultFontSize = 18; 
const minFontSize = 12; 
const maxFontSize = 50; 
const fontSizeStep = 2; 

export function TextSection({text}: {text: string}) {
    const [fontSize, setFontSize] = useState(defaultFontSize);
    const decrement = fontSize > minFontSize ? 
        () => setFontSize(fontSize-fontSizeStep) : () => {};
    const increment = fontSize < maxFontSize ? 
        () => setFontSize(fontSize+fontSizeStep) : () => {};
    const textInnerHTML = {
        __html: text, 
    };
    return (
        <section id="text">
            <div id="textHeader">
                <h2>Текст для записи</h2>
                <div id="fontSection">
                    <h2>{`Шрифт: ${fontSize}`}</h2>
                    <FontButtons increment={increment} decrement={decrement} />
                </div>
            </div>
            <p 
                id="textBody" 
                style={{fontSize: fontSize}} 
                dangerouslySetInnerHTML={textInnerHTML} 
            />
        </section>
    );
}

function FontButtons({increment, decrement} : {
    increment: () => void, 
    decrement: () => void
}) {
    return (
        <div id="fontButtons">
            <button onClick={decrement} className="simple">
                <svg className="minusButton" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" strokeWidth="1.25" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
            <button onClick={increment} className="simple">
                <svg className="plusButton"xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" strokeWidth="1.25" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
        </div>
    );
}