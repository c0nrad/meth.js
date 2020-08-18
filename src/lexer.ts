
export class Token {
    Type: TokenType
    Value: string

    constructor(t: TokenType, v: string) {
        this.Type = t
        this.Value = v
    }
}

export enum TokenType {
    LITERAL = "LITERAL",
    SYMBOL = "SYMBOL",
    OP_ADD = "OP_ADD",
    OP_MINUS = "OP_MINUS",
    OP_MULTIPLY = "OP_MULTIPLY",
    OP_DIVIDE = "OP_DIVIDE",
    OP_EQUALS = "OP_EQUALS",

    NODE = "NODE",
}

export function parseTokens(expression: string): Token[] {

    let out = []
    let i = 0;
    while (i < expression.length) {
        let curr = expression[i]
        i++

        if (curr == " ") {
            continue
        } else if (curr === "+") {
            out.push(new Token(TokenType.OP_ADD, curr))
            continue
        } else if (curr === "*") {
            out.push(new Token(TokenType.OP_MULTIPLY, curr))
            continue
        } else if (curr == "-") {
            out.push(new Token(TokenType.OP_MINUS, curr))
            continue
        } else if (curr == "/") {
            out.push(new Token(TokenType.OP_DIVIDE, curr))
            continue
        } else if (curr == "=") {
            out.push(new Token(TokenType.OP_EQUALS, curr))
            continue
        } else if (isSymbol(curr)) {
            let name = curr
            while (isSymbol(expression[i]) && i < expression.length) {
                name += expression[i]
                i++
            }

            out.push(new Token(TokenType.SYMBOL, name))
            continue
        } else if (isNumeric(curr)) {
            let value = curr
            while (isNumeric(expression[i]) && i < expression.length) {
                value += expression[i]
                i++
            }

            out.push(new Token(TokenType.LITERAL, value))
            continue
        }
    }

    return insertImpliedMultiplication(out)
}

function insertImpliedMultiplication(tokens: Token[]): Token[] {

    let i = 0;
    while (i < tokens.length - 1) {
        let curr = tokens[i]
        let next = tokens[i + 1]

        if (curr.Type == TokenType.LITERAL && next.Type == TokenType.SYMBOL) {
            tokens.splice(i + 1, 0, new Token(TokenType.OP_MULTIPLY, "*"))
            continue
        }

        if (curr.Type == TokenType.SYMBOL && next.Type == TokenType.SYMBOL) {
            tokens.splice(i + 1, 0, new Token(TokenType.OP_MULTIPLY, "*"))
            continue
        }
        i++
    }
    return tokens
}

export function isSymbol(a: string): boolean {
    return /^[a-z_]$/i.test(a)
}

export function isNumeric(a: string): boolean {
    return /^[0-9.-]$/.test(a)
}