const preprocessing = require("./preprocessing.ts")

const accentTable = [
    {
        "text": "", 
        "exp": "",
    }, 
    {
        "text": "hell+o", 
        "exp": `hello\u0301`,
    },
    {
        "text": "alaslkdjfkajsdkjfkalsjdlkf"*100 + "333" + `a+abbb+e`,
        "exp": "alaslkdjfkajsdkjfkalsjdlkf"*100 + "333" + `aa\u0301bbbe\u0301`,
    },
    {
        "text": "+a+e+y+o+i+u", 
        "exp":  `a\u0301e\u0301y\u0301o\u0301i\u0301u\u0301`,
    },
    {
        "text": "+у+е+ы+а+о+э+ё+я+и+ю", 
        "exp": `у\u0301е\u0301ы\u0301а\u0301о\u0301э\u0301ё\u0301я\u0301и\u0301ю\u0301`,
    },
    {
        "text": "+a".repeat(100), 
        "exp": `a\u0301`.repeat(100), 
    }
]


accentTable.forEach((t) => test(t.text, () => {
    expect(preprocessing.addAccents(t.text)).toBe(t.exp);
}));
