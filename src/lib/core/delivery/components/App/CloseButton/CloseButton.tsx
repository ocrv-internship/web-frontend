import "./CloseButton.css";
export function CloseButton({onClick} : {onClick: () => void}) {
    return (
        <button onClick={onClick} className="closeButton simple">
            &#x2715;
        </button>
    )
}

export default CloseButton;