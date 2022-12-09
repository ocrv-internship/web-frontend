import { useState } from "react";
import "./TextSection.css";

const defaultFontSize = 18; 

export function TextSection({text}: {text: string}) {
    const [fontSize, setFontSize] = useState(defaultFontSize);
    const decrement = fontSize > 12 ? () => setFontSize(fontSize-1) : () => {};
    const increment = () => setFontSize(fontSize+1);
    const textInnerHTML = {
        __html: text, 
    };
    return (
        <section id="text">
            <div id="textHeader">
                <h2>Текст для записи</h2>
                <div id="fontSection">
                    <h2>{`Шрифт: ${fontSize}`}</h2>
                    <div id="fontButtons">
                        <button onClick={decrement} className="simple">-</button>
                        <button onClick={increment} className="simple">+</button>
                    </div>
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