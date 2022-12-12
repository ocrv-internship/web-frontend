export function formatDuration(durSec: number) {
    const min = Math.floor(durSec / 60).toString();
    const sec = (durSec % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
}
