
import Reader from "./reader.js";

addCommand(
    'fetch', 
    function parse(reader) {
        if (reader.matchWord('fetch')) {
            url = parseElement(nakedStringLiteral, reader)
            return { url }
        }
    },
    function evaluate(context, { url }) {
        context.it = await fetch(url).then(res => res.text())
    },
)

function fetchCommand(reader) {
    if (!reader.matchWord('fetch')) return;
    const url = required(nakedStringLiteral(reader));
    return {
        name: 'fetchCommand', 
        args: { url }, 
        async op(ctx, { url }) {
            return await fetch(url)
        }
    }
}

function nakedStringLiteral(reader) {
    reader.while(isWhitespace);
    if (['\'', '"', '`'].includes(reader.peek())) {
        return parse(stringLiteral, reader);
    }
    let string = reader.until(isWhitespace);
    return {
        evaluate(context) {
            return string
        }
    }
}