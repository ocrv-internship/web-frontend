import { useContext } from "react";
import { TextsContext } from "../../../../../domain/state/TextsBloc";
import { Failure } from "../../../../../../../core/errors/failures";
import { TextInfo } from "../../../../../domain/service/TextsService";
import "./TextsView.css";

function TextsView({onClose} : {onClose: () => void}) {
    const bloc = useContext(TextsContext)!;
    if (bloc.state instanceof Failure || bloc.state === null) {
        return <></>;
    }
    return (
        <div onClick={onClose} id="textsViewWrapper">
            <section onClick={(e) => e.stopPropagation()} id="textsView">
                {bloc.state.texts.map((text, i) => 
                    <TextCompletionInfo 
                        onClick={() => {
                            bloc.navigateToIndex(i);
                            onClose();
                        }}
                        key={text.id} 
                        text={text} 
                    />
                )}
            </section>
        </div>
    );
}

const bodyTrimLength = 250; 
function TextCompletionInfo({text, onClick} : {text: TextInfo, onClick: () => void}) {
    const textBody = text.text.substring(0, bodyTrimLength) + (
        text.text.length > bodyTrimLength ? "..." : ""
    );
    const textInnerHTML = {
        __html: textBody, 
    };
    return (
        <section onClick={onClick} className="textCompletion">
            <h3>
                <span>Задача №{text.id}</span> 
                {text.completed ?
                    <span className="recorded">Записана</span>
                    : <span className="not-recorded">Не записана</span>
                }
            </h3>
            <p dangerouslySetInnerHTML={textInnerHTML}></p>
        </section>
    );
}

export default TextsView;