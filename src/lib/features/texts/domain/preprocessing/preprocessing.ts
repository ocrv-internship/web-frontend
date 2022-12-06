function addAccents(text: string): string {
    return text.replace(/\+([аоуыэеёиюяaeiouy])/gmi, `$1\u0301`);
}

function addBoldness(text: string): string {
    // TODO: implement adding boldness 
    return text; 
}

export function preprocess(text: string) {
    return addBoldness(addAccents(text));
}

export default preprocess;