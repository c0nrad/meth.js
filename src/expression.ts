import { Node, NodeType, SymbolNode, LiteralNode, OperatorNode, parseStr } from './parser'
import { TokenType } from './lexer'
import { CloneAST, astToMath } from './ast'

export class Expression {
    ast: Node

    constructor(a: string) {
        this.ast = parseStr(a)
    }

    eval(scope: object): number {
        let out = evaluate(CloneAST(this.ast), scope)
        if (out.Type == NodeType.LITERAL) {
            return (out as LiteralNode).Value
        } else {
            throw new Error("unable to fully eval" + out)
        }
    }

    simplify(scope: object): Node {
        return evaluate(CloneAST(this.ast), scope)
    }
}

function evaluate(node: Node, scope: object): Node {
    if (node.Type == NodeType.SYMBOL) {
        let name = (node as SymbolNode).Name

        if (name in scope) {
            return new LiteralNode(scope[name])
        } else {
            return node
        }
    }

    if (node.Type == NodeType.LITERAL) {
        return (node as LiteralNode)
    }

    if (node.Type == NodeType.OPERATOR) {
        let n = node as OperatorNode
        let lhs = evaluate(n.Children[0], scope)
        let rhs = evaluate(n.Children[1], scope)

        if (lhs.Type == NodeType.LITERAL && rhs.Type == NodeType.LITERAL) {
            if (n.Operator == TokenType.OP_ADD) {
                return new LiteralNode((lhs as LiteralNode).Value + (rhs as LiteralNode).Value)
            } else if (n.Operator == TokenType.OP_MINUS) {
                return new LiteralNode((lhs as LiteralNode).Value - (rhs as LiteralNode).Value)
            } else if (n.Operator == TokenType.OP_MULTIPLY) {
                return new LiteralNode((lhs as LiteralNode).Value * (rhs as LiteralNode).Value)
            } else if (n.Operator == TokenType.OP_DIVIDE) {
                return new LiteralNode((lhs as LiteralNode).Value / (rhs as LiteralNode).Value)
            }
        }

        n.Children = [lhs, rhs]
        return n
    }
}
