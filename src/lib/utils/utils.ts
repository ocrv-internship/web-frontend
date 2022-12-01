export function convertError(e: any) {
    return e instanceof Error ? e : new Error(`unknown: ${e}`);
}