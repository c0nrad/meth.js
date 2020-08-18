import { Token, TokenType, parseTokens } from './lexer'
import { astToMath } from './ast';

export enum NodeType {
    TOKEN = "TOKEN",
    LITERAL = "LITERAL",
    SYMBOL = "SYMBOL",
    OPERATOR = "OPERATOR",
    FUNCTION = "FUNCTION",
    PAREN = "PAREN"
}

export abstract class Node {
    Type: NodeType
    Children: Node[]

    constructor() {
        this.Children = []
    }

    count(): number {
        let sum = 1;
        for (let c of this.Children) {
            sum += c.count()
        }
        return sum
    }

    abstract equals(b: Node): boolean;
}

export class OperatorNode extends Node {
    Type: NodeType
    Operator: TokenType
    Children: Node[]

    constructor(o: TokenType, c: Node[]) {
        super()
        this.Type = NodeType.OPERATOR
        this.Operator = o
        this.Children = c
    }

    equals(b: Node): boolean {
        if (!(b.Type === NodeType.OPERATOR && (b as OperatorNode).Operator == this.Operator)) {
            return false
        }

        if (b.Children.length != 2) {
            return false
        }

        if ((b.Children[0].equals(this.Children[0]) && b.Children[1].equals(this.Children[1])) ||
            (b.Children[1].equals(this.Children[0]) && b.Children[0].equals(this.Children[1]))) {
            return true
        }
        return false
    }
}

export class LiteralNode extends Node {
    Type: NodeType
    Children: Node[]
    Value: number

    constructor(v: string | number) {
        super()
        this.Type = NodeType.LITERAL
        this.Value = parseInt(v.toString())
    }

    equals(b: Node): boolean {
        return b.Type == NodeType.LITERAL && (b as LiteralNode).Value == this.Value
    }
}

export class SymbolNode extends Node {
    Type: NodeType
    Children: Node[]
    Name: string

    constructor(n: string) {
        super()
        this.Type = NodeType.SYMBOL
        this.Name = n
    }

    equals(b: Node): boolean {
        return b.Type == NodeType.SYMBOL && (b as SymbolNode).Name == this.Name
    }
}

export class TokenNode extends Node {
    Type: NodeType
    Children: Node[]
    Token: Token

    constructor(t: Token) {
        super()
        this.Type = NodeType.TOKEN
        this.Token = t
    }

    equals(b: Node): boolean {
        return b.Type == NodeType.TOKEN && (b as TokenNode).Token.Type == this.Token.Type &&
            (b as TokenNode).Token.Value == this.Token.Value
    }
}

function tokensToNodes(tokens: Token[]): TokenNode[] {
    let out = []
    for (let t of tokens) {
        if (t.Type == TokenType.LITERAL) {
            out.push(new LiteralNode(t.Value))
        } else if (t.Type == TokenType.SYMBOL) {
            out.push(new SymbolNode(t.Value))
        } else {
            out.push(new TokenNode(t))
        }
    }
    return out
}

function pinchOperation(tokens: Node[], operation: TokenType): Node[] {
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].Type != NodeType.TOKEN) {
            continue
        }

        let t = tokens[i] as TokenNode
        if (t.Token.Type == operation) {
            let lhs = tokens[i - 1]
            let rhs = tokens[i + 1]

            tokens[i] = new OperatorNode(t.Token.Type, [lhs, rhs])
            tokens.splice(i + 1, 1)
            tokens.splice(i - 1, 1)
            i = 0
        }
    }

    return tokens
}

function parseAST(tokens: Node[]): Node {
    tokens = pinchOperation(tokens, TokenType.OP_MULTIPLY)
    tokens = pinchOperation(tokens, TokenType.OP_DIVIDE)
    tokens = pinchOperation(tokens, TokenType.OP_ADD)
    tokens = pinchOperation(tokens, TokenType.OP_MINUS)
    tokens = pinchOperation(tokens, TokenType.OP_EQUALS)

    if (tokens.length != 1) {
        throw new Error("There should be one tokens left: " + JSON.stringify(tokens))
    }

    return tokens[0]
}

export function parseStr(expression: string): Node {
    return parse(parseTokens(expression))
}

export function parse(tokens: Token[]): Node {
    return parseAST(tokensToNodes(tokens))
}
