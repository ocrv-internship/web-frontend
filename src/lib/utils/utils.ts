export function convertError(e: any) {
    return e instanceof Error ? e : new Error(`unknown: ${e}`);
}

export function withErrorHandling<T>(callback: () => Promise<T>): Promise<Error | T> {
    return callback().then((res) => res).catch((e) => e);
}