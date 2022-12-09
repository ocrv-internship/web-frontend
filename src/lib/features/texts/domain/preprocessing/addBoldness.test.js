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
        "text": "hello kaksdjkfjskf *bold text* asdfjkjksf *another bold text* ?",
        "exp":  "hello kaksdjkfjskf <b>bold text</b> asdfjkjksf <b>another bold text</b> ?",
    }, 
    {
        "text": "*b* *b* **b** ***nested***",
        "exp": "<b>b</b> <b>b</b> <b>*b*</b> <b>**nested**</b>",
    },
    {
        "text": "<b>asdf</b> *bold*", 
        "exp": "<b>asdf</b> <b>bold</b>", 
    }, 
    {
        "text": 
`*multi
line*`, 
        "exp": 
`<b>multi
line</b>`, 
    }
]


table.forEach((t) => test(t.text, () => {
    expect(preprocessing.addBoldness(t.text)).toBe(t.exp);
}));
