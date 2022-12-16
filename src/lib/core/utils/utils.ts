export type DurationSec = number;


export function formatDuration(dur: DurationSec) {
    const min = Math.floor(dur / 60).toString();
    const sec = (dur % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
}

export const jsonHeaders = {
    "Content-Type": 'application/json', 
    "Accept": 'application/json',
}
