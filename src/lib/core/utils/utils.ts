import { convertError } from "../errors/errorHandling";
import { Failure } from "../errors/failures";

export function formatDuration(durSec: number) {
    const min = Math.floor(durSec / 60).toString();
    const sec = (durSec % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
}

export function withErrorHandling<T>(callback: () => Promise<T>): Promise<Failure | T> {
    return callback().then((res) => res).catch((e) => convertError(e));
}