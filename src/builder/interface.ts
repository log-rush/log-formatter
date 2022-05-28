import { SGRAstNode } from '../parsing/ast'

export interface SGROutputBuilder {
    build(root: SGRAstNode): string
}
