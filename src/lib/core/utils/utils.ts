export function formatDuration(durSec: number) {
    const min = Math.floor(durSec / 60).toString();
    const sec = (durSec % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
}

export function convertError(e: any) {
    return e instanceof Error ? e : new Error(`unknown: ${e}`);
}

export function withErrorHandling<T>(callback: () => Promise<T>): Promise<Error | T> {
    return callback().then((res) => res).catch((e) => e);
}