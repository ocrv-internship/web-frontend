import { mockTexts } from "../../../domain/service/Texts";
import { RecordingScreen } from "./RecordingScreen";

export function RecordingScreenContainer({}) {
    return <RecordingScreen text={mockTexts[0]} />
}