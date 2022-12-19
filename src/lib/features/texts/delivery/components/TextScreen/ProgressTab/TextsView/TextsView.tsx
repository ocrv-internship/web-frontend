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
    const tmpTexts = bloc.state.texts.concat(bloc.state.texts).concat(bloc.state.texts);
    return (
        <div onClick={onClose} id="textsViewWrapper">
            <section id="textsView">
                {tmpTexts.map((text) => 
                    <TextCompletionInfo key={text.id} text={text} />
                )}
            </section>
        </div>
    );
}

function TextCompletionInfo({text} : {text: TextInfo}) {
    return (
        <section className="textCompletion">
            <p>{text.completed ? "true" : "false"}</p> 
        </section>
    );
}

export default TextsView;