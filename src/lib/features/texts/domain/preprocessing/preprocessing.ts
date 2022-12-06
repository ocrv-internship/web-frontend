function addAccents(text: string): string {
    return text.replace(/\+([аоуыэеёиюяaeiouy])/gmi, `$1\u0301`);
}

function addBoldness(text: string): string {
    throw Error("Unimplemented");
}

export function preprocess(text: string) {
    return addBoldness(addAccents(text));
}

export default preprocess;