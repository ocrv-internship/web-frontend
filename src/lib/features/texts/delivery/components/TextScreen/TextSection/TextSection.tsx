import { useState } from "react";
import "./TextSection.css";

const defaultFontSize = 18; 

export function TextSection({text, index, fullCount}: {text: string, index: number, fullCount: number}) {
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