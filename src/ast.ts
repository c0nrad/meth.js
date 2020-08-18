
import { Node, NodeType, LiteralNode, SymbolNode, OperatorNode } from "./parser"
import { TokenType } from "./lexer"

export function CloneAST(n: Node): Node {
    return JSON.parse(JSON.stringify(n)) as Node
}

export function astToMath(n: Node): string {
    switch (n.Type) {
        case NodeType.LITERAL: {
            return (n as LiteralNode).Value.toString()
        }
        case NodeType.SYMBOL: {
            return (n as SymbolNode).Name
        }
        case NodeType.OPERATOR: {
            let operatorNode = (n as OperatorNode)
            return astToMath(operatorNode.Children[0]) + " " + operatorToString(operatorNode.Operator) + " " + astToMath(operatorNode.Children[1])
        }
    }
}

export function operatorToString(i: TokenType): string {
    switch (i) {
        case TokenType.OP_ADD: {
            return "+"
        }
        case TokenType.OP_MINUS: {
            return "-"
        }
        case TokenType.OP_MULTIPLY: {
            return "*"
        }
        case TokenType.OP_DIVIDE: {
            return "/"
        }
        case TokenType.OP_EQUALS: {
            return "="
        }
    }
}