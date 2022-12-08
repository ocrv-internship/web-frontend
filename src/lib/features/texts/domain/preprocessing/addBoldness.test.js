const preprocessing = require("./preprocessing.ts")

const table = [
    {
        "text": "", 
        "exp": "",
    }, 
    {
        "text": "*abc*?", 
        "exp": "<b>abc</b>?",
    },
    {
        "text": "hello kaksdjkfjskf *bold text* asdfjkjksf *another bold text*",
        "exp":  "hello kaksdjkfjskf <b>bold text</b> asdfjkjksf <b>another bold text</b> ?",
    }
]


table.forEach((t) => test(t.text, () => {
    expect(preprocessing.addBoldness(t.text)).toBe(t.exp);
}));
